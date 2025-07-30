"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { receiptColumns } from "./receiptConfig";
import type { ColumnConfig } from "@/types/table";
import { DataTable } from "@/components/table/DataTable";
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
      const padding = 100;         // Padding container
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
    <div className="space-y-6">
      {/* Tiêu đề và các nút action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách phiếu thu</h1>
          <p className="text-sm text-gray-500 mt-1">Click vào một dòng để xem thông tin chi tiết</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {/* In ấn */}
          <div className="relative group">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
              onClick={() => alert('In ấn!')}
              aria-label="In ấn"
            >
              <Printer size={20} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 whitespace-nowrap px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg">
              In ấn
            </div>
          </div>
          {/* Nhập Excel */}
          <div className="relative group">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
              onClick={() => alert('Nhập Excel!')}
              aria-label="Nhập Excel"
            >
              <Upload size={20} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 whitespace-nowrap px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg">
              Nhập Excel
            </div>
          </div>
          {/* Thêm mới */}
          <div className="relative group">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
              onClick={onAddNew}
              aria-label="Thêm mới"
            >
              <Plus size={20} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 whitespace-nowrap px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg">
              Thêm mới
            </div>
          </div>
        </div>
      </div>
      {/* Gộp 2 bảng vào 1 khối, bỏ tiêu đề phụ, để sát nhau */}
      <div className="bg-white rounded-lg shadow">
        <div className="">
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
        <div>
          <div
            ref={table1WrapperRef}
            style={{ maxHeight: table1MaxHeight, overflowY: 'auto' }}
            className="overflow-x-auto"
          >
            <div className="relative">
              <DataTable
                data={data.map(item => ({ item, depth: 0 }))}
                columns={listViewColumns}
                stickyPositions={{}}
                selectedItems={selectedReceipt ? [selectedReceipt.id] : []}
                onSelectAll={() => {}}
                onSelectOne={(_id, _checked) => {}}
                itemsPerPage={10}
                isLoading={false}
                renderCustomCell={(item, column) => {
                  return (
                    <div
                      className="cursor-pointer select-none"
                      onClick={() => handleRowClick(item)}
                      title="Xem chi tiết phiếu thu"
                    >
                      {(item as any)[column.dataField] ?? '-'}
                    </div>
                  );
                }}
                onEdit={undefined}
                onDelete={undefined}
              />
            </div>
          </div>
          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu để hiển thị
            </div>
          )}
          <DataTable
            data={selectedReceipt ? [{ item: selectedReceipt, depth: 0 }] : []}
            columns={detailViewColumns}
            stickyPositions={{}}
            selectedItems={selectedReceipt ? [selectedReceipt.id] : []}
            onSelectAll={() => {}}
            onSelectOne={() => {}}
            itemsPerPage={1}
            isLoading={false}
          />
          {detailViewColumns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có trường chi tiết nào để hiển thị
            </div>
          )}
          {/* Ẩn dòng nhắc chọn phiếu thu */}
        </div>
      </div>
    </div>
  );
}
