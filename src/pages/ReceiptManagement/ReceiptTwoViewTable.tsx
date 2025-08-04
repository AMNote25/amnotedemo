"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { receiptColumns } from "./receiptConfig";
import type { ColumnConfig } from "@/types/table";
import { ReceiptTableToolbar } from "@/components/table/ReceiptTableToolbar";
import { Printer, Upload, Plus, Edit, Trash2 } from "lucide-react";

interface Receipt {
  id: string;
  receiptNo: string;
  transactionDate: string;
  amount: number;
  description1?: string;
  description2?: string;
  receiverName: string;
  modifiedDate?: string;
  isLocked?: string;
  email?: string;
  attachment?: string;
  createdBy?: string;
  currentEditor?: string;
  costCenter1?: string;
  costCenter2?: string;
  debit?: string;
  debitAccountName?: string;
  credit?: string;
  creditAccountName?: string;
  amountSecond?: number;
  fcAmount?: number;
  country?: string;
  customerCode?: string;
  customerName?: string;
  bankName?: string;
  manageCode?: string;
  manageCode2?: string;
  note1?: string;
  note2?: string;
  inventory?: string;
}

interface ReceiptTwoViewTableProps {
  data: Receipt[];
  onAddNew?: () => void;
  onRefreshData?: () => Promise<void> | void;
}

