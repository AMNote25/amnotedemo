"use client";

import { useState, useCallback } from "react";
import { TablePage } from "@/components/table/TablePage";
import * as Icons from "lucide-react";
import { ReceiptTableToolbar } from "@/components/table/ReceiptTableToolbar";
import { receiptColumns } from "./receiptConfig";
import { receiptDeleteConfig, receiptBulkDeleteConfig } from "./receiptFormConfig";
import ReceiptFormModal from "./ReceiptFormModal";
import { receiptPrintConfig } from "./receiptPrintConfig";
import { receiptFormConfig } from "./receiptFormConfig";
import { exportToExcel } from "@/lib/excelUtils";
import { receiptImportConfig } from "./receiptImportConfig";
import InvoiceImportModal from "./InvoiceImportModal";

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

// Generate mock data
const generateMockData = (count: number): Receipt[] => {
  const data: Receipt[] = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i.toString(),
      receiptNo: `PT${String(i).padStart(4, "0")}`,
      transactionDate: "2025-07-29",
      amount: Math.floor(Math.random() * 10000000) + 100000,
      description1: `Thu tiền bán hàng khách hàng ${i}`,
      description2: `Thanh toán hóa đơn số ${i}`,
      receiverName: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
      modifiedDate: "2025-07-29",
      isLocked: i % 3 === 0 ? "true" : "false",
      email: `customer${i}@company.com`,
      attachment: i % 4 === 0 ? `receipt_${i}.pdf` : "",
      createdBy: `Admin${(i % 3) + 1}`,
      currentEditor: `User${(i % 5) + 1}`,
      costCenter1: `CC${String(i % 10).padStart(3, "0")}`,
      costCenter2: `CC${String((i + 1) % 10).padStart(3, "0")}`,
      debit: "111",
      debitAccountName: "Tiền mặt",
      credit: "131",
      creditAccountName: "Phải thu khách hàng",
      amountSecond: Math.floor(Math.random() * 5000000) + 50000,
      fcAmount: Math.floor(Math.random() * 1000) + 100,
      country: "Việt Nam",
      customerCode: `KH${String(i).padStart(4, "0")}`,
      customerName: `Công ty TNHH ${i}`,
      bankName: ["Vietcombank", "BIDV", "Techcombank", "MB Bank"][i % 4],
      manageCode: `MGT${String(i).padStart(4, "0")}`,
      manageCode2: `MGT2${String(i).padStart(4, "0")}`,
      note1: `Ghi chú quản lý 1 cho phiếu thu ${i}`,
      note2: `Ghi chú quản lý 2 cho phiếu thu ${i}`,
      inventory: i % 5 === 0 ? `Kho ${i % 3 + 1}` : "",
    });
  }
  return data;
};

export default function ReceiptManagementPage() {
  const [data, setData] = useState<Receipt[]>(() => generateMockData(50));
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("2025-07-29");
  const [endDate, setEndDate] = useState<string>("2025-07-29");
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const handleImport = useCallback((_rows: any[], _method: "add" | "update" | "overwrite") => {
    // Xử lý import Excel nếu cần
    console.log("Import receipts:", _rows, _method);
  }, []);

  const handlePrint = useCallback(() => {
    // Print logic - handled by TablePage with printConfig
  }, []);

  const handleAddReceipt = async (formData: Receipt) => {
    try {
      const newReceipt = { 
        ...formData, 
        id: Date.now().toString(),
        transactionDate: formData.transactionDate || new Date().toISOString().split('T')[0],
        modifiedDate: new Date().toISOString().split('T')[0],
      };
      setData((prev) => [...prev, newReceipt]);
      return { success: true, message: "Thêm phiếu thu thành công!" };
    } catch (error) {
      return { success: false, message: "Có lỗi xảy ra khi thêm phiếu thu!" };
    }
  };

  const handleEditReceipt = async (formData: Receipt) => {
    try {
      const updatedReceipt = {
        ...formData,
        modifiedDate: new Date().toISOString().split('T')[0],
      };
      setData((prev) => prev.map((receipt) => (receipt.id === formData.id ? updatedReceipt : receipt)));
      return { success: true, message: "Cập nhật phiếu thu thành công!" };
    } catch (error) {
      return { success: false, message: "Có lỗi xảy ra khi cập nhật phiếu thu!" };
    }
  };

  const handleDeleteReceipt = useCallback(async (id: string) => {
    try {
      setData((prev) => prev.filter((receipt) => receipt.id !== id));
      return { success: true, message: "Xóa phiếu thu thành công!" };
    } catch (error) {
      return { success: false, message: "Có lỗi xảy ra khi xóa phiếu thu!" };
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(generateMockData(50));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExport = useCallback(() => {
    exportToExcel(data, receiptColumns, "danh-sach-phieu-thu.xlsx", "Phiếu thu");
    alert("Đã xuất dữ liệu ra file Excel thành công!");
  }, [data]);

  const handleImportXml = () => {
    setInvoiceModalOpen(true);
  };

  const handleInvoiceModalSubmit = async (data: any) => {
    console.log("Dữ liệu nhập XML e-invoice:", data);
    setInvoiceModalOpen(false);
  };

  return (
    <>
      <TablePage
        title="Quản lý phiếu thu"
        description="Quản lý danh sách phiếu thu của doanh nghiệp"
        columns={receiptColumns}
        data={data}
        onImport={handleImport}
        onPrint={handlePrint}
        onRefresh={handleRefresh}
        onExport={handleExport}
        formConfig={receiptFormConfig}
        printConfig={receiptPrintConfig}
        excelImportConfig={receiptImportConfig}
        deleteConfig={receiptDeleteConfig}
        bulkDeleteConfig={receiptBulkDeleteConfig}
        onAdd={handleAddReceipt}
        onEdit={handleEditReceipt}
        onDelete={handleDeleteReceipt}
        FormModalComponent={ReceiptFormModal}
        isInitialLoading={isLoading}
        companyInfo={{
          name: "Công ty TNHH ABC Technology",
          address: "123 Đường ABC, Quận Ba Đình, Hà Nội",
          taxCode: "0123456789",
        }}
        customToolbar={props => (
          <ReceiptTableToolbar
            {...props}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            isRefreshing={isLoading}
            onRefresh={handleRefresh}
            onExport={handleExport}
            onSettings={() => {}}
          />
        )}
        customHeaderActions={
          <div className="relative group">
            <button
              onClick={handleImportXml}
              className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Nhập XML e-invoice"
            >
              <Icons.FileCode2 size={16} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 whitespace-nowrap px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg">
              Nhập XML e-invoice
            </div>
          </div>
        }
      />
      <InvoiceImportModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        onSubmit={handleInvoiceModalSubmit}
      />
    </>
  );
}
