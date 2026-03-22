"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Thông tin cửa hàng
    storeName: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: "",
    storeLogo: "",
    
    // SEO cơ bản
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    
    // Liên hệ
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
  });

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // TODO: Call API to save settings
    try {
      // await settingsApi.update(settings);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert("Đã lưu cài đặt thành công!");
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu cài đặt");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="w-full">
        <AdminPageHeader
          title="Cài đặt hệ thống"
          backHref="/admin"
          actions={
            <Button
              type="submit"
              variant="default"
              form="settings-form"
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Đang lưu..." : "Lưu cài đặt"}
            </Button>
          }
        />

        <form id="settings-form" onSubmit={handleSubmit}>
          <Card className="p-6">
            <div className="space-y-6">
              {/* Thông tin cửa hàng */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Thông tin cửa hàng
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên cửa hàng
                    </label>
                    <Input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleChange("storeName", e.target.value)}
                      placeholder="Nhập tên cửa hàng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    <Input
                      type="text"
                      value={settings.storeAddress}
                      onChange={(e) => handleChange("storeAddress", e.target.value)}
                      placeholder="Nhập địa chỉ cửa hàng"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <Input
                        type="tel"
                        value={settings.storePhone}
                        onChange={(e) => handleChange("storePhone", e.target.value)}
                        placeholder="0901234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={settings.storeEmail}
                        onChange={(e) => handleChange("storeEmail", e.target.value)}
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo cửa hàng (URL)
                    </label>
                    <Input
                      type="url"
                      value={settings.storeLogo}
                      onChange={(e) => handleChange("storeLogo", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* SEO cơ bản */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  SEO cơ bản
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <Input
                      type="text"
                      value={settings.metaTitle}
                      onChange={(e) => handleChange("metaTitle", e.target.value)}
                      placeholder="Tiêu đề SEO"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.metaTitle.length}/60 ký tự
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={settings.metaDescription}
                      onChange={(e) => handleChange("metaDescription", e.target.value)}
                      placeholder="Mô tả SEO"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.metaDescription.length}/160 ký tự
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Keywords
                    </label>
                    <Input
                      type="text"
                      value={settings.metaKeywords}
                      onChange={(e) => handleChange("metaKeywords", e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Thông tin liên hệ */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Thông tin liên hệ
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại liên hệ
                      </label>
                      <Input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => handleChange("contactPhone", e.target.value)}
                        placeholder="0901234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email liên hệ
                      </label>
                      <Input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleChange("contactEmail", e.target.value)}
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ liên hệ
                    </label>
                    <Input
                      type="text"
                      value={settings.contactAddress}
                      onChange={(e) => handleChange("contactAddress", e.target.value)}
                      placeholder="Nhập địa chỉ liên hệ"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
