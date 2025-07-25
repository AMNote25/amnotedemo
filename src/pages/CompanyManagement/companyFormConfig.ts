import type { FormConfig, DeleteConfig } from "@/types/form"

export const companyFormConfig: FormConfig = {
  title: "Công ty/Doanh nghiệp",
  description: "Thêm hoặc chỉnh sửa thông tin công ty/doanh nghiệp",
  fields: [
    {
      id: "name",
      name: "name",
      label: "Tên công ty",
      type: "text",
      required: true,
      placeholder: "Nhập tên công ty",
      validation: { maxLength: 255 },
    },
    {
      id: "address",
      name: "address",
      label: "Địa chỉ",
      type: "text",
      required: true,
      placeholder: "Nhập địa chỉ",
      validation: { maxLength: 255 },
    },
    {
      id: "taxCode",
      name: "taxCode",
      label: "Mã số thuế",
      type: "text",
      required: true,
      placeholder: "Nhập mã số thuế",
      validation: { pattern: "^\\d{10}$", maxLength: 10 },
      description: "Mã số thuế phải có 10 chữ số",
    },
    {
      id: "province",
      name: "province",
      label: "Tỉnh/Thành phố",
      type: "select",
      required: true,
      options: [
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
      ],
      placeholder: "Chọn tỉnh/thành phố",
    },
    {
      id: "taxOfficeCode",
      name: "taxOfficeCode",
      label: "Mã cơ quan thuế",
      type: "text",
      required: false,
      placeholder: "Nhập mã CQ thuế",
      validation: { maxLength: 20 },
    },
    {
      id: "phone",
      name: "phone",
      label: "Số điện thoại",
      type: "text",
      required: false,
      placeholder: "Nhập số điện thoại",
      validation: { maxLength: 20 },
    },
    {
      id: "email",
      name: "email",
      label: "Email",
      type: "text",
      required: false,
      placeholder: "Nhập email",
      validation: { maxLength: 100 },
    },
    {
      id: "industry",
      name: "industry",
      label: "Ngành nghề",
      type: "select",
      required: false,
      options: [
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
      ],
      placeholder: "Chọn ngành nghề",
    },
  ],
}

export const companyDeleteConfig: DeleteConfig = {
  title: "Xóa công ty",
  confirmText: "Xóa",
  cancelText: "Hủy",
}

export const companyBulkDeleteConfig: DeleteConfig = {
  title: "Xóa nhiều công ty",
  confirmText: "Xóa tất cả",
  cancelText: "Hủy",
}
