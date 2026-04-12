"use client";

import { ChevronDown, ChevronUp, List } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

// ── Types ───────────────────────────────────────────────────
interface TocItem {
	id: string;
	text: string;
	level: number; // 2 = h2, 3 = h3
}

export interface ParseHtmlContentProps {
	html: string;
	/** Max collapsed height in px (default: 497) */
	collapsedHeight?: number;
	/** Number of TOC entries visible before toggle (default: 5) */
	tocVisibleCount?: number;
	/** Bật/tắt nút "Xem thêm / Thu gọn" (default: true). Khi false sẽ show full nội dung. */
	collapsible?: boolean;
}

const EDITOR_CLASS_NAME =
	"category-description pdp-prose content-editor text-base text-gray-700 leading-[1.65] \
[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 \
[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-3 \
[&_img]:mx-auto [&_img]:block [&_img]:max-w-full \
[&_figure]:mx-auto [&_figure]:text-center \
[&_.aligncenter]:mx-auto [&_.aligncenter]:block \
[&_.wp-caption]:text-center [&_.wp-caption]:mx-auto \
[&_p]:mb-4 [&_p]:text-justify \
[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-2 \
[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:mb-2 \
[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-[14px] \
[&_table_td]:p-2 [&_table_td]:border [&_table_td]:border-gray-200 [&_table_td]:align-middle \
[&_table_th]:p-2 [&_table_th]:border [&_table_th]:border-gray-200 [&_table_th]:bg-gray-100 [&_table_th]:font-semibold \
[&_table_td:first-child]:font-semibold [&_table_td:first-child]:text-gray-900 [&_table_td:first-child]:w-1/3 [&_table_td:first-child]:bg-gray-50 \
[&_table_tr:nth-child(even)_td]:bg-gray-50/50 \
[&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline \
[&_strong]:font-bold [&_strong]:text-gray-900 \
[&_b]:font-bold [&_b]:text-gray-900";

// ── Heading parser ──────────────────────────────────────────

