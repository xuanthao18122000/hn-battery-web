"use client";

import { useState, useEffect } from "react";
import Link from 'next/link'
import { ChevronRight, MapPin, Phone, Clock, Car } from 'lucide-react'
import { ICON_SIZE } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { contactApi, Store, CreateContactMessageDto } from '@/lib/api/contact'

const mockStores = [
  {
    id: 1,
    store_name: "Cửa hàng Ắc Quy Quận 1",
    store_address: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    phone: "028 3829 1234",
    latitude: 10.7769,
    longitude: 106.7009,
    open_at: "08:00",
    close_at: "20:00",
    is_car_parking: 1,
    iframe_location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1264!2d106.7009!3d10.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM2LjgiTiAxMDbCsDQyJzAzLjIiRQ!5e0!3m2!1sen!2s!4v1234567890" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
  },
  {
    id: 2,
    store_name: "Cửa hàng Ắc Quy Quận 3",
    store_address: "456 Lê Văn Sỹ, Phường 12, Quận 3, TP.HCM",
    phone: "028 3930 5678",
    latitude: 10.7831,
    longitude: 106.6954,
    open_at: "08:00",
    close_at: "20:00",
    is_car_parking: 0,
    iframe_location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1264!2d106.6954!3d10.7831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzU5LjIiTiAxMDbCsDQxJzQzLjQiRQ!5e0!3m2!1sen!2s!4v1234567890" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
  },
  {
    id: 3,
    store_name: "Cửa hàng Ắc Quy Quận 7",
    store_address: "789 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM",
    phone: "028 3775 9012",
    latitude: 10.7314,
    longitude: 106.7225,
    open_at: "08:00",
    close_at: "20:00",
    is_car_parking: 1,
    iframe_location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1264!2d106.7225!3d10.7314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQzJzUzLjAiTiAxMDbCsDQzJzIxLjAiRQ!5e0!3m2!1sen!2s!4v1234567890" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
  },
  {
    id: 4,
    store_name: "Cửa hàng Ắc Quy Quận Bình Thạnh",
    store_address: "321 Xô Viết Nghệ Tĩnh, Phường 25, Quận Bình Thạnh, TP.HCM",
    phone: "028 3512 3456",
    latitude: 10.8022,
    longitude: 106.7145,
    open_at: "08:00",
    close_at: "20:00",
    is_car_parking: 1,
    iframe_location: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1264!2d106.7145!3d10.8022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzA3LjkiTiAxMDbCsDQyJzUyLjIiRQ!5e0!3m2!1sen!2s!4v1234567890" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
  },
];


function checkOpenStatus(closeAt: string, openAt: string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [openHour, openMinute] = openAt.split(':').map(Number);
  const [closeHour, closeMinute] = closeAt.split(':').map(Number);
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  return currentTime >= openTime && currentTime < closeTime;
}

