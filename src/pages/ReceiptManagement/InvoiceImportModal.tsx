"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Save } from "lucide-react";

interface InvoiceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void> | void;
}

export default function InvoiceImportModal({
  isOpen,
  onClose,
  onSubmit,
}: InvoiceImportModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setActiveTab(0);
    }
  }, [isOpen]);

  const tabConfigs = [
    {
      label: "Thông tin bên bán",
      fields: [
        { id: "sellerCompanyName", label: "Tên công ty", required: true },
        { id: "sellerAddress", label: "Địa chỉ", required: true },
        { id: "sellerPhone", label: "Điện thoại", required: true },
        { id: "sellerTaxCode", label: "MST", required: true },
      ],
    },
    {
      label: "Thông tin bên mua",
      fields: [
        { id: "buyerCustomerCode", label: "Mã số khách hàng", required: true },
        { id: "buyerCompanyName", label: "Tên công ty", required: true },
        { id: "buyerAddress", label: "Địa chỉ", required: true },
        { id: "buyerPhone", label: "Điện thoại", required: true },
        { id: "buyerTaxCode", label: "MST", required: true },
      ],
    },
    {
      label: "Thông tin hóa đơn",
      fields: [
        { id: "invoiceTemplate", label: "Mẫu hóa đơn", required: true },
        { id: "invoiceSymbol", label: "Ký hiệu hóa đơn", required: true },
        { id: "invoiceNumber", label: "Số", required: true },
        { id: "invoiceDate", label: "Ngày hóa đơn", required: true },
        { id: "discount", label: "Chiết khấu, giảm giá", required: false },
        { id: "totalAmount", label: "Cộng tiền hàng", required: true },
        { id: "vatAmount", label: "Tiền thuế GTGT", required: true },
      ],
    },
  ];

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleNext = () => {
    setActiveTab((prev) => prev + 1);
  };

  const handlePrev = () => {
    setActiveTab((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900">Nhập XML e-invoice</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <nav className="flex space-x-2 px-4 overflow-x-auto">
            {tabConfigs.map((tab, idx) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === idx
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tabConfigs[activeTab].fields.map((field) => (
                <div key={field.id} className="flex flex-col">
                  <label htmlFor={field.id} className="font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type="text"
                    value={formData[field.id] || ""}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-white flex-shrink-0">
            {activeTab > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {activeTab < tabConfigs.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {activeTab === tabConfigs.length - 1 && (
              <button
                type="submit"
                className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <Save className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
