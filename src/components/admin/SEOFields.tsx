import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export interface SEOFieldsData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  metaRobots: string;
  canonicalUrl: string;
}

interface SEOFieldsProps {
  value: SEOFieldsData;
  onChange: (data: SEOFieldsData) => void;
  canonicalPlaceholder?: string;
  keywordsExample?: string;
}

export default function SEOFields({
  value,
  onChange,
  canonicalPlaceholder = "https://example.com/slug",
  keywordsExample = "keyword1, keyword2, keyword3",
}: SEOFieldsProps) {
  const handleChange = (field: keyof SEOFieldsData, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
        <Input
          value={value.metaTitle}
          onChange={(e) => handleChange("metaTitle", e.target.value)}
          placeholder="Nhập meta title (tối đa 60 ký tự)"
          maxLength={60}
        />
        <p className="text-xs text-gray-500 mt-1">
          {value.metaTitle.length}/60 ký tự
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
        <textarea
          value={value.metaDescription}
          onChange={(e) => handleChange("metaDescription", e.target.value)}
          placeholder="Nhập meta description (tối đa 160 ký tự)"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          maxLength={160}
        />
        <p className="text-xs text-gray-500 mt-1">
          {value.metaDescription.length}/160 ký tự
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
        <Input
          value={value.metaKeywords}
          onChange={(e) => handleChange("metaKeywords", e.target.value)}
          placeholder="Nhập keywords (phân cách bằng dấu phẩy)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ví dụ: {keywordsExample}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Robots</label>
        <Select
          value={value.metaRobots}
          onChange={(value) => handleChange("metaRobots", value)}
          options={[
            { value: "index,follow", label: "index, follow" },
            { value: "index,nofollow", label: "index, nofollow" },
            { value: "noindex,follow", label: "noindex, follow" },
            { value: "noindex,nofollow", label: "noindex, nofollow" },
          ]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
        <Input
          value={value.canonicalUrl}
          onChange={(e) => handleChange("canonicalUrl", e.target.value)}
          placeholder={canonicalPlaceholder}
        />
        <p className="text-xs text-gray-500 mt-1">
          URL chính thức của trang (để tránh duplicate content)
        </p>
      </div>
    </div>
  );
}
