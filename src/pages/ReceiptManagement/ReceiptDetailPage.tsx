"use client";
import { useState, useRef, useEffect } from "react";
import { TableSettings } from "@/components/table/TableSettings";
import { useNavigate } from "react-router-dom";
import { X, Save, Plus, ArrowLeft, Filter } from "lucide-react";

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

// Định nghĩa lại ColumnConfigLocal để tương thích TableSettings
import type { ColumnConfig } from "@/types/table";
const defaultColumns: ColumnConfig[] = [
  { id: "customerName", dataField: "customerName", displayName: "Tên khách hàng", width: 150, visible: true, pinned: false, originalOrder: 0 },
  { id: "customerCode", dataField: "customerCode", displayName: "Mã khách hàng", width: 120, visible: true, pinned: false, originalOrder: 1 },
  { id: "country", dataField: "country", displayName: "Quốc gia", width: 100, visible: true, pinned: false, originalOrder: 2 },
  { id: "bankName", dataField: "bankName", displayName: "Tên ngân hàng", width: 150, visible: true, pinned: false, originalOrder: 3 },
  { id: "managementCode", dataField: "managementCode", displayName: "Mã số quản lý", width: 130, visible: true, pinned: false, originalOrder: 4 },
  { id: "costObject", dataField: "costObject", displayName: "Đối tượng tập hợp chi phí", width: 180, visible: true, pinned: false, originalOrder: 5 },
  { id: "noteCode", dataField: "noteCode", displayName: "Mã ghi chú", width: 120, visible: true, pinned: false, originalOrder: 6 },
  { id: "exchangeRate", dataField: "exchangeRate", displayName: "Tỷ giá giao dịch", width: 120, visible: true, pinned: false, originalOrder: 7 },
  { id: "contractNumber", dataField: "contractNumber", displayName: "Số hợp đồng", width: 140, visible: true, pinned: false, originalOrder: 8 },
  { id: "costObject2", dataField: "costObject2", displayName: "Đối tượng tập hợp chi phí 2", width: 180, visible: true, pinned: false, originalOrder: 9 },
];

export default function ReceiptDetailPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [details, setDetails] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // Cấu hình cột động
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  // Sticky positions (nếu có ghim cột)
  const stickyPositions = {};

  // Hàm cập nhật cột (visible, width, pinned, displayName...)
  const handleColumnChange = (columnId: string, field: keyof ColumnConfig, value: any) => {
    setColumns(cols => cols.map(col =>
      col.id === columnId ? { ...col, [field]: value } : col
    ));
  };
  // Đặt lại về mặc định
  const handleResetColumns = () => setColumns(defaultColumns);

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
    <div className="w-full mx-auto  text-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
          {detailFields.map((field) => (
            <div key={field.id} className="flex items-center">
              <label
                className="w-40 min-w-[120px] text-right pr-3 font-medium text-gray-700 text-sm truncate whitespace-nowrap overflow-hidden relative group cursor-pointer"
              >
                {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                {/* Tooltip */}
                <span className="absolute left-1/2 top-full z-50 mt-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all -translate-x-1/2">
                  {field.label}
                </span>
              </label>
              <input
                type="text"
                value={form[field.id] || ""}
                onChange={e => handleChange(field.id, e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-sm"
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Danh sách chi tiết chứng từ</h2>
          {/* Nút mở popup cài đặt cột dạng slide phải */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors relative group"
            title="Cài đặt cột"
            aria-label="Cài đặt cột"
            type="button"
          >
            <Filter size={20} />
            {/* Tooltip */}
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all">
              Cài đặt cột
            </span>
          </button>
          {showSettings && (
            <TableSettings
              columns={columns}
              onColumnChange={handleColumnChange}
              onClose={() => setShowSettings(false)}
              onReset={handleResetColumns}
              stickyPositions={stickyPositions}
            />
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                {columns.filter(c => c.visible).map(col => (
                  <th
                    key={col.id}
                    className="px-3 py-2 border-b text-xs font-semibold text-gray-700 text-left"
                    style={{ width: `${col.width}px`, minWidth: `${col.width}px` }}
                  >
                    {col.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {details.length === 0 && (
                <tr>
                  {columns.filter(c => c.visible).map(col => (
                    <td
                      key={col.id}
                      className="px-3 py-2 border border-gray-300 text-sm bg-white"
                      style={{ width: `${col.width}px`, minWidth: `${col.width}px` }}
                    >
                      <input
                        type="text"
                        placeholder={`Nhập ${col.displayName}`}
                        onChange={e => {
                          const newRow = columns.reduce<Record<string, string>>((acc, c) => {
                            acc[c.id] = c.id === col.id ? e.target.value : "";
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
                  {columns.filter(c => c.visible).map(col => (
                    <td
                      key={col.id}
                      className="px-3 py-2 border border-gray-300 text-sm bg-white"
                      style={{ width: `${col.width}px`, minWidth: `${col.width}px` }}
                    >
                      <input
                        type="text"
                        value={row[col.id] || ""}
                        onChange={e => {
                          const updatedDetails = [...details];
                          updatedDetails[idx][col.id] = e.target.value;
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
