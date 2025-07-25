"use client"

import type { FormField } from "@/types/form"
import React, { useState, useCallback, useEffect } from "react"
import { X, Save, Loader2, AlertCircle, Info, Usb, FileText, Shield, Building2, Settings, CreditCard, FileSignature, Receipt, Check, Mail, MessageSquare, Upload, Trash2, CheckSquare, Square, Plus, Edit2 } from "lucide-react"

interface CompanyFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void> | void
  initialData?: any
  mode: "add" | "edit"
}

const FIELDS: FormField[] = [
  { id: "name", name: "name", label: "Tên công ty", type: "text", required: true, placeholder: "Nhập tên công ty" },
  { id: "address", name: "address", label: "Địa chỉ", type: "text", required: true, placeholder: "Nhập địa chỉ" },
  { id: "taxCode", name: "taxCode", label: "Mã số thuế", type: "text", required: true, placeholder: "Nhập mã số thuế", validation: { pattern: "^\\d{10}$", maxLength: 10 }, description: "Mã số thuế phải có 10 chữ số" },
  { id: "province", name: "province", label: "Tỉnh/Thành phố", type: "select", required: true, options: [
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Hải Phòng", label: "Hải Phòng" },
    { value: "Cần Thơ", label: "Cần Thơ" },
    { value: "Bình Dương", label: "Bình Dương" },
    { value: "Đồng Nai", label: "Đồng Nai" },
    { value: "Quảng Ninh", label: "Quảng Ninh" },
    { value: "Thanh Hóa", label: "Thanh Hóa" },
    { value: "Nghệ An", label: "Nghệ An" },
  ], placeholder: "Chọn tỉnh/thành phố" },
  { id: "taxOfficeCode", name: "taxOfficeCode", label: "Mã cơ quan thuế", type: "text", required: false, placeholder: "Nhập mã CQ thuế" },
  { id: "phone", name: "phone", label: "Số điện thoại", type: "text", required: false, placeholder: "Nhập số điện thoại" },
  { id: "email", name: "email", label: "Email", type: "email", required: false, placeholder: "Nhập email" },
  { id: "industry", name: "industry", label: "Ngành nghề", type: "select", required: false, options: [
    { value: "Sản xuất", label: "Sản xuất" },
    { value: "Thương mại", label: "Thương mại" },
    { value: "Dịch vụ", label: "Dịch vụ" },
    { value: "Xây dựng", label: "Xây dựng" },
    { value: "CNTT", label: "CNTT" },
    { value: "Vận tải", label: "Vận tải" },
    { value: "Tài chính", label: "Tài chính" },
    { value: "Bất động sản", label: "Bất động sản" },
    { value: "Y tế", label: "Y tế" },
    { value: "Giáo dục", label: "Giáo dục" },
  ], placeholder: "Chọn ngành nghề" },
]

// --- Định nghĩa các hằng số cho tab và dữ liệu ---

const PROVINCES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Quảng Ninh", "Thanh Hóa", "Nghệ An"
]
const INDUSTRIES = [
  "Sản xuất", "Thương mại", "Dịch vụ", "Xây dựng", "CNTT", "Vận tải", "Tài chính", "Bất động sản", "Y tế", "Giáo dục"
]
const PRICING_METHODS = [
  { value: 'bqtt', label: 'Bình quân tức thời' },
  { value: 'fifo', label: 'Phương pháp nhập trước xuất trước' },
  { value: 'bqck', label: 'Bình quân cuối kỳ' },
  { value: 'specific', label: 'Thực tế đích danh' },
];
const TAX_METHODS = [
  { value: 'accrual', label: 'Phương pháp khấu trừ' },
  { value: 'direct', label: 'Phương pháp trực tiếp' },
  { value: 'hybrid', label: 'Phương pháp hỗn hợp' },
];
const DECISION_OPTIONS = [
  { value: 'c200', label: 'Quyết định 48/2006/QĐ-BTC (C200)' },
  { value: 'c133', label: 'Thông tư 133/2016/TT-BTC (C133)' },
];

