"use client";
import { useState, useRef, useEffect } from "react";
import { TableSettings } from "@/components/table/TableSettings";
import { useNavigate } from "react-router-dom";
import { Save, Plus, ArrowLeft, Filter, Banknote, Receipt } from "lucide-react";

// Các trường chi tiết chứng từ mẫu, có thể chỉnh lại theo detail design
const detailFields = [
  { id: "soChungTu", label: "Số chứng từ", required: true },
  { id: "date", label: "Tại ngày", required: true },
  { id: "categoryName", label: "Tên danh mục", required: true },
  { id: "reference", label: "Tham chiếu", required: false },
  { id: "fullName", label: "Họ và tên", required: true },
  { id: "email", label: "Email", required: false },
  { id: "displayColumns", label: "Cột hiển thị", required: false },
  { id: "note", label: "Ghi chú", required: false },
  { id: "debtDate", label: "Số ngày nợ", required: false },
  { id: "paymentDeadline", label: "Hạn thanh toán", required: true },
  { id: "description1", label: "Mô tả 1", required: false, multilingual: true },
];

// Định nghĩa lại ColumnConfigLocal để tương thích TableSettings
import type { ColumnConfig } from "@/types/table";
const defaultColumns: ColumnConfig[] = [
  { id: "soChungTu", dataField: "soChungTu", displayName: "Số chứng từ", width: 120, visible: true, pinned: false, originalOrder: 0 },
  { id: "ngayGiaoDich", dataField: "ngayGiaoDich", displayName: "Ngày giao dịch", width: 120, visible: true, pinned: false, originalOrder: 1 },
  { id: "soHoaDon", dataField: "soHoaDon", displayName: "Số hóa đơn", width: 120, visible: true, pinned: false, originalOrder: 2 },
  { id: "ngayHoaDon", dataField: "ngayHoaDon", displayName: "Ngày hóa đơn", width: 120, visible: true, pinned: false, originalOrder: 3 },
  { id: "moTa", dataField: "moTa", displayName: "Mô tả", width: 200, visible: true, pinned: false, originalOrder: 4 },
  { id: "hanThanhToan", dataField: "hanThanhToan", displayName: "Hạn thanh toán", width: 130, visible: true, pinned: false, originalOrder: 5 },
  { id: "soTien", dataField: "soTien", displayName: "Số tiền", width: 120, visible: true, pinned: false, originalOrder: 6 },
  { id: "soTienConLai", dataField: "soTienConLai", displayName: "Số tiền còn lại", width: 130, visible: true, pinned: false, originalOrder: 7 },
  { id: "soTienTra", dataField: "soTienTra", displayName: "Số tiền trả", width: 120, visible: true, pinned: false, originalOrder: 8 },
  { id: "customerName", dataField: "customerName", displayName: "Tên khách hàng", width: 150, visible: true, pinned: false, originalOrder: 9 },
  { id: "customerCode", dataField: "customerCode", displayName: "Mã khách hàng", width: 120, visible: true, pinned: false, originalOrder: 10 },
  { id: "country", dataField: "country", displayName: "Quốc gia", width: 100, visible: true, pinned: false, originalOrder: 11 },
  { id: "bankName", dataField: "bankName", displayName: "Tên ngân hàng", width: 150, visible: true, pinned: false, originalOrder: 12 },
  { id: "managementCode", dataField: "managementCode", displayName: "Mã số quản lý", width: 130, visible: true, pinned: false, originalOrder: 13 },
  { id: "costObject", dataField: "costObject", displayName: "Đối tượng tập hợp chi phí", width: 180, visible: true, pinned: false, originalOrder: 14 },
  { id: "noteCode", dataField: "noteCode", displayName: "Mã ghi chú", width: 120, visible: true, pinned: false, originalOrder: 15 },
  { id: "exchangeRate", dataField: "exchangeRate", displayName: "Tỷ giá giao dịch", width: 120, visible: true, pinned: false, originalOrder: 16 },
  { id: "contractNumber", dataField: "contractNumber", displayName: "Số hợp đồng", width: 140, visible: true, pinned: false, originalOrder: 17 },
  { id: "costObject2", dataField: "costObject2", displayName: "Đối tượng tập hợp chi phí 2", width: 180, visible: true, pinned: false, originalOrder: 18 },
];

