"use client";

import { use } from "react";
import VehicleForm from "@/components/admin/VehicleForm";

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export default function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = use(params);
  const vehicleId = parseInt(id, 10);

  if (isNaN(vehicleId)) {
    return (
      <div className="p-6">
        <div className="max-w-3xl w-full">
          <div className="text-center text-red-600">ID không hợp lệ</div>
        </div>
      </div>
    );
  }

  return <VehicleForm vehicleId={vehicleId} />;
}
