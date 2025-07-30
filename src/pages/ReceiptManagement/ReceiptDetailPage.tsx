"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Save, Plus, Pen, Trash2, ArrowLeft } from "lucide-react";

// Các trường chi tiết chứng từ mẫu, có thể chỉnh lại theo detail design
const detailFields = [
  { id: "itemName", label: "Tên khách hàng", required: true },
  { id: "descriptionVi", label: "Mô tả 2 Tiếng Việt", required: false },
  { id: "descriptionEn", label: "Mô tả 2 Tiếng Anh", required: false },
  { id: "descriptionKr", label: "Mô tả 2 Tiếng Hàn Quốc", required: false },
  { id: "country", label: "Quốc gia", required: false },
  { id: "debit", label: "Nợ", required: false },
  { id: "credit", label: "Có", required: false },
  { id: "amount", label: "Số tiền", required: true },
  { id: "fcAmount", label: "FC Số tiền", required: false },
  { id: "vat", label: "Thuế VAT", required: false },
  { id: "inventory", label: "Hàng tồn kho", required: false },
  { id: "asset", label: "Tài sản cố định/Chi phí trả trước", required: false },
  { id: "bankName", label: "Tên ngân hàng", required: false },
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

  const handleEdit = (idx: number) => {
    setForm(details[idx]);
    setEditingIndex(idx);
  };

  const handleDelete = (idx: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) setForm({});
  };

  const handleSave = () => {
    // TODO: Gọi API lưu phiếu thu và chi tiết
    alert("Đã lưu phiếu thu và chi tiết!");
    navigate("/receipt-management");
  };

  return (
    <div className="w-full mx-auto p-6">
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
              <label className="font-medium text-gray-700 mb-1">
                {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={form[field.id] || ""}
                onChange={e => handleChange(field.id, e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => setForm({})}
            className="w-10 h-10 flex items-center justify-center border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
            title="Hủy"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddDetail}
            className="w-10 h-10 flex items-center justify-center border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
            title={editingIndex !== null ? "Cập nhật dòng" : "Thêm dòng"}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bảng danh sách chi tiết */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Danh sách chi tiết chứng từ</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {detailFields.map(f => (
                  <th key={f.id} className="px-3 py-2 border-b text-xs font-semibold text-gray-700 whitespace-nowrap">{f.label}</th>
                ))}
                <th className="px-3 py-2 border-b text-xs font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {details.length === 0 ? (
                <tr><td colSpan={detailFields.length + 1} className="text-center py-4 text-gray-400">Chưa có dữ liệu</td></tr>
              ) : details.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  {detailFields.map(f => (
                    <td key={f.id} className="px-3 py-2 border-b text-sm">{row[f.id]}</td>
                  ))}
                  <td className="px-3 py-2 border-b flex gap-2">
                    <button onClick={() => handleEdit(idx)} className="w-8 h-8 flex items-center justify-center border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors" title="Sửa"><Pen size={16} /></button>
                    <button onClick={() => handleDelete(idx)} className="w-8 h-8 flex items-center justify-center border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors" title="Xóa"><Trash2 size={16} /></button>
                  </td>
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
