"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "./button";
import { filesApi, FileEntity } from "@/lib/api/files";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn-web-stg.ddverp.com";

interface FileUploadProps {
  value?: string; // CDN path or URL
  onChange: (url: string) => void;
  object?: string;
  objectId?: string;
  objectType?: string;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  label?: string;
  helperText?: string;
}

export function FileUpload({
  value,
  onChange,
  object = "products",
  objectId = "temp",
  objectType = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = "",
  label,
  helperText,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const getImageUrl = useCallback((url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${CDN_URL}/${url}`;
  }, []);

  const processFile = async (file: File) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File quá lớn. Kích thước tối đa: ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // Validate file type
    if (accept.includes("image/*") && !file.type.startsWith("image/")) {
      setError("Chỉ chấp nhận file hình ảnh");
      return;
    }

    setError("");
    setUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploadedFile = await filesApi.upload(file, {
        object,
        object_id: objectId,
        object_type: objectType,
      });

      // Update form with the CDN path
      onChange(uploadedFile.path);
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload thất bại. Vui lòng thử lại.");
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  // Update preview when value changes externally
  useEffect(() => {
    if (value) {
      const url = getImageUrl(value);
      setPreview(url);
    } else {
      setPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {/* Preview Area */}
        {preview && (
          <div className="flex flex-col gap-3">
            <div className="relative inline-block w-fit">
              <div className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 group shadow-sm">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                {!uploading && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    title="Xóa ảnh"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {/* Change Image Button (when preview exists) */}
            {!uploading && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClick}
                className="flex items-center gap-2 w-fit"
              >
                <ImageIcon className="w-4 h-4" />
                Thay đổi ảnh
              </Button>
            )}
          </div>
        )}

        {/* Upload Button */}
        {!preview && (
          <div
            ref={dropZoneRef}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center w-full h-32
              border-2 border-dashed rounded-lg cursor-pointer
              transition-all duration-200
              ${error
                ? "border-red-300 bg-red-50"
                : uploading
                ? "border-blue-300 bg-blue-50"
                : isDragging
                ? "border-blue-400 bg-blue-50 scale-[1.02]"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Đang upload...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">Click để upload</span> hoặc kéo thả
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF tối đa {(maxSize / 1024 / 1024).toFixed(2)}MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Hidden input for when preview exists */}
        {preview && (
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    </div>
  );
}
