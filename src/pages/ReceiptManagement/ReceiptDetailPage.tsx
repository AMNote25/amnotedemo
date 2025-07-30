"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Save, Plus, ArrowLeft } from "lucide-react";

// Các trường chi tiết chứng từ mẫu, có thể chỉnh lại theo detail design
const detailFields = [
  { id: "date", label: "Tại ngày", required: true },
  { id: "categoryName", label: "Tên danh mục", required: true },
  { id: "reference", label: "Tham chiếu", required: false },
  { id: "status", label: "Tình trạng tự động chèn vào", required: false },
  { id: "recipient", label: "Người nhận tiền/người nộp tiền", required: true },
  { id: "fullName", label: "Họ và tên", required: true },
  { id: "email", label: "Email", required: false },
  { id: "displayColumns", label: "Cột hiển thị", required: false },
  { id: "note", label: "Ghi chú", required: false },
  { id: "debtDate", label: "Số ngày nợ", required: false },
  { id: "paymentDeadline", label: "Hạn thanh toán", required: true },
];

const tableFields = [
  { id: "customerName", label: "Tên khách hàng" },
  { id: "customerCode", label: "Mã khách hàng" },
  { id: "country", label: "Quốc gia" },
  { id: "bankName", label: "Tên ngân hàng" },
  { id: "managementCode", label: "Mã số quản lý" },
  { id: "costObject", label: "Đối tượng tập hợp chi phí" },
  { id: "noteCode", label: "Mã ghi chú" },
  { id: "exchangeRate", label: "Tỷ giá giao dịch" },
  { id: "contractNumber", label: "Số hợp đồng" },
  { id: "costObject2", label: "Đối tượng tập hợp chi phí 2" },
];

export default function ReceiptDetailPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [details, setDetails] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleChange = (id: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleAddDetail = () => {
    if (!form.itemName || !form.amount) return;
    if (editingIndex !== null) {
      // Sửa dòng
      setDetails((prev) => prev.map((d, i) => (i === editingIndex ? { ...form } : d)));
      setEditingIndex(null);
    } else {
      setDetails((prev) => [...prev, { ...form }]);
    }
    setForm({});
  };

  const handleSave = () => {
    // TODO: Gọi API lưu phiếu thu và chi tiết
    alert("Đã lưu phiếu thu và chi tiết!");
    navigate("/receipt-management");
  };

  return (
    <div className="w-full mx-auto p-6 text-sm">
      {/* Nút quay lại */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>
      </div>
      {/* Form nhập chi tiết chứng từ */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Chi tiết chứng từ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {detailFields.map((field) => (
            <div key={field.id} className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1 text-sm">
                {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={form[field.id] || ""}
                onChange={e => handleChange(field.id, e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-sm"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setForm({})}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
            title="Hủy"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Hủy</span>
          </button>
          <button
            onClick={handleAddDetail}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
            title={editingIndex !== null ? "Cập nhật dòng" : "Thêm dòng"}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{editingIndex !== null ? "Cập nhật" : "Thêm"}</span>
          </button>
        </div>
      </div>

      {/* Bảng danh sách chi tiết */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách chi tiết chứng từ</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                {tableFields.map((field) => (
                  <th key={field.id} className="px-3 py-2 border-b text-xs font-semibold text-gray-700 text-left">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {details.length === 0 && (
                <tr>
                  {tableFields.map((field) => (
                    <td key={field.id} className="px-3 py-2 border border-gray-300 text-sm bg-white">
                      <input
                        type="text"
                        placeholder={`Nhập ${field.label}`}
                        onChange={(e) => {
                          const newRow = tableFields.reduce<Record<string, string>>((acc, f) => {
                            acc[f.id] = f.id === field.id ? e.target.value : "";
                            return acc;
                          }, {});
                          setDetails([newRow]);
                        }}
                        className="w-full border-none focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              )}
              {details.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  {tableFields.map((field) => (
                    <td key={field.id} className="px-3 py-2 border border-gray-300 text-sm bg-white">
                      <input
                        type="text"
                        value={row[field.id] || ""}
                        onChange={(e) => {
                          const updatedDetails = [...details];
                          updatedDetails[idx][field.id] = e.target.value;
                          setDetails(updatedDetails);
                        }}
                        className="w-full border-none focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Save className="w-5 h-5" />
            Lưu phiếu thu
          </button>
        </div>
      </div>
    </div>
  );
}