export default function ContactPage() {
  // API state
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Use mockup data as fallback
  const displayStores = stores.length > 0 ? stores : mockStores;
  const [selectedStore, setSelectedStore] = useState<Store>(displayStores[0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    content: ''
  });

  // Fetch stores from API
  useEffect(() => {
    fetchStores();
  }, []);

  // Update selectedStore when stores change
  useEffect(() => {
    if (displayStores.length > 0 && (!selectedStore || !displayStores.find(s => s.id === selectedStore.id))) {
      setSelectedStore(displayStores[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayStores]);

  const fetchStores = async () => {
    setIsLoadingStores(true);
    try {
      const apiStores = await contactApi.getStores();
      setStores(apiStores);
      if (apiStores.length > 0) {
        setSelectedStore(apiStores[0]);
      }
    } catch (error) {
      // Fallback to mockup data on error
      setStores([]);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const messageData: CreateContactMessageDto = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        content: formData.content,
      };

      await contactApi.sendMessage(messageData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        content: ''
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Không thể gửi tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col space-y-3 bg-secondary py-4">
        {/* Breadcrumbs Mobile */}
        <div className="w-full bg-white flex flex-col gap-2 antialiased md:hidden px-4">
          <div className="flex items-center gap-2 text-sm overflow-x-auto no-scrollbar">
            <Link href="/" className="text-gray-600 hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight size={ICON_SIZE.sm} className="text-gray-400" />
            <span className="text-primary">Liên hệ</span>
          </div>
        </div>

        {/* Mobile View */}
        <div className="w-full bg-secondary flex flex-col gap-2 antialiased md:hidden px-4">
          <div className="w-full">
            <div className="bg-gray-100 rounded p-2 mb-2">
              <p className="text-sm font-medium">
                {isLoadingStores ? "Đang tải..." : `Có ${displayStores.length} cửa hàng`}
              </p>
            </div>
            <div
              className="overflow-y-scroll bg-white border border-gray-200 p-2 flex flex-col gap-2 rounded"
              style={{ height: 300 }}
            >
              {displayStores.map((store) => {
                  const isOpen = checkOpenStatus(store.close_at, store.open_at);
                  return (
                    <div
                      onClick={() => handleStoreClick(store)}
                      className={cn(
                        "cursor-pointer flex flex-col gap-2 pt-2 border-b border-gray-200 last:border-b-0",
                        selectedStore?.id === store.id && "bg-white"
                      )}
                      key={store.id}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{store.store_name}</p>

                        <div className="flex items-center gap-2">
                          <MapPin size={ICON_SIZE.sm} className="text-gray-600 flex-shrink-0" />
                          <p className="text-xs text-gray-600">
                            {store.store_address || 'Đang cập nhật...'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone size={ICON_SIZE.sm} className="text-gray-600 flex-shrink-0" />
                          <a href={`tel:${store.phone}`} className="text-xs text-gray-600">
                            {store.phone}
                          </a>
                        </div>

                        {store.is_car_parking === 1 && (
                          <div className="flex items-center justify-start gap-2">
                            <Car size={ICON_SIZE.lg} className="text-gray-600 flex-shrink-0" />
                            <p className="text-xs text-gray-600">
                              Có chỗ đỗ xe ô tô
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-start gap-2">
                          <Clock size={ICON_SIZE.sm} className="text-gray-600 flex-shrink-0" />
                          <p
                            className={cn(
                              'text-xs font-bold',
                              isOpen ? 'text-status-open' : 'text-status-closed'
                            )}
                          >
                            {isOpen ? 'Đang hoạt động' : 'Đang đóng cửa'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-2 bg-secondary justify-center rounded overflow-hidden">
              {selectedStore?.iframe_location && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedStore.iframe_location
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="max-md:hidden container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-gray-600 hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight size={ICON_SIZE.sm} className="text-gray-400" />
            <span className="text-primary">Liên hệ</span>
          </div>

          <div className="p-4 mt-2 flex items-start gap-4 border border-gray-200 rounded-xl bg-white">
            <div className="w-96 flex-shrink-0 h-full">
              <div className="w-full flex-col">
                <h2 className="text-center mb-4 text-lg font-semibold">
                  Danh sách cửa hàng
                </h2>
                <div className="mb-2">
                  <p className="text-sm font-medium">
                    {isLoadingStores ? "Đang tải..." : `Có ${displayStores.length} cửa hàng`}
                  </p>
                </div>

                <div className="h-[350px] overflow-y-scroll bg-secondary rounded p-2 border border-gray-200">
                  {displayStores.map((store) => {
                    const isOpen = checkOpenStatus(store.close_at, store.open_at);
                    return (
                      <div
                        onClick={() => handleStoreClick(store)}
                        className={cn(
                          "cursor-pointer flex-col p-2 hover:bg-gray-50 border-b border-gray-200 last:border-b-0",
                          selectedStore?.id === store.id && "bg-white"
                        )}
                        key={store.id}
                      >
                        <p className="text-sm text-left font-medium mb-2">{store.store_name}</p>

                        <div className="pt-1">
                          <div className="flex items-center gap-2 pb-1">
                            <MapPin size={ICON_SIZE.sm} className="text-gray-600 shrink-0" />
                            <p className="text-xs text-gray-600 align-middle break-words">
                              {store.store_address || 'Đang cập nhật...'}
                            </p>
                          </div>

                          <div className="flex items-center justify-start gap-2 pb-1">
                            <Phone size={ICON_SIZE.sm} className="text-gray-600 shrink-0" />
                            <a
                              className="text-xs text-gray-600"
                              href={`tel:${store.phone}`}
                            >
                              {store.phone}
                            </a>
                          </div>

                          {store.is_car_parking === 1 && (
                            <div className="flex items-center justify-start gap-2 pb-1">
                              <Car size={ICON_SIZE.lg} className="text-gray-600 shrink-0" />
                              <p className="text-xs text-gray-600">
                                Có chỗ đỗ xe ô tô
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-start gap-2 pb-1">
                            <Clock size={ICON_SIZE.sm} className="text-gray-600 shrink-0" />
                            <p
                              className={cn(
                                'py-1 text-xs font-bold',
                                isOpen ? 'text-status-open' : 'text-status-closed'
                              )}
                            >
                              {isOpen ? 'Đang hoạt động' : 'Đóng cửa'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1 h-[450px] rounded-lg overflow-hidden">
              <div className="w-full h-full !p-0">
                {selectedStore?.iframe_location && (
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: selectedStore.iframe_location
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="container mx-auto ">
          <div className="w-full max-w-4xl mx-auto p-7 bg-white rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Gửi tin nhắn cho chúng tôi
            </h2>
            
            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ liên hệ lại sớm nhất có thể.
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Nhập email của bạn"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  placeholder="Nhập nội dung tin nhắn của bạn"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg transition-colors",
                  isSubmitting 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:bg-primary-dark"
                )}
              >
                {isSubmitting ? "Đang gửi..." : "GỬI ĐI"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