export default function CompanyFormModal({ isOpen, onClose, onSubmit, initialData = {}, mode }: CompanyFormModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [activeTab, setActiveTab] = useState<'info'|'accounting'|'firmbanking'|'signature'|'invoice'>('info')
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<'email'|'sms'|'digital-signature'>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountOwner: '',
    branch: ''
  })
  const [showAddSecurityModal, setShowAddSecurityModal] = useState(false)
  const [newSecurityQuestion, setNewSecurityQuestion] = useState({
    question: '',
    answer: ''
  })

  useEffect(() => {
    if (isOpen) {
      setActiveTab('info')
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        taxCode: initialData.taxCode || '',
        province: initialData.province || '',
        taxOfficeCode: initialData.taxOfficeCode || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        industry: initialData.industry || [],
        companyType: initialData.companyType || '',
        accountingCompany: initialData.accountingCompany || '',
        accountingPeriod: initialData.accountingPeriod || '',
        directorName: initialData.directorName || '',
        businessRegistrationNumber: initialData.businessRegistrationNumber || '',
        businessForm: initialData.businessForm || '',
        businessType: initialData.businessType || '',
        fax: initialData.fax || '',
        operationStartDate: initialData.operationStartDate || '',
        positionVietnamese: initialData.positionVietnamese || 'Giám đốc',
        positionEnglish: initialData.positionEnglish || 'Director',
        positionKorean: initialData.positionKorean || '감독',
        positionChinese: initialData.positionChinese || '董事',
        settings: initialData.settings || {},
        id: initialData.id
      })
    }
  }, [isOpen, initialData])

  // Validate tax code
  const validateTaxCode = (taxCode: string) => /^\d{10}$|^\d{13}$/.test(taxCode)

  // Validate form
  const validateForm = () => {
    if (!formData.name?.trim() || !formData.address?.trim() || !formData.taxCode?.trim() || !formData.province?.trim()) return false
    if (!formData.companyType?.trim() || !formData.accountingCompany?.trim() || !formData.accountingPeriod?.trim()) return false
    if (!validateTaxCode(formData.taxCode)) return false
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    if (!isSubmitting) onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] mx-2 sm:mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Chỉnh sửa công ty' : 'Thêm mới công ty'}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50 flex-shrink-0">
          <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'info' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building2 className="inline h-4 w-4 mr-1 sm:mr-2" />
              Thông tin công ty
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'accounting' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="inline h-4 w-4 mr-1 sm:mr-2" />
              Thiết lập kế toán
            </button>
            <button
              onClick={() => setActiveTab('firmbanking')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'firmbanking' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="inline h-4 w-4 mr-1 sm:mr-2" />
              Firmbanking
            </button>
            <button
              onClick={() => setActiveTab('signature')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'signature' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileSignature className="inline h-4 w-4 mr-1 sm:mr-2" />
              Chữ ký
            </button>
            <button
              onClick={() => setActiveTab('invoice')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'invoice' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Receipt className="inline h-4 w-4 mr-1 sm:mr-2" />
              Hóa đơn
            </button>
          </nav>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Tab Thông tin công ty */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Required Fields Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="inline h-5 w-5 mr-2 text-gray-600" />
                  Thông tin bắt buộc
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại công ty <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.companyType || ''}
                      onChange={e => setFormData({ ...formData, companyType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn loại công ty</option>
                      <option value="company">Công ty</option>
                      <option value="individual">Cá nhân</option>
                    </select>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên công ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên công ty"
                    />
                  </div>

                  {/* Tax Code */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã số thuế <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.taxCode || ''}
                      onChange={e => setFormData({ ...formData, taxCode: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formData.taxCode && !validateTaxCode(formData.taxCode) ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Nhập mã số thuế"
                      maxLength={13}
                    />
                    {formData.taxCode && !validateTaxCode(formData.taxCode) && (
                      <p className="text-red-500 text-xs mt-1">Mã số thuế phải có 10 hoặc 13 chữ số</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address || ''}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ công ty"
                    />
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.province || ''}
                      onChange={e => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {PROVINCES.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tax Office Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã cơ quan thuế <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.taxOfficeCode || ''}
                      onChange={e => setFormData({ ...formData, taxOfficeCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mã cơ quan thuế"
                    />
                  </div>

                  {/* Accounting Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Công ty kế toán phụ trách <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountingCompany || ''}
                      onChange={e => setFormData({ ...formData, accountingCompany: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên công ty kế toán"
                    />
                  </div>

                  {/* Accounting Period */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kỳ kế toán <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.accountingPeriod || ''}
                      onChange={e => setFormData({ ...formData, accountingPeriod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn kỳ kế toán</option>
                      <option value="2024">Năm 2024</option>
                      <option value="2025">Năm 2025</option>
                      <option value="2026">Năm 2026</option>
                      <option value="2027">Năm 2027</option>
                      <option value="2028">Năm 2028</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Optional Fields Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin bổ sung</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Director Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên giám đốc
                    </label>
                    <input
                      type="text"
                      value={formData.directorName || ''}
                      onChange={e => setFormData({ ...formData, directorName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên giám đốc"
                    />
                  </div>

                  {/* Business Registration Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số đăng ký kinh doanh
                    </label>
                    <input
                      type="text"
                      value={formData.businessRegistrationNumber || ''}
                      onChange={e => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số đăng ký kinh doanh"
                    />
                  </div>

                  {/* Business Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình thức kinh doanh
                    </label>
                    <select
                      value={formData.businessForm || ''}
                      onChange={e => setFormData({ ...formData, businessForm: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn hình thức kinh doanh</option>
                      <option value="Công ty trách nhiệm hữu hạn một thành viên">Công ty trách nhiệm hữu hạn một thành viên</option>
                      <option value="Công ty trách nhiệm hữu hạn hai thành viên trở lên">Công ty trách nhiệm hữu hạn hai thành viên trở lên</option>
                      <option value="Công ty cổ phần">Công ty cổ phần</option>
                      <option value="Công ty hợp danh">Công ty hợp danh</option>
                      <option value="Doanh nghiệp tư nhân">Doanh nghiệp tư nhân</option>
                      <option value="Hợp tác xã">Hợp tác xã</option>
                      <option value="Liên hiệp hợp tác xã">Liên hiệp hợp tác xã</option>
                    </select>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại hình kinh doanh
                    </label>
                    <select
                      value={formData.businessType || ''}
                      onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn loại hình kinh doanh</option>
                      {INDUSTRIES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập email công ty"
                    />
                  </div>

                  {/* Fax */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fax
                    </label>
                    <input
                      type="text"
                      value={formData.fax || ''}
                      onChange={e => setFormData({ ...formData, fax: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập số fax"
                    />
                  </div>

                  {/* Operation Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu hoạt động
                    </label>
                    <input
                      type="date"
                      value={formData.operationStartDate || ''}
                      onChange={e => setFormData({ ...formData, operationStartDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Position Vietnamese */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chức vụ (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={formData.positionVietnamese || 'Giám đốc'}
                      onChange={e => setFormData({ ...formData, positionVietnamese: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập chức vụ bằng tiếng Việt"
                    />
                  </div>

                  {/* Position English */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chức vụ (Tiếng Anh)
                    </label>
                    <input
                      type="text"
                      value={formData.positionEnglish || 'Director'}
                      onChange={e => setFormData({ ...formData, positionEnglish: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter position in English"
                    />
                  </div>

                  {/* Position Korean */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chức vụ (Tiếng Hàn)
                    </label>
                    <input
                      type="text"
                      value={formData.positionKorean || '감독'}
                      onChange={e => setFormData({ ...formData, positionKorean: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="한국어로 직책 입력"
                    />
                  </div>

                  {/* Position Chinese */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chức vụ (Tiếng Trung)
                    </label>
                    <input
                      type="text"
                      value={formData.positionChinese || '董事'}
                      onChange={e => setFormData({ ...formData, positionChinese: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="输入中文职位"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Thiết lập kế toán */}
          {activeTab === 'accounting' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-blue-600" />
                  Thiết lập dữ liệu kế toán
                </h2>
                
                <form onSubmit={e => { e.preventDefault(); alert('Đã lưu cài đặt kế toán!'); }} className="space-y-6">
                  {/* Quyết định/Thông tư */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Dữ liệu báo cáo thuế</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quyết định/thông tư <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.settings?.accounting?.decision || ''}
                          onChange={e => setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings!,
                              accounting: {
                                ...formData.settings?.accounting,
                                decision: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Chọn quyết định/thông tư</option>
                          <option value="c200">Quyết định 48/2006/QĐ-BTC (C200)</option>
                          <option value="c133">Thông tư 133/2016/TT-BTC (C133)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Methods */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pricing Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương pháp tính giá <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.settings?.accounting?.pricing || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            accounting: {
                              ...formData.settings?.accounting,
                              pricing: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn phương pháp tính giá</option>
                        {PRICING_METHODS.map(method => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tax Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương pháp tính thuế <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.settings?.accounting?.tax || ''}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            accounting: {
                              ...formData.settings?.accounting,
                              tax: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn phương pháp tính thuế</option>
                        {TAX_METHODS.map(method => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Closing Method - radio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương pháp khóa sổ <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6 border border-gray-300 rounded px-3 py-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="lockMethod"
                            value="basic"
                            checked={formData.settings?.accounting?.lockMethod === 'basic'}
                            onChange={e => setFormData({
                              ...formData,
                              settings: {
                                ...formData.settings!,
                                accounting: {
                                  ...formData.settings?.accounting,
                                  lockMethod: e.target.value
                                }
                              }
                            })}
                            className="accent-blue-600"
                          />
                          Cơ bản
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="lockMethod"
                            value="sequence"
                            checked={formData.settings?.accounting?.lockMethod === 'sequence'}
                            onChange={e => setFormData({
                              ...formData,
                              settings: {
                                ...formData.settings!,
                                accounting: {
                                  ...formData.settings?.accounting,
                                  lockMethod: e.target.value
                                }
                              }
                            })}
                            className="accent-blue-600"
                          />
                          Trình tự
                        </label>
                      </div>
                    </div>

                    {/* Decimal Places - input number thay vì select */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số thập phân <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={formData.settings?.accounting?.decimal || 2}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            accounting: {
                              ...formData.settings?.accounting,
                              decimal: parseInt(e.target.value)
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập số thập phân (0-4)"
                      />
                    </div>
                  </div>

                  {/* Additional Settings */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Cài đặt bổ sung</h3>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowNegativeInventory"
                        checked={formData.settings?.accounting?.allowNegative || false}
                        onChange={e => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings!,
                            accounting: {
                              ...formData.settings?.accounting,
                              allowNegative: e.target.checked
                            }
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowNegativeInventory" className="ml-2 text-sm text-gray-700">
                        Cho phép xuất âm tồn kho
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Lưu cài đặt
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tab Firmbanking */}
          {activeTab === 'firmbanking' && (
            <form onSubmit={e => { e.preventDefault(); alert('Đã lưu cài đặt Firmbanking!'); }} className="space-y-8">
              {/* Bank Accounts Management */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Quản lý tài khoản ngân hàng</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddBankModal(true)}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm tài khoản
                  </button>
                </div>

                {/* Bank Accounts List */}
                <div className="space-y-3">
                  {formData.bankAccounts && formData.bankAccounts.length > 0 ? (
                    formData.bankAccounts.map((account: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{account.bankName}</h4>
                            <p className="text-sm text-gray-600">STK: {account.accountNumber}</p>
                            <p className="text-sm text-gray-600">Chủ TK: {account.accountOwner}</p>
                            <p className="text-sm text-gray-600">Chi nhánh: {account.branch}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setNewBankAccount(account);
                                setShowAddBankModal(true);
                              }}
                              className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newAccounts = formData.bankAccounts?.filter((_: any, i: number) => i !== index) || [];
                                setFormData({
                                  ...formData,
                                  bankAccounts: newAccounts
                                });
                              }}
                              className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Chưa có tài khoản ngân hàng nào</p>
                  )}
                </div>
              </div>

              {/* Modal thêm tài khoản ngân hàng */}
              {showAddBankModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                  <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {newBankAccount.accountNumber && formData.bankAccounts?.some((acc: any) => acc.accountNumber === newBankAccount.accountNumber) ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
                      </h3>
                      <button 
                        type="button"
                        onClick={() => {
                          setShowAddBankModal(false);
                          setNewBankAccount({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên ngân hàng
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.bankName}
                            onChange={e => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên ngân hàng"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số tài khoản
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.accountNumber}
                            onChange={e => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập số tài khoản"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên chủ tài khoản
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.accountOwner}
                            onChange={e => setNewBankAccount({...newBankAccount, accountOwner: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên chủ tài khoản"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chi nhánh
                          </label>
                          <input
                            type="text"
                            value={newBankAccount.branch}
                            onChange={e => setNewBankAccount({...newBankAccount, branch: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập chi nhánh"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          if (newBankAccount.bankName && newBankAccount.accountNumber && newBankAccount.accountOwner && newBankAccount.branch) {
                            const currentAccounts = formData.bankAccounts || [];
                            const isEditing = currentAccounts.some((acc: any) => acc.accountNumber === newBankAccount.accountNumber);
                            
                            if (isEditing) {
                              setFormData({
                                ...formData,
                                bankAccounts: currentAccounts.map((acc: any) => 
                                  acc.accountNumber === newBankAccount.accountNumber ? newBankAccount : acc
                                )
                              });
                            } else {
                              setFormData({
                                ...formData,
                                bankAccounts: [...currentAccounts, newBankAccount]
                              });
                            }
                            
                            setNewBankAccount({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
                            setShowAddBankModal(false);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {newBankAccount.accountNumber && formData.bankAccounts?.some((acc: any) => acc.accountNumber === newBankAccount.accountNumber) ? 'Cập nhật' : 'Thêm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewBankAccount({ bankName: '', accountNumber: '', accountOwner: '', branch: '' });
                          setShowAddBankModal(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* OTP Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email nhận OTP
                  </label>
                  <input
                    type="email"
                    value={formData.otpEmail || ''}
                    onChange={e => setFormData({ ...formData, otpEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email nhận OTP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại nhận OTP
                  </label>
                  <input
                    type="tel"
                    value={formData.otpPhone || ''}
                    onChange={e => setFormData({ ...formData, otpPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại nhận OTP"
                  />
                </div>
              </div>

              {/* Security Questions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-600" />
                    Câu hỏi bảo mật
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddSecurityModal(true)}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm câu hỏi
                  </button>
                </div>

                {/* Security Questions List */}
                <div className="space-y-3">
                  {formData.securityQuestions && formData.securityQuestions.length > 0 ? (
                    formData.securityQuestions.map((question: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{question.question}</p>
                            <p className="text-sm text-gray-600 mt-1">Câu trả lời: {question.answer}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newQuestions = formData.securityQuestions?.filter((_: any, i: number) => i !== index) || [];
                              setFormData({
                                ...formData,
                                securityQuestions: newQuestions
                              });
                            }}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Chưa có câu hỏi bảo mật nào</p>
                  )}
                </div>

                {/* Modal thêm câu hỏi bảo mật */}
                {showAddSecurityModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Thêm câu hỏi bảo mật</h3>
                        <button 
                          type="button"
                          onClick={() => setShowAddSecurityModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Câu hỏi
                          </label>
                          <select
                            value={newSecurityQuestion.question}
                            onChange={e => setNewSecurityQuestion({...newSecurityQuestion, question: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Chọn câu hỏi</option>
                            <option value="Tên trường tiểu học đầu tiên của bạn?">Tên trường tiểu học đầu tiên của bạn?</option>
                            <option value="Tên thú cưng đầu tiên của bạn?">Tên thú cưng đầu tiên của bạn?</option>
                            <option value="Tên người bạn thân nhất thời thơ ấu?">Tên người bạn thân nhất thời thơ ấu?</option>
                            <option value="Tên phố nơi bạn sinh ra?">Tên phố nơi bạn sinh ra?</option>
                            <option value="Món ăn yêu thích của bạn?">Món ăn yêu thích của bạn?</option>
                            <option value="Tên của giáo viên chủ nhiệm lớp 12?">Tên của giáo viên chủ nhiệm lớp 12?</option>
                            <option value="Màu sắc yêu thích của bạn?">Màu sắc yêu thích của bạn?</option>
                            <option value="Tên quê hương của cha/mẹ bạn?">Tên quê hương của cha/mẹ bạn?</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Câu trả lời
                          </label>
                          <input
                            type="text"
                            value={newSecurityQuestion.answer}
                            onChange={e => setNewSecurityQuestion({...newSecurityQuestion, answer: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập câu trả lời"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            if (newSecurityQuestion.question && newSecurityQuestion.answer) {
                              const currentQuestions = formData.securityQuestions || [];
                              setFormData({
                                ...formData,
                                securityQuestions: [...currentQuestions, newSecurityQuestion]
                              });
                              setNewSecurityQuestion({ question: '', answer: '' });
                              setShowAddSecurityModal(false);
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Thêm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewSecurityQuestion({ question: '', answer: '' });
                            setShowAddSecurityModal(false);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* Tab Chữ ký - giao diện giống hình mẫu */}
          {activeTab === 'signature' && (
            <form onSubmit={e => { e.preventDefault(); alert('Đã lưu thiết lập chữ ký số!'); }} className="space-y-8">
              {/* Form nhập tên chức danh */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Chữ ký</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-gray-700 text-sm font-medium">Giám đốc</label>
                      <input
                        type="text"
                        value={formData.directorName || ''}
                        onChange={e => setFormData({ ...formData, directorName: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên giám đốc"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-gray-700 text-sm font-medium">Kế toán trưởng</label>
                      <input
                        type="text"
                        value={formData.chiefAccountant || ''}
                        onChange={e => setFormData({ ...formData, chiefAccountant: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên kế toán trưởng"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-gray-700 text-sm font-medium">Thủ quỹ</label>
                      <input
                        type="text"
                        value={formData.treasurer || ''}
                        onChange={e => setFormData({ ...formData, treasurer: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên thủ quỹ"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-gray-700 text-sm font-medium">Thủ kho</label>
                      <input
                        type="text"
                        value={formData.warehouseKeeper || ''}
                        onChange={e => setFormData({ ...formData, warehouseKeeper: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên thủ kho"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-gray-700 text-sm font-medium">Người lập biểu</label>
                      <input
                        type="text"
                        value={formData.reportMaker || ''}
                        onChange={e => setFormData({ ...formData, reportMaker: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên người lập biểu"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-gray-700 text-sm font-medium">Người kiểm tra</label>
                      <input
                        type="text"
                        value={formData.inspector || ''}
                        onChange={e => setFormData({ ...formData, inspector: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập tên người kiểm tra"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng chữ ký và dấu */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 border-b text-left font-semibold">Chức vụ</th>
                      <th className="px-4 py-2 border-b text-left font-semibold">Chữ ký và dấu (Hình ảnh)</th>
                      <th className="px-4 py-2 border-b text-center font-semibold">Sử dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'director', label: 'Giám đốc' },
                      { key: 'chiefAccountant', label: 'Kế toán trưởng' },
                      { key: 'treasurer', label: 'Thủ quỹ' },
                      { key: 'warehouseKeeper', label: 'Thủ kho' },
                      { key: 'reportMaker', label: 'Người lập biểu' },
                      { key: 'inspector', label: 'Người kiểm tra' },
                    ].map(({ key, label }, idx) => (
                      <tr key={key} className="even:bg-gray-50">
                        <td className="px-4 py-2 align-middle">{label}</td>
                        <td className="px-4 py-2 align-middle">
                          <div className="flex items-center gap-3">
                            {formData[`${key}SignaturePreview`] ? (
                              <img src={formData[`${key}SignaturePreview`]} alt="Signature" className="h-12 max-w-[120px] object-contain border border-gray-200 rounded bg-white" />
                            ) : (
                              <span className="italic text-gray-400">Chưa có</span>
                            )}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                                  if (!allowedTypes.includes(file.type)) {
                                    alert('Chỉ chấp nhận file hình ảnh (PNG, JPG, JPEG)');
                                    return;
                                  }
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert('Kích thước file không được vượt quá 5MB');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setFormData({
                                      ...formData,
                                      [`${key}SignatureFile`]: file,
                                      [`${key}SignaturePreview`]: event.target?.result as string
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                              id={`file-${key}`}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById(`file-${key}`)?.click()}
                              className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              {formData[`${key}SignaturePreview`] ? 'Thay đổi' : 'Upload'}
                            </button>
                            {formData[`${key}SignaturePreview`] && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    [`${key}SignatureFile`]: undefined,
                                    [`${key}SignaturePreview`]: undefined
                                  });
                                  const input = document.getElementById(`file-${key}`) as HTMLInputElement;
                                  if (input) input.value = '';
                                }}
                                className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Xóa
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 align-middle text-center">
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              [`${key}Enabled`]: !(formData[`${key}Enabled`] ?? true)
                            })}
                            className="focus:outline-none"
                            tabIndex={-1}
                          >
                            {formData[`${key}Enabled`] ?? true ? (
                              <CheckSquare className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 2 checkbox tuỳ chọn */}
              <div className="flex flex-col gap-3 mt-4">
                <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.printAllReports ?? true}
                    onChange={e => setFormData({ ...formData, printAllReports: e.target.checked })}
                    className="h-4 w-4 accent-blue-600 border-gray-300 rounded mr-3 focus:ring-blue-500 focus:ring-2"
                  />
                  In trên tất cả báo cáo
                </label>
                <label className="inline-flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoFillMaker ?? true}
                    onChange={e => setFormData({ ...formData, autoFillMaker: e.target.checked })}
                    className="h-4 w-4 accent-blue-600 border-gray-300 rounded mr-3 focus:ring-blue-500 focus:ring-2"
                  />
                  Lấy tên người lập chứng từ theo tên người đăng nhập
                </label>
              </div>
            </form>
          )}

          {/* Tab Hóa đơn */}
          {activeTab === 'invoice' && (
            <div className="space-y-6">
              {/* Sub-tabs cho Hóa đơn */}
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
                  <button
                    className={`px-2 sm:px-4 py-2 rounded-t-md font-medium flex items-center space-x-1 sm:space-x-2 focus:outline-none transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm ${activeInvoiceTab === 'email' ? 'bg-white border-x border-t border-gray-200 text-blue-600' : 'bg-gray-50 text-gray-500 hover:text-blue-700'}`}
                    onClick={() => setActiveInvoiceTab('email')}
                  >
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Thiết lập email gửi hóa đơn</span>
                    <span className="sm:hidden">Email</span>
                  </button>
                  <button
                    className={`px-2 sm:px-4 py-2 rounded-t-md font-medium flex items-center space-x-1 sm:space-x-2 focus:outline-none transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm ${activeInvoiceTab === 'sms' ? 'bg-white border-x border-t border-gray-200 text-blue-600' : 'bg-gray-50 text-gray-500 hover:text-blue-700'}`}
                    onClick={() => setActiveInvoiceTab('sms')}
                  >
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Thiết lập SMS gửi hóa đơn</span>
                    <span className="sm:hidden">SMS</span>
                  </button>
                  <button
                    className={`px-2 sm:px-4 py-2 rounded-t-md font-medium flex items-center space-x-1 sm:space-x-2 focus:outline-none transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm ${activeInvoiceTab === 'digital-signature' ? 'bg-white border-x border-t border-gray-200 text-blue-600' : 'bg-gray-50 text-gray-500 hover:text-blue-700'}`}
                    onClick={() => setActiveInvoiceTab('digital-signature')}
                  >
                    <Usb className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Thiết lập chữ ký số</span>
                    <span className="sm:hidden">Chữ ký số</span>
                  </button>
                </div>
              </div>

              {/* Tab Thiết lập email gửi hóa đơn */}
              {activeInvoiceTab === 'email' && (
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Máy chủ Mail <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div className="w-20 sm:w-24">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cổng <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="25" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên người gửi <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email gửi <span className="text-red-500">*</span></label>
                      <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                      <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức bảo mật</label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <label className="flex items-center gap-1 text-sm">
                            <input type="radio" name="security" value="None" className="accent-blue-600" />
                            None
                          </label>
                          <label className="flex items-center gap-1 text-sm">
                            <input type="radio" name="security" value="SSL" className="accent-blue-600" />
                            SSL
                          </label>
                          <label className="flex items-center gap-1 text-sm">
                            <input type="radio" name="security" value="TLS" defaultChecked className="accent-blue-600" />
                            TLS
                          </label>
                        </div>
                        <button type="button" className="w-full sm:w-auto px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">Kiểm tra kết nối</button>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="useAmnote" value="amnote" defaultChecked className="accent-blue-600" />
                          Sử dụng email AMnote
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="useAmnote" value="amnote2" className="accent-blue-600" />
                          Sử dụng gmail AMnote
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="useAmnote" value="other" className="accent-blue-600" />
                          Khác
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 sm:mt-6">
                    <button type="submit" className="inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm">
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Lưu
                    </button>
                    <button type="button" className="inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 focus:outline-none transition-colors duration-200 text-sm">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Tab Thiết lập SMS gửi hóa đơn */}
              {activeInvoiceTab === 'sms' && (
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Api Key <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name <span className="text-red-500">*</span></label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 sm:mt-6">
                    <button type="submit" className="inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm">
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Lưu
                    </button>
                    <button type="button" className="inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 focus:outline-none transition-colors duration-200 text-sm">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Tab Thiết lập chữ ký số */}
              {activeInvoiceTab === 'digital-signature' && (
                <form className="space-y-4 sm:space-y-6 flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px]">
                  <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
                    <Usb className="w-24 h-24 sm:w-32 sm:h-32 text-blue-500 mb-2" />
                    <FileText className="w-24 h-12 sm:w-32 sm:h-16 text-blue-400" />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4 sm:mt-6 w-full sm:w-auto">
                    <button type="submit" className="inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm">
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Lưu
                    </button>
                    <button type="button" className="inline-flex items-center justify-center px-4 sm:px-6 py-2 bg-blue-100 text-blue-700 font-medium rounded-md hover:bg-blue-200 focus:outline-none transition-colors duration-200 text-sm">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer - Always Visible */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={closeModal}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            disabled={isSubmitting || !validateForm()}
          >
            <Check className="h-4 w-4" />
            <span>{mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
