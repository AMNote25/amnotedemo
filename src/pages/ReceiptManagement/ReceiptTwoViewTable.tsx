"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { receiptColumns } from "./receiptConfig";
import type { ColumnConfig } from "@/types/table";
import { ReceiptTableToolbar } from "@/components/table/ReceiptTableToolbar";
import { Printer, Upload, Plus } from "lucide-react";

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
}

export default function ReceiptTwoViewTable({ data, onAddNew }: ReceiptTwoViewTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scroll cho bảng 1: tính toán chiều cao động
  const table1WrapperRef = useRef<HTMLDivElement>(null);
  const [table1MaxHeight, setTable1MaxHeight] = useState<number>(400);

  useEffect(() => {
    function updateHeight() {
      // Chiều cao các thành phần khác
      const headerHeight = 72;    // Tiêu đề + các nút action 
      const toolbarHeight = 56;   // ReceiptTableToolbar
      const detailTableHeight = 300; // Bảng 2 (ước lượng)
      const padding = 120;         // Padding container
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

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Tiêu đề và các nút action */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách phiếu thu</h1>
        <p className="text-sm text-gray-500 mt-1">Click vào một dòng để xem thông tin chi tiết</p>
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
              setTimeout(() => setIsRefreshing(false), 800);
            }}
            onExport={() => alert("Xuất excel!")}
            onPrint={() => alert("In ấn!")}
            onSettings={() => alert("Thiết lập cột!")}
          />
        </div>

        {/* Bảng 1 (List View) */}
        <div className="flex-1 overflow-y-auto">
          <div className="overflow-x-auto relative">
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 z-1000 bg-[#f5f5f5] border-t border-b border-[#e0e0e0] text-[#212121]">
                <tr>
                  {listViewColumns.map((column) => (
                    <th
                      key={column.dataField}
                      className="px-4 py-3 text-left text-sm font-bold select-none group"
                      style={{ width: column.width, minWidth: column.width }}
                    >
                      {column.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((receipt) => (
                  <tr
                    key={receipt.id}
                    onClick={() => handleRowClick(receipt)}
                    className={`group hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedReceipt?.id === receipt.id ? 'bg-blue-100' : ''
                    }`}
                    title="Click để xem chi tiết"
                  >
                    {listViewColumns.map((column) => (
                      <td
                        key={column.dataField}
                        className="px-4 py-3 group-hover:bg-gray-50"
                        style={{ width: column.width, minWidth: column.width }}
                      >
                        {formatValue(getFieldValue(receipt, column.dataField), column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bảng 2 (Detail View) */}
        <div className="flex-shrink-0 overflow-x-auto relative">
          {selectedReceipt ? (
            <table className="min-w-full table-auto">
              <thead className="bg-[#f5f5f5] border-t border-b border-[#e0e0e0] text-[#212121]">
                <tr>
                  {detailViewColumns.map((column) => (
                    <th
                      key={column.dataField}
                      className="px-4 py-3 text-left text-sm font-bold select-none group bg-[#f5f5f5] border-t border-b border-[#e0e0e0] text-[#212121]"
                    >
                      {column.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="group hover:bg-gray-50">
                  {detailViewColumns.map((column) => (
                    <td
                      key={column.dataField}
                      className="px-4 py-3 group-hover:bg-gray-50"
                    >
                      {formatValue(getFieldValue(selectedReceipt, column.dataField), column)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <div className="text-lg font-medium mb-2">Chưa chọn phiếu thu</div>
              <div>Vui lòng click vào một dòng trong bảng trên để xem chi tiết</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
