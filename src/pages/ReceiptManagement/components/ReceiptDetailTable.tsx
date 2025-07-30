"use client"

import { useMemo } from "react"
import type { ColumnConfig, BaseTableItem } from "@/types/table"

interface ReceiptDetailTableProps<T extends BaseTableItem> {
  data: T | null
  columns: ColumnConfig[]
  title?: string
}

export function ReceiptDetailTable<T extends BaseTableItem>({
  data,
  columns,
  title = "Thông tin chi tiết"
}: ReceiptDetailTableProps<T>) {
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
    
    if (column.dataField === "transactionDate" || column.dataField === "modifiedDate") {
      if (value) {
        return new Date(value).toLocaleDateString("vi-VN");
      }
    }
    
    return String(value);
  };

  const groupedColumns = useMemo(() => {
    // Nhóm các cột theo loại để hiển thị có tổ chức
    const groups = [
      {
        title: "Thông tin kế toán",
        fields: ["debit", "debitAccountName", "credit", "creditAccountName", "costCenter1", "costCenter2"]
      },
      {
        title: "Thông tin bổ sung",
        fields: ["amountSecond", "fcAmount", "country", "customerCode", "customerName", "bankName"]
      },
      {
        title: "Quản lý",
        fields: ["manageCode", "manageCode2", "note1", "note2", "inventory"]
      }
    ];

    return groups.map(group => ({
      ...group,
      columns: columns.filter(col => group.fields.includes(col.dataField))
    })).filter(group => group.columns.length > 0);
  }, [columns]);

  if (!data) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">Chọn một phiếu thu để xem thông tin chi tiết</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Phiếu thu: {(data as any).receiptNo || "N/A"}
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          {groupedColumns.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">
                {group.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.columns.map((column) => {
                  const value = (data as any)[column.dataField];
                  return (
                    <div key={column.id} className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {column.displayName}
                      </label>
                      <div className="text-sm text-gray-900 bg-gray-50 rounded px-3 py-2 min-h-[36px] flex items-center">
                        {formatValue(value, column)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}