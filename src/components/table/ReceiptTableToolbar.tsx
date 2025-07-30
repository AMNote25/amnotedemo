"use client"
import * as Icons from "lucide-react"

interface ReceiptTableToolbarProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  isRefreshing: boolean
  onRefresh: () => Promise<void>
  onExport?: () => void
  onPrint?: () => void
  onSettings: () => void
}

export function ReceiptTableToolbar({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isRefreshing,
  onRefresh,
  onExport,
  onPrint,
  onSettings,
}: ReceiptTableToolbarProps) {
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  const handleImportXml = () => {
    alert("Xin chào");
  };

  return (
    <div className="block sm:flex items-center justify-between p-6">
      <div className="flex items-center space-x-4">
        {/* Bộ lọc ngày */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Tại ngày</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <span className="text-gray-500">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        {/* Nút tìm kiếm */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ml-2 px-4 py-1 rounded bg-gray-100 border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
        >
          Tìm kiếm
        </button>
        {/* Toolbar actions */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 space-x-1 ml-4">
          {/* Làm mới */}
          <div className="relative group">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Làm mới dữ liệu"
            >
              <Icons.RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Làm mới dữ liệu
            </div>
          </div>
          {/* In ấn */}
          {typeof onPrint === 'function' && (
            <div className="relative group">
              <button
                onClick={onPrint}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-md transition-all"
                title="In ấn"
              >
                <Icons.Printer size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                In ấn
              </div>
            </div>
          )}
          {/* Xuất Excel */}
          {typeof onExport === 'function' && (
            <div className="relative group">
              <button
                onClick={onExport}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-white rounded-md transition-all"
                title="Xuất Excel"
              >
                <Icons.FileSpreadsheet size={16} />
              </button>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Xuất Excel
              </div>
            </div>
          )}
          {/* Thiết lập */}
          <div className="relative group">
            <button
              onClick={onSettings}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-white rounded-md transition-all settings-trigger"
              title="Thiết lập"
            >
              <Icons.Settings size={16} />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Thiết lập
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
