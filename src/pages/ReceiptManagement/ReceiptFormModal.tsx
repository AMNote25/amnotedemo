
"use client"

import { useState, useCallback, useEffect } from "react"
import { X, Save, ChevronLeft, ChevronRight, FileText, UserCheck, Info, BookOpen, Settings } from "lucide-react"
import { receiptFormConfig } from "./receiptFormConfig"

interface ReceiptFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void> | void
  initialData?: any
  existingData?: any[]
  mode: "add" | "edit"
}

export default function ReceiptFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  existingData = [],
  mode,
}: ReceiptFormModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [activeTab, setActiveTab] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([0])

  useEffect(() => {
    if (isOpen) {
      const defaultData: any = {}
      receiptFormConfig.fields.forEach(field => {
        defaultData[field.id] = mode === "edit" ? initialData[field.id] || "" : ""
      })
      if (mode === "edit" && initialData.id) {
        defaultData.id = initialData.id
      }
      setFormData(defaultData)
      setActiveTab(0)
      setErrors({})
      setTouched({})
      setCompletedSteps([0])
    }
  }, [isOpen, initialData, mode])

  const validateField = useCallback((fieldName: string, value: any) => {
    const field = receiptFormConfig.fields.find(f => f.id === fieldName)
    const fieldErrors: string[] = []
    if (!field) return fieldErrors
    if (field.required && (!value || String(value).trim() === "")) {
      fieldErrors.push(`${field.label} là bắt buộc`)
    }
    if (field.validation) {
      if (field.validation.maxLength && value && String(value).length > field.validation.maxLength) {
        fieldErrors.push(`${field.label} không được vượt quá ${field.validation.maxLength} ký tự`)
      }
      if (field.validation.pattern && value && !new RegExp(field.validation.pattern).test(value)) {
        fieldErrors.push(`${field.label} không đúng định dạng`)
      }
      if (field.validation.min !== undefined && value && Number(value) < field.validation.min) {
        fieldErrors.push(`${field.label} phải lớn hơn hoặc bằng ${field.validation.min}`)
      }
    }
    return fieldErrors
  }, [])

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string[] } = {}
    let hasErrors = false
    receiptFormConfig.fields.forEach(field => {
      const fieldErrors = validateField(field.id, formData[field.id])
      if (fieldErrors.length > 0) {
        newErrors[field.id] = fieldErrors
        hasErrors = true
      }
    })
    setErrors(newErrors)
    return !hasErrors
  }, [formData, validateField])

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
    if (touched[fieldName]) {
      const fieldErrors = validateField(fieldName, value)
      setErrors((prev) => ({ ...prev, [fieldName]: fieldErrors }))
    }
  }, [touched, validateField])

  const handleFieldBlur = useCallback((fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))
    const fieldErrors = validateField(fieldName, formData[fieldName])
    setErrors((prev) => ({ ...prev, [fieldName]: fieldErrors }))
  }, [formData, validateField])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched: { [key: string]: boolean } = {}
    receiptFormConfig.fields.forEach(field => { allTouched[field.id] = true })
    setTouched(allTouched)
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      let submitData: any = {}
      if (mode === "edit") {
        submitData = { ...initialData, ...formData }
      } else {
        submitData = { ...formData }
      }
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, onSubmit, onClose, initialData, mode])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose()
    }
  }, [isSubmitting, onClose])


  if (!isOpen) return null

  // Định nghĩa lại các tab và trường tương ứng theo yêu cầu mới
  const tabConfigs = [
    {
      label: "Thông tin chung",
      icon: FileText,
      fields: [
        "receiptNo", // Số chứng từ
        "transactionDate", // Ngày giao dịch
        "amount", // Số tiền
        "amountSecond", // Số tiền (2)
        "fcAmount", // FC Số tiền
        "receiverName", // Người nhận tiền
        "email", // Email
        "country", // Quốc gia
        "customerCode", // Mã khách hàng
        "customerName", // Tên khách hàng
        "bankName" // Tên ngân hàng
      ],
    },
    {
      label: "Kế toán & Mô tả",
      icon: BookOpen,
      fields: [
        "description1", // Mô tả 1
        "description2", // Mô tả 2
        "debit", // Nợ
        "debitAccountName", // Tên tài khoản nợ
        "credit", // Có
        "creditAccountName", // Tên tài khoản có
        "costCenter1", // Đối tượng tập hợp chi phí 1
        "costCenter2", // Đối tượng tập hợp chi phí 2
        "inventory" // Hàng tồn kho
      ],
    },
    {
      label: "Quản lý & Ghi chú",
      icon: Settings,
      fields: [
        "note1", // Quản lý ghi chú 1
        "note2", // Quản lý ghi chú 2
        "isLocked", // Đã khóa
        "attachment", // File đính kèm
        "createdBy", // Người tạo
        "currentEditor", // Người sửa đổi hiện tại
        "modifiedDate", // Ngày sửa đổi
        "manageCode", // Mã số quản lý
        "manageCode2" // Mã số quản lý 2
      ],
    },
  ]

  // Validate từng step
  const isStepValid = (step: number) => {
    const fields = tabConfigs[step].fields
    return fields.every((field) => {
      const errs = validateField(field, formData[field])
      return !errs || errs.length === 0
    })
  }

  const handleNext = () => {
    if (isStepValid(activeTab)) {
      setCompletedSteps((prev) => Array.from(new Set([...prev, activeTab + 1])))
      setActiveTab((prev) => prev + 1)
    } else {
      // Đánh dấu touched và show lỗi
      const fields = tabConfigs[activeTab].fields
      const newTouched: any = { ...touched }
      fields.forEach((field) => {
        newTouched[field] = true
      })
      setTouched(newTouched)
      const newErrors: any = { ...errors }
      fields.forEach((field) => {
        newErrors[field] = validateField(field, formData[field])
      })
      setErrors(newErrors)
    }
  }

  const handlePrev = () => {
    setActiveTab((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === "add" ? "Thêm phiếu thu mới" : "Chỉnh sửa phiếu thu"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? "Thêm mới phiếu thu vào hệ thống" : "Cập nhật thông tin phiếu thu"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs/Steps */}
        <div className="border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {tabConfigs.map((tab, idx) => {
              const Icon = tab.icon
              const isClickable = completedSteps.includes(idx) || idx === activeTab
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => isClickable && setActiveTab(idx)}
                  className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                    activeTab === idx
                      ? 'border-blue-500 text-blue-600'
                      : isClickable
                        ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        : 'border-transparent text-gray-500 cursor-not-allowed opacity-60'
                  }`}
                  disabled={!isClickable}
                >
                  <Icon className="inline h-4 w-4 mr-1 sm:mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            {/* Tab content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tabConfigs[activeTab].fields.map(fieldId => {
                const field = receiptFormConfig.fields.find(f => f.id === fieldId)
                if (!field) return null
                return (
                  <div key={field.id} className="flex flex-col">
                    <label htmlFor={field.id} className="font-medium text-gray-700 mb-1">
                      {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        onBlur={() => handleFieldBlur(field.id)}
                        placeholder={field.placeholder}
                        className={`border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${errors[field.id]?.length ? 'border-red-500' : 'border-gray-300'} transition-colors`}
                        rows={3}
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        onBlur={() => handleFieldBlur(field.id)}
                        className={`border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${errors[field.id]?.length ? 'border-red-500' : 'border-gray-300'} transition-colors`}
                      >
                        <option value="">Chọn...</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.id}
                        type={field.type || "text"}
                        value={formData[field.id] || ""}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        onBlur={() => handleFieldBlur(field.id)}
                        placeholder={field.placeholder}
                        className={`border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${errors[field.id]?.length ? 'border-red-500' : 'border-gray-300'} transition-colors`}
                      />
                    )}
                    {errors[field.id]?.length > 0 && (
                      <span className="text-red-500 text-xs mt-1">{errors[field.id][0]}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:block">Hủy</span>
            </button>
            {/* Quay lại */}
            {activeTab > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:block">Quay lại</span>
              </button>
            )}
            {/* Tiếp theo */}
            {activeTab < tabConfigs.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <ChevronRight className="w-4 h-4" />
                <span className="hidden sm:block">Tiếp tục</span>
              </button>
            )}
            {/* Lưu */}
            {activeTab === tabConfigs.length - 1 && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:block">Lưu</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