export default function ReceiptDetailPage() {
  // Hàm lưu phiếu thu và chi tiết
  const handleSave = () => {
    // TODO: Gọi API lưu phiếu thu và chi tiết
    alert("Đã lưu phiếu thu và chi tiết!");
    navigate("/receipt-management");
  };
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [details, setDetails] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // Cấu hình cột động
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  // State cho đa ngôn ngữ mô tả
  const [multilingualFields, setMultilingualFields] = useState<{[key: string]: {vi: string, en: string, ko: string}}>({
    description1: { vi: "", en: "", ko: "" }
  });
  // State cho popup khách hàng
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [customerList] = useState([
    { id: 1, customerName: "Công ty TNHH ABC", customerCode: "KH001", country: "Việt Nam", bankName: "Vietcombank", managementCode: "VCB001" },
    { id: 2, customerName: "Công ty CP XYZ", customerCode: "KH002", country: "Hàn Quốc", bankName: "Shinhan Bank", managementCode: "SHB002" },
    { id: 3, customerName: "Tập đoàn DEF", customerCode: "KH003", country: "Nhật Bản", bankName: "MUFG Bank", managementCode: "MUFG003" },
    { id: 4, customerName: "Doanh nghiệp GHI", customerCode: "KH004", country: "Thái Lan", bankName: "Bangkok Bank", managementCode: "BBL004" },
    { id: 5, customerName: "Công ty JKL Co., Ltd", customerCode: "KH005", country: "Singapore", bankName: "DBS Bank", managementCode: "DBS005" }
  ]);
  // State cho popup thanh toán chứng từ
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('VND');
  const [selectedOtherCurrency, setSelectedOtherCurrency] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState<any>(null);
  const [customerDebts, setCustomerDebts] = useState<any[]>([]);
  const [hideDebt, setHideDebt] = useState(false);
  const [selectedDebtIds, setSelectedDebtIds] = useState<number[]>([]);
  
  // Dữ liệu mẫu chứng từ công nợ
  const debtList = [
    { id: 1, customerId: 1, soChungTu: "CT001", ngayGiaoDich: "2024-01-15", soHoaDon: "HD001", ngayHoaDon: "2024-01-15", moTa: "Thanh toán hàng hóa", hanThanhToan: "2024-02-15", soTien: 50000000, soTienConLai: 30000000, soTienTra: 0 },
    { id: 2, customerId: 1, soChungTu: "CT002", ngayGiaoDich: "2024-01-20", soHoaDon: "HD002", ngayHoaDon: "2024-01-20", moTa: "Dịch vụ tư vấn", hanThanhToan: "2024-02-20", soTien: 25000000, soTienConLai: 25000000, soTienTra: 0 },
    { id: 3, customerId: 2, soChungTu: "CT003", ngayGiaoDich: "2024-01-25", soHoaDon: "HD003", ngayHoaDon: "2024-01-25", moTa: "Xuất khẩu sản phẩm", hanThanhToan: "2024-02-25", soTien: 75000000, soTienConLai: 75000000, soTienTra: 0 },
  ];
  
  const exchangeRates = {
    'KRW': 18, // 1 USD = 18 VND (ví dụ)
    'SGD': 17000, // 1 SGD = 17000 VND
    'CNY': 3200, // 1 CNY = 3200 VND  
    'THB': 650 // 1 THB = 650 VND
  };
  // Sticky positions (nếu có ghim cột)
  // Tính toán vị trí left cho các cột pinned
  const stickyPositions = (() => {
    const visibleColumns = columns.filter(col => col.visible);
    const pinnedColumns = visibleColumns.filter(col => col.pinned);
    const positions: { [key: string]: number } = {};
    let currentLeft = 0;
    pinnedColumns.forEach(col => {
      positions[col.id] = currentLeft;
      currentLeft += col.width;
    });
    return positions;
  })();

  // Hàm lấy style sticky cho header cột
  const getHeaderColumnStyle = (col: ColumnConfig) => {
    if (!col.pinned) return {};
    return {
      position: "sticky" as const,
      left: stickyPositions[col.id],
      zIndex: 11,
      background: "#f5f5f5",
    };
  };
  // Hàm lấy style sticky cho cell
  const getCellColumnStyle = (col: ColumnConfig) => {
    if (!col.pinned) return {};
    return {
      position: "sticky" as const,
      left: stickyPositions[col.id],
      zIndex: 10,
      background: "white",
    };
  };

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

  // Hàm xử lý thay đổi cho trường đa ngôn ngữ
  const handleMultilingualChange = (fieldId: string, language: string, value: string) => {
    setMultilingualFields(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [language]: value
      }
    }));
  };

  // Hàm xử lý chọn khách hàng từ popup
  const handleSelectCustomer = (customer: any) => {
    if (selectedRowIndex !== null) {
      const updatedDetails = [...details];
      updatedDetails[selectedRowIndex] = {
        ...updatedDetails[selectedRowIndex],
        customerName: customer.customerName,
        customerCode: customer.customerCode,
        country: customer.country,
        bankName: customer.bankName,
        managementCode: customer.managementCode,
        fullName: customer.customerName // Điền luôn Họ và tên cho bảng
      };
      setDetails(updatedDetails);
    }
    // Điền luôn Họ và tên trên form nhập chi tiết
    setForm(prev => ({ ...prev, fullName: customer.customerName }));
    setShowCustomerPopup(false);
    setSelectedRowIndex(null);
  };

  // Hàm mở popup khách hàng
  const handleOpenCustomerPopup = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setShowCustomerPopup(true);
  };

  // Hàm mở popup thanh toán chứng từ
  const handleOpenPaymentPopup = () => {
    setShowPaymentPopup(true);
  };

  // Hàm chọn khách hàng trong popup thanh toán
  const handleSelectPaymentCustomer = (customer: any) => {
    setSelectedPaymentCustomer(customer);
    // Lọc chứng từ công nợ của khách hàng
    const customerDebtList = debtList.filter(debt => debt.customerId === customer.id);
    setCustomerDebts(customerDebtList);
  };

  // Hàm chọn/bỏ chọn chứng từ để thanh toán
  const handleSelectDebt = (debtId: number) => {
    setSelectedDebtIds(prev => {
      if (prev.includes(debtId)) {
        return prev.filter(id => id !== debtId);
      } else {
        return [...prev, debtId];
      }
    });
  };

  // Hàm thanh toán chứng từ đã chọn
  const handlePayment = () => {
    const selectedDebts = customerDebts.filter(debt => selectedDebtIds.includes(debt.id));
    // TODO: Xử lý logic thanh toán và cập nhật vào bảng chính
    console.log('Thanh toán các chứng từ:', selectedDebts);
    setShowPaymentPopup(false);
    setSelectedPaymentCustomer(null);
    setCustomerDebts([]);
    setSelectedDebtIds([]);
  };

  // Hàm tính toán tỷ giá
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'USD' && toCurrency !== 'VND') {
      return amount * (exchangeRates[toCurrency as keyof typeof exchangeRates] || 1);
    }
    return amount;
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

  // ...existing code...

  return (
    <div className="w-full mx-auto text-[13px]">
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
      {/* Gộp form nhập chi tiết và bảng danh sách chi tiết vào cùng 1 khối */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        {/* Form nhập chi tiết chứng từ */}
        <h2 className="text-lg font-semibold mb-4">Chi tiết chứng từ</h2>
        <div className="grid grid-cols-1 2xl:grid-cols-3 md:grid-cols-2 gap-x-8 gap-y-3">
          {detailFields.filter(field => field.id !== "displayColumns" && !field.multilingual).map((field) => (
            <div key={field.id} className="flex flex-col md:flex-row md:items-center">
              <label
                className="mb-1 md:mb-0 w-full md:w-40 md:min-w-[120px] md:text-left md:pr-3 font-medium text-gray-700 text-[13px] relative group cursor-pointer"
              >
                {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                {/* Tooltip */}
                <span className="absolute left-1/2 top-full z-50 mt-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all -translate-x-1/2">
                  {field.label}
                </span>
              </label>
              <input
                type={field.id === "date" || field.id === "paymentDeadline" ? "date" : "text"}
                value={form[field.id] || ""}
                onChange={e => handleChange(field.id, e.target.value)}
                className="w-full md:flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder={field.label}
              />
            </div>
          ))}
        </div>
        
        {/* Trường đa ngôn ngữ - hiển thị dưới cùng */}
        {detailFields.filter(field => field.multilingual).map((field) => (
          <div key={field.id} className="mt-6">
            {/* Heading cho Mô tả 1 */}
            <div className="font-bold text-[13px] text-gray-800 mb-2">{field.label}</div>
            <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-3">
              {/* Tiếng Việt */}
              <div className="flex flex-col md:flex-row md:items-center flex-1">
                <label className="mb-1 md:mb-0 w-full md:w-40 md:min-w-[120px] md:text-left md:pr-3 font-medium text-gray-700 text-[13px]">
                  Tiếng Việt{field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={multilingualFields[field.id]?.vi || ""}
                  onChange={e => handleMultilingualChange(field.id, 'vi', e.target.value)}
                  className="w-full md:flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="Nhập mô tả bằng tiếng Việt"
                />
              </div>
              {/* English */}
              <div className="flex flex-col md:flex-row md:items-center flex-1">
                <label className="mb-1 md:mb-0 w-full md:w-40 md:min-w-[120px] md:text-left md:pr-3 font-medium text-gray-700 text-[13px]">
                  English
                </label>
                <input
                  type="text"
                  value={multilingualFields[field.id]?.en || ""}
                  onChange={e => handleMultilingualChange(field.id, 'en', e.target.value)}
                  className="w-full md:flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="Enter description in English"
                />
              </div>
              {/* 한국어 */}
              <div className="flex flex-col md:flex-row md:items-center flex-1">
                <label className="mb-1 md:mb-0 w-full md:w-40 md:min-w-[120px] md:text-left md:pr-3 font-medium text-gray-700 text-[13px]">
                  한국어
                </label>
                <input
                  type="text"
                  value={multilingualFields[field.id]?.ko || ""}
                  onChange={e => handleMultilingualChange(field.id, 'ko', e.target.value)}
                  className="w-full md:flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="한국어로 설명을 입력하세요"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors text-[13px]"
            // TODO: Thêm logic thu tiền khách hàng
          >
            <Banknote className="w-5 h-5" />
            <span className="hidden sm:inline">Thu tiền khách hàng</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors text-[13px]"
            onClick={handleOpenPaymentPopup}
          >
            <Receipt className="w-5 h-5" />
            <span className="hidden sm:inline">Thanh toán chứng từ</span>
          </button>
          <button
            onClick={handleAddDetail}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ccc] rounded-lg bg-white text-[#666] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors text-[13px]"
            title={editingIndex !== null ? "Cập nhật dòng" : "Thêm dòng"}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{editingIndex !== null ? "Cập nhật" : "Thêm"}</span>
          </button>
        </div>

        {/* Bảng danh sách chi tiết */}
        <div className="mt-8">
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
            <table className="min-w-full border border-gray-200">
              <thead className="bg-[#f5f5f5] border-t border-b border-gray-300 text-[13px]">
                <tr>
                  {columns.filter(c => c.visible).map(col => (
                    <th
                      key={col.id}
                      className="px-3 py-2 font-semibold text-[#212121] border-b border-l border-gray-300 text-left text-[13px]"
                      style={{ width: `${col.width}px`, minWidth: `${col.width}px`, ...getHeaderColumnStyle(col) }}
                    >
                      {col.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {details.length === 0 && (
                  <tr>
                    {columns.filter(c => c.visible).map(col => (
                    <td
                      key={col.id}
                      className="px-3 py-2 border border-gray-300 bg-white text-[13px]"
                      style={{ width: `${col.width}px`, minWidth: `${col.width}px`, ...getCellColumnStyle(col) }}
                    >
                      {col.id === 'customerName' ? (
                        <input
                          type="text"
                          placeholder={`Nhập ${col.displayName}`}
                          onClick={() => handleOpenCustomerPopup(0)}
                          readOnly
                          className="w-full border-none focus:outline-none text-[13px] cursor-pointer "
                        />
                      ) : col.id === 'ngayGiaoDich' || col.id === 'ngayHoaDon' || col.id === 'hanThanhToan' ? (
                        <input
                          type="date"
                          placeholder={`Nhập ${col.displayName}`}
                          onChange={e => {
                            const newRow = columns.reduce<Record<string, string>>((acc, c) => {
                              acc[c.id] = c.id === col.id ? e.target.value : "";
                              return acc;
                            }, {});
                            setDetails([newRow]);
                          }}
                          className="w-full border-none focus:outline-none text-[13px]"
                        />
                      ) : col.id === 'soTien' || col.id === 'soTienConLai' || col.id === 'soTienTra' ? (
                        <input
                          type="number"
                          placeholder={`Nhập ${col.displayName}`}
                          onChange={e => {
                            const newRow = columns.reduce<Record<string, string>>((acc, c) => {
                              acc[c.id] = c.id === col.id ? e.target.value : "";
                              return acc;
                            }, {});
                            setDetails([newRow]);
                          }}
                          className="w-full border-none focus:outline-none text-[13px]"
                          min="0"
                        />
                      ) : (
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
                          className="w-full border-none focus:outline-none text-[13px]"
                        />
                      )}
                    </td>
                    ))}
                  </tr>
                )}
                {details.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    {columns.filter(c => c.visible).map(col => (
                      <td
                        key={col.id}
                        className="px-3 py-2 border border-gray-300 bg-white text-[13px]"
                        style={{ width: `${col.width}px`, minWidth: `${col.width}px`, ...getCellColumnStyle(col) }}
                      >
                        {col.id === 'customerName' ? (
                          <input
                            type="text"
                            value={row[col.id] || ""}
                            placeholder={`Nhập ${col.displayName}`}
                            onClick={() => handleOpenCustomerPopup(idx)}
                            readOnly
                            className="w-full border-none focus:outline-none text-[13px] cursor-pointer "
                          />
                        ) : col.id === 'ngayGiaoDich' || col.id === 'ngayHoaDon' || col.id === 'hanThanhToan' ? (
                          <input
                            type="date"
                            value={row[col.id] || ""}
                            onChange={e => {
                              const updatedDetails = [...details];
                              updatedDetails[idx][col.id] = e.target.value;
                              setDetails(updatedDetails);
                            }}
                            className="w-full border-none focus:outline-none text-[13px]"
                          />
                        ) : col.id === 'soTien' || col.id === 'soTienConLai' || col.id === 'soTienTra' ? (
                          <input
                            type="number"
                            value={row[col.id] || ""}
                            onChange={e => {
                              const updatedDetails = [...details];
                              updatedDetails[idx][col.id] = e.target.value;
                              setDetails(updatedDetails);
                            }}
                            className="w-full border-none focus:outline-none text-[13px]"
                            min="0"
                          />
                        ) : (
                          <input
                            type="text"
                            value={row[col.id] || ""}
                            onChange={e => {
                              const updatedDetails = [...details];
                              updatedDetails[idx][col.id] = e.target.value;
                              setDetails(updatedDetails);
                            }}
                            className="w-full border-none focus:outline-none text-[13px]"
                          />
                        )}
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
              className="flex items-center justify-center gap-2 px-4 py-2 border border-[#ccc] rounded-lg bg-white text-[#666] text-[13px] hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
              title="Lưu phiếu thu"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Lưu phiếu thu</span>
            </button>
          </div>
        </div>
        
        {/* Popup chọn khách hàng */}
        {showCustomerPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Chọn khách hàng</h3>
                  <button
                    onClick={() => setShowCustomerPopup(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-[#f5f5f5]">
                      <tr>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Tên khách hàng</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Mã khách hàng</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Quốc gia</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Tên ngân hàng</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Mã số quản lý</th>
                        <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerList.map((customer) => (
                        <tr key={customer.id} className="hover:bg-blue-50">
                          <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.customerName}</td>
                          <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.customerCode}</td>
                          <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.country}</td>
                          <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.bankName}</td>
                          <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.managementCode}</td>
                          <td className="px-3 py-2 text-[13px] border-b border-gray-300">
                            <button
                              onClick={() => handleSelectCustomer(customer)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-[13px]"
                            >
                              Chọn
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Popup thanh toán chứng từ */}
        {showPaymentPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Thanh toán chứng từ</h3>
                  <button
                    onClick={() => setShowPaymentPopup(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {/* Phần trên - Bộ lọc */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Chọn loại tiền */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Loại tiền</label>
                      <select
                        value={selectedCurrency}
                        onChange={e => setSelectedCurrency(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500"
                      >
                        <option value="VND">VND</option>
                        <option value="USD">USD</option>
                        <option value="BOTH">Cả hai</option>
                      </select>
                    </div>
                    
                    {/* Chọn loại tiền khác */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Tiền tệ khác</label>
                      <select
                        value={selectedOtherCurrency}
                        onChange={e => setSelectedOtherCurrency(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Chọn tiền tệ</option>
                        <option value="KRW">Won Hàn Quốc (KRW)</option>
                        <option value="SGD">Dollar Singapore (SGD)</option>
                        <option value="CNY">Nhân dân tệ (CNY)</option>
                        <option value="THB">Baht Thái Lan (THB)</option>
                      </select>
                    </div>
                    
                    {/* Ngày bắt đầu */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Từ ngày</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Ngày kết thúc */}
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Đến ngày</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Phần dưới - Chọn khách hàng */}
                <div className="mb-6">
                  <h4 className="text-[14px] font-semibold mb-3">Chọn khách hàng</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-[#f5f5f5]">
                        <tr>
                          <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Chọn</th>
                          <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Tên khách hàng</th>
                          <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Mã khách hàng</th>
                          <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Quốc gia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerList.map((customer) => (
                          <tr
                            key={customer.id}
                            className={`hover:bg-blue-50 cursor-pointer ${
                              selectedPaymentCustomer?.id === customer.id ? 'bg-blue-100' : ''
                            }`}
                            onClick={() => handleSelectPaymentCustomer(customer)}
                          >
                            <td className="px-3 py-2 text-[13px] border-b border-gray-300">
                              <input
                                type="radio"
                                checked={selectedPaymentCustomer?.id === customer.id}
                                onChange={() => handleSelectPaymentCustomer(customer)}
                                className="w-4 h-4"
                              />
                            </td>
                            <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.customerName}</td>
                            <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.customerCode}</td>
                            <td className="px-3 py-2 text-[13px] border-b border-gray-300">{customer.country}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Danh sách chứng từ công nợ */}
                {selectedPaymentCustomer && customerDebts.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[14px] font-semibold mb-3">
                      Chứng từ công nợ của {selectedPaymentCustomer.customerName}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200">
                        <thead className="bg-[#f5f5f5]">
                          <tr>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Chọn</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Số chứng từ</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Ngày giao dịch</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Số hóa đơn</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Ngày hóa đơn</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Mô tả</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Hạn thanh toán</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Số tiền</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Số tiền còn lại</th>
                            <th className="px-3 py-2 text-left text-[13px] font-semibold text-[#212121] border-b border-gray-300">Số tiền trả</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerDebts.filter(debt => !hideDebt || debt.soTienConLai > 0).map((debt) => (
                            <tr key={debt.id} className="hover:bg-blue-50">
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">
                                <input
                                  type="checkbox"
                                  checked={selectedDebtIds.includes(debt.id)}
                                  onChange={() => handleSelectDebt(debt.id)}
                                  className="w-4 h-4"
                                />
                              </td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.soChungTu}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.ngayGiaoDich}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.soHoaDon}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.ngayHoaDon}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.moTa}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.hanThanhToan}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.soTien.toLocaleString()}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">{debt.soTienConLai.toLocaleString()}</td>
                              <td className="px-3 py-2 text-[13px] border-b border-gray-300">
                                <input
                                  type="number"
                                  value={debt.soTienTra}
                                  onChange={(e) => {
                                    const updatedDebts = customerDebts.map(d =>
                                      d.id === debt.id ? { ...d, soTienTra: Number(e.target.value) } : d
                                    );
                                    setCustomerDebts(updatedDebts);
                                  }}
                                  className="w-full border rounded px-2 py-1 text-[13px]"
                                  min="0"
                                  max={debt.soTienConLai}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Nút hành động */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHideDebt(!hideDebt)}
                      className={`px-4 py-2 rounded text-[13px] border transition-colors ${
                        hideDebt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {hideDebt ? 'Hiện tất cả' : 'Ẩn công nợ'}
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPaymentPopup(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-[13px]"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={selectedDebtIds.length === 0}
                      className={`px-4 py-2 rounded text-[13px] ${
                        selectedDebtIds.length > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
