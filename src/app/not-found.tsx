import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-20 pb-16 md:pb-20">
      <div className="w-full max-w-3xl text-center">
        {/* 404 Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative mx-auto w-full max-w-xl">
            <Image
              src="/404.webp"
              alt="404 Not Found"
              width={800}
              height={800}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Không Tìm Thấy Trang
        </h2>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-md text-lg text-gray-600">
          Rất tiếc, chúng tôi không tìm thấy trang mà bạn cần!
        </p>

        {/* Về Trang Chủ Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-primary-dark hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