export default function ReceiptTwoViewTable({ data, onAddNew, onRefreshData }: ReceiptTwoViewTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  // State lưu các id dòng được chọn
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Lọc dữ liệu theo searchTerm và khoảng ngày giao dịch
  const filteredData = useMemo(() => {
    let result = data;
    // Lọc theo ngày giao dịch nếu có
    if (startDate || endDate) {
      result = result.filter(r => {
        if (!r.transactionDate) return false;
        const date = r.transactionDate.slice(0, 10); // yyyy-mm-dd
        if (startDate && endDate) {
          return date >= startDate && date <= endDate;
        } else if (startDate) {
          return date >= startDate;
        } else if (endDate) {
          return date <= endDate;
        }
        return true;
      });
    }
    // Lọc theo searchTerm
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(r =>
        (r.receiptNo && r.receiptNo.toLowerCase().includes(lower)) ||
        (r.customerName && r.customerName.toLowerCase().includes(lower)) ||
        (r.customerCode && r.customerCode.toLowerCase().includes(lower)) ||
        (r.description1 && r.description1.toLowerCase().includes(lower)) ||
        (r.description2 && r.description2.toLowerCase().includes(lower))
      );
    }
    return result;
  }, [data, searchTerm, startDate, endDate]);

  // Scroll cho bảng 1: tính toán chiều cao động
  const table1WrapperRef = useRef<HTMLDivElement>(null);
  const [table1MaxHeight, setTable1MaxHeight] = useState<number>(400);

  useEffect(() => {
    function updateHeight() {
      // Chiều cao các thành phần khác
      const headerHeight = 72;    // Tiêu đề + các nút action 
      const toolbarHeight = 56;   // ReceiptTableToolbar
      const detailTableHeight = 300; // Bảng 2 (ước lượng)
      const padding = 10;         // Padding container
      const windowH = window.innerHeight;
      
      // Tính maxHeight cho bảng 1
      const maxH = windowH - (headerHeight + toolbarHeight + detailTableHeight + padding);
      setTable1MaxHeight(maxH > 200 ? maxH : 200);
    }
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Tự động filter các cột theo thuộc tính visible
  const listViewColumns = useMemo(() => {
    return receiptColumns.filter(col => col.visible === true);
  }, []);

  const detailViewColumns = useMemo(() => {
    return receiptColumns.filter(col => col.visible === false);
  }, []);

  // Format giá trị hiển thị
  const formatValue = (value: any, column: ColumnConfig): string => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    if (column.dataField.includes("amount") || column.dataField.includes("Amount")) {
      if (typeof value === "number") {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);
      }
    }
    if (column.dataField === "isLocked") {
      return value === "true" ? "Đã khóa" : "Chưa khóa";
    }
    return String(value);
  };

  const getFieldValue = (item: Receipt, dataField: string): any => {
    return (item as any)[dataField];
  };

  const handleRowClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
  };

  // Xử lý chọn tất cả
  const isAllChecked = filteredData.length > 0 && selectedRowIds.length === filteredData.length;
  const isIndeterminate = selectedRowIds.length > 0 && selectedRowIds.length < filteredData.length;
  const handleCheckAll = (checked: boolean) => {
    if (checked) setSelectedRowIds(filteredData.map(r => r.id));
    else setSelectedRowIds([]);
  };
  const handleCheckRow = (id: string, checked: boolean) => {
    setSelectedRowIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };

  return (
    <div className="flex flex-col md:h-[calc(100vh-100px)]">
      {/* Tiêu đề và các nút action */}
      <div className="flex-shrink-0 pb-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách phiếu thu</h1>
        </div>
        <div className="m-2 flex space-x-2">
          <button className="p-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600" title="In ấn">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600" title="Xuất Excel">
            <Upload className="w-5 h-5" />
          </button>
          <button 
            onClick={() => window.location.href = '/receipt-management/receipt-detail'}
            className="p-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600" 
            title="Thêm mới"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Container cho Toolbar, Bảng 1 và Bảng 2 */}
      <div className="bg-white rounded-lg shadow flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="flex-shrink-0">
          <ReceiptTableToolbar
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            isRefreshing={isRefreshing}
            onRefresh={async () => {
              setIsRefreshing(true);
              if (onRefreshData) {
                await onRefreshData();
              }
              setIsRefreshing(false);
            }}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onExport={() => alert("Xuất excel!")}
            onPrint={() => alert("In ấn!")}
            onSettings={() => alert("Thiết lập cột!")}
          />
        </div>

        {/* Bảng 1 (List View) */}
        <div className="flex-shrink-0" style={{height: '33vh'}}>
          <div className="relative h-full overflow-y-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="sticky top-0 z-1000 bg-[#f5f5f5] border-b border-[#e0e0e0] text-[#212121]">
                <tr>
                  <th className="sticky left-0 z-20 bg-[#f5f5f5]  px-4 py-3 text-left text-[#212121] font-bold">
                    <input
                      type="checkbox"
                      className="accent-blue-600 w-4 h-4"
                      checked={isAllChecked}
                      ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                      onChange={e => handleCheckAll(e.target.checked)}
                      title="Chọn tất cả"
                    />
                  </th>
                  {listViewColumns.map((column) => (
                    <th
                      key={column.dataField}
                      className="px-4 py-3 text-left text-sm font-bold select-none group whitespace-nowrap"
                      style={{ width: column.width, minWidth: column.width, maxWidth: column.width }}
                    >
                      {column.displayName}
                    </th>
                  ))}
                  <th className="sticky right-0 z-10 bg-[#f5f5f5]  px-4 py-3 text-center text-sm font-bold text-[#212121] whitespace-nowrap" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((receipt) => (
                  <tr
                    key={receipt.id}
                    onClick={() => handleRowClick(receipt)}
                    className={`group hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedReceipt?.id === receipt.id ? 'bg-gray-100' : ''
                    }`}
                    title="Click để xem chi tiết"
                  >
                    <td className=" z-15  px-4 py-3 group-hover:bg-gray-50" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="accent-blue-600 w-4 h-4"
                        checked={selectedRowIds.includes(receipt.id)}
                        onChange={e => handleCheckRow(receipt.id, e.target.checked)}
                        title="Chọn dòng này"
                      />
                    </td>
                    {listViewColumns.map((column) => (
                      <td
                        key={column.dataField}
                        className="px-4 py-3 group-hover:bg-gray-50 truncate whitespace-nowrap"
                        style={{ width: column.width, minWidth: column.width }}
                      >
                        {formatValue(getFieldValue(receipt, column.dataField), column)}
                      </td>
                    ))}
                    <td className="sticky group-hover:bg-gray-50 right-0 z-10 px-1 py-3 text-center" style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}>
                      <div className="flex items-center justify-center space-x-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                        <div className="relative">
                          <button
                            className="peer p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                            onClick={e => { e.stopPropagation(); alert('Sửa phiếu thu!'); }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Sửa
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            className="peer p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                            onClick={e => { e.stopPropagation(); alert('Xóa phiếu thu!'); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Xóa
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bảng 2 (Detail View) */}
        <div className="h-auto md:flex-1 overflow-auto border-t border-gray-200">
          <table className="min-w-full table-auto">
            <thead className="bg-[#f5f5f5] border-t border-b border-l border-gray-300 text-[#212121] whitespace-nowrap text-sm" >
              <tr>
                {detailViewColumns.map((column) => (
                  <th
                    key={column.dataField}
                    className="px-4 py-3 text-left text-sm font-bold select-none group bg-[#f5f5f5] border-t  border-b border-[#e0e0e0] text-[#212121]"
                  >
                    {column.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm whitespace-nowrap border-b border-[#e0e0e0]">
              {selectedReceipt ? (
                // Luôn render 4 dòng giống nhau, đều là dữ liệu của selectedReceipt
                [0,1,2,3].map((rowIdx) => (
                  <tr key={rowIdx} className="group hover:bg-gray-50">
                    {detailViewColumns.map((column) => (
                      <td
                        key={column.dataField}
                        className="px-4 py-3 group-hover:bg-gray-50"
                      >
                        {formatValue(getFieldValue(selectedReceipt, column.dataField), column)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                // Nếu chưa chọn thì render 4 dòng trống
                [0,1,2,3].map((rowIdx) => (
                  <tr key={rowIdx} className="group hover:bg-gray-50">
                    {detailViewColumns.map((column) => (
                      <td
                        key={column.dataField}
                        className="px-4 py-3 group-hover:bg-gray-50 h-[44px]"
                      >
                        {/* Để trống */}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
