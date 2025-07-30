"use client"

import { useState, useCallback, useMemo } from "react"
import * as Icons from "lucide-react"
import type { ColumnConfig, BaseTableItem } from "@/types/table"

interface ReceiptTableProps<T extends BaseTableItem> {
  data: Array<{ item: T; depth: number }>
  columns: ColumnConfig[]
  selectedItems: string[]
  onSelectAll: (checked: boolean) => void
  onSelectOne: (id: string, checked: boolean) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onRowClick?: (item: T) => void // Thêm prop để handle click row
  isLoading?: boolean
  isSearching?: boolean
  itemsPerPage: number
  selectedRowId?: string // ID của row được chọn để highlight
  renderCustomCell?: (item: T, column: ColumnConfig, depth: number) => React.ReactNode
  onSort?: (field: string) => void
  sortConfig?: { field: string; order: "asc" | "desc" }
}

export function ReceiptTable<T extends BaseTableItem>({
  data,
  columns,
  selectedItems,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
  onRowClick,
  isLoading = false,
  isSearching = false,
  itemsPerPage,
  selectedRowId,
  renderCustomCell,
  onSort,
  sortConfig,
}: ReceiptTableProps<T>) {
  const getColumnStyle = useCallback(
    (column: ColumnConfig) => {
      if (!column.pinned) return {}
      return {
        position: "sticky" as const,
        left: 0,
        zIndex: 10,
        backgroundColor: "white",
      }
    },
    [],
  )

  const getHeaderColumnStyle = useCallback(
    (column: ColumnConfig) => {
      if (!column.pinned) return {}
      return {
        position: "sticky" as const,
        left: 0,
        zIndex: 11,
        backgroundColor: "#fef2f2",
      }
    },
    [],
  )

  const renderCell = useCallback(
    (item: T, column: ColumnConfig, depth: number) => {
      if (renderCustomCell) {
        const customCell = renderCustomCell(item, column, depth)
        if (customCell) return customCell
      }

      const value = item[column.dataField]

      // Format giá trị theo loại dữ liệu
      if (column.dataField.includes("amount") || column.dataField.includes("Amount")) {
        if (typeof value === "number") {
          return (
            <span className="font-medium text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(value)}
            </span>
          )
        }
      }

      if (column.dataField === "isLocked") {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "true" 
              ? "bg-red-100 text-red-800" 
              : "bg-green-100 text-green-800"
          }`}>
            {value === "true" ? "Đã khóa" : "Chưa khóa"}
          </span>
        )
      }

      if (column.dataField === "transactionDate" || column.dataField === "modifiedDate") {
        if (value) {
          return <span className="text-gray-900">{new Date(value).toLocaleDateString("vi-VN")}</span>
        }
      }

      return <span className="text-gray-900">{String(value || "")}</span>
    },
    [renderCustomCell],
  )

  return (
    <div className="overflow-x-auto relative">
      <table className="min-w-full table-auto">
        <thead className="bg-[#f5f5f5] border-t border-b border-[#e0e0e0] text-[#212121]">
          <tr>
            <th
              className="sticky left-0 z-20 bg-[#f5f5f5] border-t border-b border-[#e0e0e0] px-4 py-3 text-left text-[#212121] font-bold"
              style={{ width: "30px", minWidth: "30px", maxWidth: "30px" }}
            >
              <input
                type="checkbox"
                checked={selectedItems.length === data.length && data.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
            </th>
            {columns.map((col) => {
              const isSorted = sortConfig && sortConfig.field === col.dataField;
              const sortOrder = isSorted ? sortConfig?.order : undefined;
              return (
                <th
                  key={col.id}
                  className="px-4 py-3 text-left text-sm font-bold select-none group bg-[#f5f5f5] border-t border-b border-[#e0e0e0] text-[#212121]"
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    ...getHeaderColumnStyle(col),
                    cursor: onSort ? "pointer" : undefined,
                  }}
                  onClick={onSort ? () => onSort(col.dataField) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.displayName}
                    {onSort && (
                      <span className="ml-1 flex items-center">
                        {isSorted ? (
                          sortOrder === "asc" ? (
                            <Icons.ChevronUp size={16} className="text-red-500" />
                          ) : (
                            <Icons.ChevronDown size={16} className="text-red-500" />
                          )
                        ) : (
                          <Icons.ChevronUp size={16} className="text-gray-300 opacity-0 group-hover:opacity-60 transition-opacity" />
                        )}
                      </span>
                    )}
                    {col.pinned && <Icons.Pin size={12} className="ml-1 text-red-500" />}
                  </div>
                </th>
              );
            })}
            <th
              className="sticky right-0 z-10 bg-[#f5f5f5] border-t border-b border-[#e0e0e0] px-4 py-3 text-center text-sm font-bold text-[#212121]"
              style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
            >
              Thao tác
            </th>
          </tr>
        </thead>
      </table>
      <table className="min-w-full table-auto">
        <tbody className="divide-y divide-gray-200">
          {isLoading || isSearching
            ? Array.from({ length: itemsPerPage }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                  <td
                    className="sticky left-0 z-15 bg-white px-4 py-3"
                    style={{ width: "30px", minWidth: "30px", maxWidth: "30px" }}
                  >
                    <div className="h-4 w-4 bg-gray-200 rounded" />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={`skeleton-${rowIndex}-${col.id}`}
                      className="px-4 py-3"
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        ...getColumnStyle(col),
                      }}
                    >
                      <div className="h-4 bg-gray-200 rounded" style={{ width: `${Math.random() * 70 + 30}%` }} />
                    </td>
                  ))}
                  <td
                    className="sticky right-0 z-10 bg-white px-1 py-3 text-center"
                    style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-6 w-6 bg-gray-200 rounded-lg" />
                      <div className="h-6 w-6 bg-gray-200 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            : data.map(({ item, depth }) => (
                <tr 
                  key={item.id} 
                  className={`group hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedRowId === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  <td
                    className="sticky left-0 z-15 bg-white px-4 py-3 group-hover:bg-gray-50"
                    style={{ width: "30px", minWidth: "30px", maxWidth: "30px" }}
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => onSelectOne(item.id, e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className="px-4 py-3 group-hover:bg-gray-50"
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        ...getColumnStyle(col),
                      }}
                    >
                      {renderCell(item, col, depth)}
                    </td>
                  ))}
                  <td
                    className="sticky group-hover:bg-gray-50 right-0 z-10 px-1 py-3 text-center"
                    style={{ width: "100px", minWidth: "100px", maxWidth: "100px" }}
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking action buttons
                  >
                    <div className="flex items-center justify-center space-x-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                      {onEdit && (
                        <div className="relative">
                          <button
                            onClick={() => onEdit(item)}
                            className="peer p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Icons.Edit size={16} />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Sửa
                          </div>
                        </div>
                      )}

                      {onDelete && (
                        <div className="relative">
                          <button
                            onClick={() => onDelete(item)}
                            className="peer p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Icons.Trash2 size={16} />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Xóa
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      {data.length === 0 && !isLoading && !isSearching && (
        <div className="text-center py-8">
          <Icons.Receipt size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Không tìm thấy phiếu thu nào</p>
        </div>
      )}
    </div>
  )
}