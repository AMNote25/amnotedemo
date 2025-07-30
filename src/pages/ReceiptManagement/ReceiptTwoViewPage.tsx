"use client"

import { useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ReceiptTable } from "./components/ReceiptTable"
import { ReceiptTableToolbar } from "./components/ReceiptTableToolbar"
import { ReceiptDetailTable } from "./components/ReceiptDetailTable"
import { receiptColumns } from "./receiptConfig"
import { TableSettings } from "@/components/table/TableSettings"
import Pagination from "@/components/table/Pagination"
import * as Icons from "lucide-react"

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
      transactionDate: "2025-01-29",
      amount: Math.floor(Math.random() * 10000000) + 100000,
      description1: `Thu tiền bán hàng khách hàng ${i}`,
      description2: `Thanh toán hóa đơn số ${i}`,
      receiverName: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
      modifiedDate: "2025-01-29",
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

export default function ReceiptTwoViewPage() {
  const navigate = useNavigate()
  const [data] = useState<Receipt[]>(() => generateMockData(50))
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [startDate, setStartDate] = useState<string>("2025-01-01")
  const [endDate, setEndDate] = useState<string>("2025-01-31")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [columnConfigs, setColumnConfigs] = useState(receiptColumns)

  // Filter data based on date range and search term
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const itemDate = new Date(item.transactionDate)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      
      const dateMatch = (!start || itemDate >= start) && (!end || itemDate <= end)
      const searchMatch = !searchTerm || 
        item.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description1 && item.description1.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return dateMatch && searchMatch
    })
  }, [data, startDate, endDate, searchTerm])

  // Separate visible and hidden columns
  const visibleColumns = useMemo(() => {
    return columnConfigs.filter(col => col.visible)
  }, [columnConfigs])

  const hiddenColumns = useMemo(() => {
    return columnConfigs.filter(col => !col.visible)
  }, [columnConfigs])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedItems(checked ? paginatedData.map(item => item.id) : [])
  }, [paginatedData])

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedItems(prev => 
      checked ? [...prev, id] : prev.filter(itemId => itemId !== id)
    )
  }, [])

  const handleRowClick = useCallback((item: Receipt) => {
    setSelectedReceipt(item)
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }, [])

  const handleAddNew = useCallback(() => {
    navigate('/receipt-management/receipt-detail')
  }, [navigate])

  const handleEdit = useCallback((item: Receipt) => {
    // Navigate to edit page or open edit modal
    console.log('Edit receipt:', item)
  }, [])

  const handleDelete = useCallback((item: Receipt) => {
    // Handle delete
    console.log('Delete receipt:', item)
  }, [])

  const handleColumnConfigChange = useCallback((columnId: string, field: keyof any, value: any) => {
    setColumnConfigs(prev => 
      prev.map(col => col.id === columnId ? { ...col, [field]: value } : col)
    )
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phiếu thu</h1>
          <p className="text-gray-600 mt-1">
            Quản lý danh sách phiếu thu ({filteredData.length} phiếu thu)
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="relative group">
            <button
              onClick={() => console.log('Print')}
              className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              <Icons.Printer size={16} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 whitespace-nowrap px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg">
              In ấn
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={() => console.log('Import Excel')}
              className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              <Icons.Upload size={16} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 whitespace-nowrap px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg">
              Nhập Excel
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={handleAddNew}
              className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              <Icons.Plus size={16} />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-20 whitespace-nowrap px-3 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg">
              Thêm mới
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Receipt List */}
        <div className="bg-white rounded-xl shadow border">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách phiếu thu</h2>
            <p className="text-sm text-gray-500 mt-1">Click vào một dòng để xem chi tiết</p>
          </div>

          <ReceiptTableToolbar
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            onExport={() => console.log('Export')}
            onPrint={() => console.log('Print')}
            onSettings={() => setShowSettingsPanel(true)}
            selectedCount={selectedItems.length}
            onBulkDelete={selectedItems.length > 0 ? () => console.log('Bulk delete') : undefined}
          />

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <ReceiptTable
              data={paginatedData.map(item => ({ item, depth: 0 }))}
              columns={visibleColumns}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRowClick={handleRowClick}
              selectedRowId={selectedReceipt?.id}
              isLoading={isRefreshing}
              itemsPerPage={itemsPerPage}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            startIndex={(currentPage - 1) * itemsPerPage}
            endIndex={Math.min(currentPage * itemsPerPage, filteredData.length)}
          />
        </div>

        {/* Right Panel - Receipt Detail */}
        <div className="bg-white rounded-xl shadow border">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h2>
            <p className="text-sm text-gray-500 mt-1">Thông tin chi tiết của phiếu thu được chọn</p>
          </div>
          
          <div className="p-6">
            <ReceiptDetailTable
              data={selectedReceipt}
              columns={hiddenColumns}
              title="Chi tiết phiếu thu"
            />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettingsPanel && (
        <TableSettings
          columns={columnConfigs}
          onColumnChange={handleColumnConfigChange}
          onClose={() => setShowSettingsPanel(false)}
          onReset={() => setColumnConfigs(receiptColumns)}
          stickyPositions={{}}
        />
      )}
    </div>
  )
}