function stripTags(html: string): string {
	return html.replace(/<[^>]*>/g, "").trim();
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

/**
 * Extract a readable label from a URL path.
 * e.g. "https://didongviet.vn/dien-thoai/iphone-16-pro-max.html"
 *   → "iphone 16 pro max"
 */
function labelFromHref(href: string): string {
	try {
		const pathname = new URL(href).pathname;
		// Get last meaningful segment, strip extension
		const segment = pathname
			.replace(/\.\w+$/, "")
			.split("/")
			.filter(Boolean)
			.pop();
		if (!segment) return "";
		return segment.replace(/[-_]/g, " ").trim();
	} catch {
		return "";
	}
}

/** Extract alt text from <img> inside link content */
function extractImgAlt(html: string): string {
	const match = html.match(/alt=["']([^"']*)["']/i);
	return match?.[1]?.trim() ?? "";
}

const GENERIC_LINK_TEXTS = new Set([
	"click here",
	"xem thêm",
	"xem ngay",
	"tại đây",
	"here",
	"read more",
	"xem chi tiết",
	"chi tiết",
	"tìm hiểu thêm",
	"learn more",
	"more",
	"link",
]);

/**
 * Post-process CMS HTML links for SEO:
 * - Remove links with empty/invalid href
 * - Add rel + target for external links
 * - Add aria-label for generic text / icon-only / image-only links
 */
function fixHtmlLinks(html: string): string {
	return html.replace(
		/<a\s([^>]*)>([\s\S]*?)<\/a>/gi,
		(_match, attrs: string, content: string) => {
			const hrefMatch = attrs.match(/href=["']([^"']*)["']/);
			const href = hrefMatch?.[1] ?? "";

			// Remove links with empty or hash-only href
			if (!href || href === "#" || href.startsWith("javascript:")) {
				return content;
			}

			const isExternal =
				href.startsWith("http://") || href.startsWith("https://");

			let newAttrs = attrs;

			// Add rel for external links
			if (isExternal && !attrs.includes("rel=")) {
				newAttrs += ' rel="noopener noreferrer"';
			}

			// Add target for external links
			if (isExternal && !attrs.includes("target=")) {
				newAttrs += ' target="_blank"';
			}

			// Fix descriptive text for SEO
			if (!attrs.includes("aria-label")) {
				const textContent = stripTags(content).trim();
				const textLower = textContent.toLowerCase();
				const isGeneric = GENERIC_LINK_TEXTS.has(textLower);
				const isEmpty = textContent.length === 0;

				if (isGeneric || isEmpty) {
					// Try: img alt → URL path → fallback
					const label =
						extractImgAlt(content) ||
						labelFromHref(href) ||
						textContent;
					if (label) {
						const escaped = label
							.replace(/&/g, "&amp;")
							.replace(/"/g, "&quot;");
						newAttrs += ` aria-label="${escaped}"`;
					}
				}
			}

			return `<a ${newAttrs}>${content}</a>`;
		},
	);
}

/**
 * Post-process CMS HTML images:
 * - Add native loading="lazy" for performance
 * - Add fallback alt text for SEO
 * - Strip images with broken or empty src
 */
function fixHtmlImages(html: string): string {
	// 1. Add loading="lazy" to all <img> tags that don't have it
	let updated = html.replace(
		/<img\b(?![^>]*loading=)/gi,
		'<img loading="lazy"',
	);

	// 2. Add fallback alt="Hình ảnh" if missing
	updated = updated.replace(
		/<img\b(?![^>]*alt=)([^>]*)>/gi,
		'<img alt="Hình ảnh"$1>',
	);

	// 3. Remove <img> tags without valid src
	updated = updated.replace(/<img\b[^>]*>/gi, (match) => {
		const srcMatch = match.match(/src\s*=\s*["']([^"']*)["']/i);
		if (!srcMatch || !srcMatch[1]) return "";

		const src = srcMatch[1].trim();
		const isValidSrc =
			src.startsWith("http://") ||
			src.startsWith("https://") ||
			src.startsWith("data:") ||
			src.startsWith("/") ||
			src.startsWith("./") ||
			src.match(/^[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/);

		return isValidSrc ? match : "";
	});

	return updated;
}

function parseDescriptionHeadings(html: string): {
	toc: TocItem[];
	htmlWithIds: string;
} {
	const toc: TocItem[] = [];
	const usedIds = new Set<string>();

	const htmlWithIds = html.replace(
		/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
		(_match, tag: string, attrs: string, content: string) => {
			const text = stripTags(content);
			let id = slugify(text);

			if (usedIds.has(id)) {
				let i = 2;
				while (usedIds.has(`${id}-${i}`)) i++;
				id = `${id}-${i}`;
			}
			usedIds.add(id);

			const level = tag.toLowerCase() === "h2" ? 2 : 3;
			toc.push({ id, text, level });

			return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
		},
	);

	return { toc, htmlWithIds };
}

// ── TOC numbering ───────────────────────────────────────────

function numberToc(items: TocItem[]): { item: TocItem; label: string }[] {
	let h2Index = 0;
	let h3Index = 0;

	return items.map((item) => {
		if (item.level === 2) {
			h2Index++;
			h3Index = 0;
			return { item, label: `${h2Index}` };
		}
		h3Index++;
		return { item, label: `${h2Index}.${h3Index}` };
	});
}

// ── Component ───────────────────────────────────────────────

export default function ParseHtmlContent({
	html,
	collapsedHeight = 497,
	tocVisibleCount = 5,
	collapsible = true,
}: ParseHtmlContentProps) {
	const [expanded, setExpanded] = useState(!collapsible);
	const [tocOpen, setTocOpen] = useState(true);
	const [tocExpanded, setTocExpanded] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	const { toc, htmlWithIds } = useMemo(() => {
		let fixed = fixHtmlLinks(html);
		fixed = fixHtmlImages(fixed);
		return parseDescriptionHeadings(fixed);
	}, [html]);

	const numberedToc = useMemo(() => numberToc(toc), [toc]);

	const visibleToc = useMemo(() => {
		if (tocExpanded || numberedToc.length <= tocVisibleCount) {
			return numberedToc;
		}
		return numberedToc.slice(0, tocVisibleCount);
	}, [numberedToc, tocExpanded, tocVisibleCount]);

	const hasTocOverflow = numberedToc.length > tocVisibleCount;

	const handleTocClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
			e.preventDefault();
			if (!expanded) setExpanded(true);

			requestAnimationFrame(() => {
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			});
		},
		[expanded],
	);

	const htmlWithIdsConvert = htmlWithIds?.replace(/_quot/g, '"');

	return (
		<div className="relative overflow-hidden rounded-2xl bg-white">
			<div
				className={
					collapsible
						? "relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
						: "relative"
				}
				style={
					collapsible
						? {
								maxHeight: expanded
									? `${contentRef.current?.scrollHeight || 10000}px`
									: `${collapsedHeight}px`,
							}
						: undefined
				}
			>
				<div
					ref={contentRef}
					className="flex flex-col gap-2 md:gap-4 p-2 md:p-4"
				>
					{/* TOC */}
					{toc.length > 0 && (
						<div className="rounded-lg bg-bg-page">
							<button
								type="button"
								className="flex w-full items-center justify-between gap-2 px-3 py-2"
								onClick={() => setTocOpen((v) => !v)}
								aria-expanded={tocOpen}
								aria-label="Mở rộng hoặc thu gọn mục lục"
							>
								<div className="flex items-center gap-2">
									<List
										className="h-4 w-4 text-text-secondary"
										aria-hidden="true"
									/>
									<span className="text-sm leading-5 font-medium text-text-secondary">
										Nội dung chính
									</span>
								</div>
								{tocOpen ? (
									<ChevronUp
										className="h-4 w-4 text-text-secondary"
										aria-hidden="true"
									/>
								) : (
									<ChevronDown
										className="h-4 w-4 text-text-secondary"
										aria-hidden="true"
									/>
								)}
							</button>

							{tocOpen && (
								<nav
									className="flex flex-col px-3 pb-3"
									aria-label="Mục lục nội dung"
								>
									{visibleToc.map(({ item, label }) => (
										<a
											key={item.id}
											href={`#${item.id}`}
											className={`py-0.5 text-left text-sm leading-5 text-text-secondary no-underline transition-colors hover:text-text-link ${
												item.level === 3 ? "pl-2.5" : ""
											}`}
											onClick={(e) =>
												handleTocClick(e, item.id)
											}
										>
											{label}. {item.text}
										</a>
									))}

									{hasTocOverflow && (
										<button
											type="button"
											className="mt-1 text-left text-sm leading-5 font-medium text-text-link transition-colors hover:underline"
											onClick={() =>
												setTocExpanded((v) => !v)
											}
										>
											{tocExpanded
												? "Thu gọn mục lục"
												: "Xem tất cả mục lục"}
										</button>
									)}
								</nav>
							)}
						</div>
					)}

					{/* Description HTML content — CMS from API */}
					<div
						className={EDITOR_CLASS_NAME}
						// biome-ignore lint/security/noDangerouslySetInnerHtml: CMS HTML content, sanitized server-side
						dangerouslySetInnerHTML={{ __html: htmlWithIdsConvert }}
					/>
				</div>

				{collapsible && !expanded && (
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-white to-transparent" />
				)}
			</div>

			{collapsible && (
				<div className="pb-4 pt-2 text-center">
					<button
						type="button"
						className="inline-flex items-center gap-1 text-sm font-medium text-text-link hover:underline"
						aria-expanded={expanded}
						onClick={() => setExpanded((v) => !v)}
					>
						{expanded ? "Thu gọn" : "Xem thêm"}
						<ChevronDown
							className={`h-5 w-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
							aria-hidden="true"
						/>
					</button>
				</div>
			)}
		</div>
	);
}
