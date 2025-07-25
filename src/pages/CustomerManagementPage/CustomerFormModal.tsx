"use client"

import { useState, useCallback, useEffect } from "react"
import { X, Save, AlertCircle, Info, Loader2 } from "lucide-react"

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void> | void
  initialData?: any
  existingData?: any[]
  mode: "add" | "edit"
}

export default function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  existingData = [],
  mode,
}: CustomerFormModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (isOpen) {
      const defaultData: any = {
        nameVi: mode === "edit" ? initialData.nameVi || "" : "",
        nameEn: mode === "edit" ? initialData.nameEn || "" : "",
        nameKo: mode === "edit" ? initialData.nameKo || "" : "",
        buyerName: mode === "edit" ? initialData.buyerName || "" : "",
        customerUserCode: mode === "edit" ? initialData.customerUserCode || "" : "",
        customerType: mode === "edit" ? initialData.customerType || "" : "",
        categoryCode: mode === "edit" ? initialData.categoryCode || "" : "",
        taxCode: mode === "edit" ? initialData.taxCode || "" : "",
        email: mode === "edit" ? initialData.email || "" : "",
        tel: mode === "edit" ? initialData.tel || "" : "",
        fax: mode === "edit" ? initialData.fax || "" : "",
        ownerName: mode === "edit" ? initialData.ownerName || "" : "",
        businessType: mode === "edit" ? initialData.businessType || "" : "",
        kindBusiness: mode === "edit" ? initialData.kindBusiness || "" : "",
        zipCode: mode === "edit" ? initialData.zipCode || "" : "",
        address: mode === "edit" ? initialData.address || "" : "",
        notes: mode === "edit" ? initialData.notes || "" : "",
      }
      if (mode === "edit" && initialData.id) {
        defaultData.id = initialData.id
      }
      setFormData(defaultData)
      setErrors({})
      setTouched({})
    }
  }, [isOpen, initialData, mode])

  const validateField = useCallback(
    (fieldName: string, value: any) => {
      const fieldErrors: string[] = []

      switch (fieldName) {
        case "nameVi":
          if (!value || String(value).trim() === "") {
            fieldErrors.push("Tên khách hàng (Tiếng Việt) là bắt buộc")
          } else if (String(value).length > 255) {
            fieldErrors.push("Tên không được vượt quá 255 ký tự")
          }
          break
        case "nameEn":
          if (value && String(value).length > 255) {
            fieldErrors.push("Tên tiếng Anh không được vượt quá 255 ký tự")
          }
          break
        case "nameKo":
          if (value && String(value).length > 255) {
            fieldErrors.push("Tên tiếng Hàn không được vượt quá 255 ký tự")
          }
          break
        case "customerType":
          if (!value || String(value).trim() === "") {
            fieldErrors.push("Loại khách hàng là bắt buộc")
          } else if (!/^[0-9]$/.test(value)) {
            fieldErrors.push("Loại khách hàng chỉ được chứa một chữ số")
          }
          break
        case "categoryCode":
          if (!value || String(value).trim() === "") {
            fieldErrors.push("Mã danh mục là bắt buộc")
          } else if (!/^[0-9]$/.test(value)) {
            fieldErrors.push("Mã danh mục chỉ được chứa một chữ số")
          }
          break
        case "taxCode":
          if (!value || String(value).trim() === "") {
            fieldErrors.push("Mã số thuế là bắt buộc")
          } else if (!/^[0-9]{10}$/.test(value)) {
            fieldErrors.push("Mã số thuế phải là 10 chữ số")
          } else {
            // Check duplicate
            const duplicateItem = existingData.find((item) => item.taxCode === value && item.id !== formData.id)
            if (duplicateItem) {
              fieldErrors.push(`Mã số thuế "${value}" đã tồn tại trong hệ thống`)
            }
          }
          break
        case "email":
          if (value && String(value).trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(String(value).trim())) {
              fieldErrors.push("Email không đúng định dạng")
            }
          }
          if (value && String(value).length > 255) {
            fieldErrors.push("Email không được vượt quá 255 ký tự")
          }
          break
        case "tel":
          if (value && String(value).trim() !== "") {
            const phoneRegex = /^[0-9+\-\s()]+$/
            if (!phoneRegex.test(String(value).trim())) {
              fieldErrors.push("Số điện thoại không hợp lệ")
            }
          }
          if (value && String(value).length > 20) {
            fieldErrors.push("Số điện thoại không được vượt quá 20 ký tự")
          }
          break
        case "address":
          if (!value || String(value).trim() === "") {
            fieldErrors.push("Địa chỉ là bắt buộc")
          } else if (String(value).length > 500) {
            fieldErrors.push("Địa chỉ không được vượt quá 500 ký tự")
          }
          break
        case "notes":
          if (value && String(value).length > 500) {
            fieldErrors.push("Ghi chú không được vượt quá 500 ký tự")
          }
          break
      }

      return fieldErrors
    },
    [existingData, formData.id],
  )

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string[] } = {}
    let hasErrors = false

    const fields = ["nameVi", "nameEn", "nameKo", "customerType", "categoryCode", "taxCode", "email", "tel", "address", "notes"]
    fields.forEach((field) => {
      const fieldErrors = validateField(field, formData[field])
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors
        hasErrors = true
      }
    })

    setErrors(newErrors)
    return !hasErrors
  }, [formData, validateField])

  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
      if (touched[fieldName]) {
        const fieldErrors = validateField(fieldName, value)
        setErrors((prev) => ({
          ...prev,
          [fieldName]: fieldErrors,
        }))
      }
    },
    [touched, validateField],
  )

  const handleFieldBlur = useCallback(
    (fieldName: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }))
      const fieldErrors = validateField(fieldName, formData[fieldName])
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldErrors,
      }))
    },
    [formData, validateField],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Mark all fields as touched
      const allTouched: { [key: string]: boolean } = {}
      const fields = ["nameVi", "nameEn", "nameKo", "customerType", "categoryCode", "taxCode", "email", "tel", "address", "notes"]
      fields.forEach((field) => {
        allTouched[field] = true
      })
      setTouched(allTouched)

      if (!validateForm()) {
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(formData)
        onClose()
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, validateForm, onSubmit, onClose],
  )

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose()
    }
  }, [isSubmitting, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === "add" ? "Thêm khách hàng mới" : "Chỉnh sửa thông tin khách hàng"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "add" ? "Thêm mới thông tin khách hàng vào hệ thống" : "Cập nhật thông tin khách hàng"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-6 p-6 flex-1 min-h-0 overflow-y-auto">
            {/* Thông tin cơ bản */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-blue-900 mb-4">Thông tin cơ bản</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên tiếng Việt */}
                <div className="space-y-2">
                  <label htmlFor="nameVi" className="block text-sm font-medium text-gray-700">
                    Tên khách hàng (Tiếng Việt) <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="nameVi"
                    name="nameVi"
                    type="text"
                    value={formData.nameVi || ""}
                    onChange={(e) => handleFieldChange("nameVi", e.target.value)}
                    onBlur={() => handleFieldBlur("nameVi")}
                    placeholder="Nhập tên tiếng Việt"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.nameVi?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.nameVi?.length > 0 && (
                    <div className="space-y-1">
                      {errors.nameVi.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tên tiếng Anh */}
                <div className="space-y-2">
                  <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">
                    Tên khách hàng (Tiếng Anh)
                  </label>
                  <input
                    id="nameEn"
                    name="nameEn"
                    type="text"
                    value={formData.nameEn || ""}
                    onChange={(e) => handleFieldChange("nameEn", e.target.value)}
                    onBlur={() => handleFieldBlur("nameEn")}
                    placeholder="Nhập tên tiếng Anh"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.nameEn?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.nameEn?.length > 0 && (
                    <div className="space-y-1">
                      {errors.nameEn.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tên tiếng Hàn */}
                <div className="space-y-2">
                  <label htmlFor="nameKo" className="block text-sm font-medium text-gray-700">
                    Tên khách hàng (Tiếng Hàn)
                  </label>
                  <input
                    id="nameKo"
                    name="nameKo"
                    type="text"
                    value={formData.nameKo || ""}
                    onChange={(e) => handleFieldChange("nameKo", e.target.value)}
                    onBlur={() => handleFieldBlur("nameKo")}
                    placeholder="Nhập tên tiếng Hàn"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.nameKo?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.nameKo?.length > 0 && (
                    <div className="space-y-1">
                      {errors.nameKo.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tên người mua */}
                <div className="space-y-2">
                  <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700">
                    Tên người mua
                  </label>
                  <input
                    id="buyerName"
                    name="buyerName"
                    type="text"
                    value={formData.buyerName || ""}
                    onChange={(e) => handleFieldChange("buyerName", e.target.value)}
                    onBlur={() => handleFieldBlur("buyerName")}
                    placeholder="Nhập tên người mua"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin phân loại */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-green-900 mb-4">Thông tin phân loại</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Loại khách hàng */}
                <div className="space-y-2">
                  <label htmlFor="customerType" className="block text-sm font-medium text-gray-700">
                    Loại khách hàng <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="customerType"
                    name="customerType"
                    type="text"
                    value={formData.customerType || ""}
                    onChange={(e) => handleFieldChange("customerType", e.target.value)}
                    onBlur={() => handleFieldBlur("customerType")}
                    placeholder="1 (Nội địa), 2 (Nước ngoài)"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.customerType?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  <div className="flex items-start space-x-2 text-xs text-gray-600">
                    <Info size={12} className="mt-0.5 flex-shrink-0" />
                    <span>Loại khách hàng chỉ được chứa một chữ số (ví dụ: 1 hoặc 2)</span>
                  </div>
                  {errors.customerType?.length > 0 && (
                    <div className="space-y-1">
                      {errors.customerType.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mã danh mục */}
                <div className="space-y-2">
                  <label htmlFor="categoryCode" className="block text-sm font-medium text-gray-700">
                    Mã danh mục <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="categoryCode"
                    name="categoryCode"
                    type="text"
                    value={formData.categoryCode || ""}
                    onChange={(e) => handleFieldChange("categoryCode", e.target.value)}
                    onBlur={() => handleFieldBlur("categoryCode")}
                    placeholder="Mã danh mục khách hàng"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.categoryCode?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  <div className="flex items-start space-x-2 text-xs text-gray-600">
                    <Info size={12} className="mt-0.5 flex-shrink-0" />
                    <span>Mã danh mục chỉ được chứa một chữ số</span>
                  </div>
                  {errors.categoryCode?.length > 0 && (
                    <div className="space-y-1">
                      {errors.categoryCode.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mã người dùng KH */}
                <div className="space-y-2">
                  <label htmlFor="customerUserCode" className="block text-sm font-medium text-gray-700">
                    Mã người dùng KH
                  </label>
                  <input
                    id="customerUserCode"
                    name="customerUserCode"
                    type="text"
                    value={formData.customerUserCode || ""}
                    onChange={(e) => handleFieldChange("customerUserCode", e.target.value)}
                    onBlur={() => handleFieldBlur("customerUserCode")}
                    placeholder="Mã người dùng khách hàng"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin thuế và liên hệ */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-amber-900 mb-4">Thông tin thuế và liên hệ</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mã số thuế */}
                <div className="space-y-2">
                  <label htmlFor="taxCode" className="block text-sm font-medium text-gray-700">
                    Mã số thuế <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="taxCode"
                    name="taxCode"
                    type="text"
                    value={formData.taxCode || ""}
                    onChange={(e) => handleFieldChange("taxCode", e.target.value)}
                    onBlur={() => handleFieldBlur("taxCode")}
                    placeholder="Nhập mã số thuế (10 chữ số)"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.taxCode?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  <div className="flex items-start space-x-2 text-xs text-gray-600">
                    <Info size={12} className="mt-0.5 flex-shrink-0" />
                    <span>Mã số thuế phải là 10 chữ số</span>
                  </div>
                  {errors.taxCode?.length > 0 && (
                    <div className="space-y-1">
                      {errors.taxCode.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    placeholder="Nhập địa chỉ email"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.email?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.email?.length > 0 && (
                    <div className="space-y-1">
                      {errors.email.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <label htmlFor="tel" className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    id="tel"
                    name="tel"
                    type="tel"
                    value={formData.tel || ""}
                    onChange={(e) => handleFieldChange("tel", e.target.value)}
                    onBlur={() => handleFieldBlur("tel")}
                    placeholder="Nhập số điện thoại"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.tel?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.tel?.length > 0 && (
                    <div className="space-y-1">
                      {errors.tel.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fax */}
                <div className="space-y-2">
                  <label htmlFor="fax" className="block text-sm font-medium text-gray-700">
                    Fax
                  </label>
                  <input
                    id="fax"
                    name="fax"
                    type="text"
                    value={formData.fax || ""}
                    onChange={(e) => handleFieldChange("fax", e.target.value)}
                    onBlur={() => handleFieldBlur("fax")}
                    placeholder="Nhập số Fax"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin kinh doanh */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-purple-900 mb-4">Thông tin kinh doanh</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên chủ sở hữu */}
                <div className="space-y-2">
                  <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                    Tên chủ sở hữu
                  </label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    value={formData.ownerName || ""}
                    onChange={(e) => handleFieldChange("ownerName", e.target.value)}
                    onBlur={() => handleFieldBlur("ownerName")}
                    placeholder="Nhập tên chủ sở hữu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Loại hình kinh doanh */}
                <div className="space-y-2">
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                    Loại hình kinh doanh
                  </label>
                  <input
                    id="businessType"
                    name="businessType"
                    type="text"
                    value={formData.businessType || ""}
                    onChange={(e) => handleFieldChange("businessType", e.target.value)}
                    onBlur={() => handleFieldBlur("businessType")}
                    placeholder="Nhập loại hình kinh doanh"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Ngành nghề kinh doanh */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="kindBusiness" className="block text-sm font-medium text-gray-700">
                    Ngành nghề kinh doanh
                  </label>
                  <input
                    id="kindBusiness"
                    name="kindBusiness"
                    type="text"
                    value={formData.kindBusiness || ""}
                    onChange={(e) => handleFieldChange("kindBusiness", e.target.value)}
                    onBlur={() => handleFieldBlur("kindBusiness")}
                    placeholder="Nhập ngành nghề kinh doanh"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Thông tin địa chỉ</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Mã bưu chính */}
                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    Mã bưu chính
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode || ""}
                    onChange={(e) => handleFieldChange("zipCode", e.target.value)}
                    onBlur={() => handleFieldBlur("zipCode")}
                    placeholder="Nhập mã bưu chính"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Địa chỉ */}
                <div className="space-y-2 md:col-span-3">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Địa chỉ <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    onBlur={() => handleFieldBlur("address")}
                    placeholder="Nhập địa chỉ"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.address?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.address?.length > 0 && (
                    <div className="space-y-1">
                      {errors.address.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Ghi chú
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                onBlur={() => handleFieldBlur("notes")}
                placeholder="Nhập ghi chú (tùy chọn)"
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.notes?.length ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.notes?.length > 0 && (
                <div className="space-y-1">
                  {errors.notes.map((error, index) => (
                    <div key={index} className="flex items-start space-x-2 text-xs text-red-600">
                      <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Lưu</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}