# Amnote Accounting Software - Custom Instructions

- **Luôn tuân thủ file detail design**: Mọi code, giao diện và logic phải bám sát mô tả chi tiết đã được duyệt trong tài liệu detail design.

- **Luôn phản hồi bằng tiếng Việt**: Copilot chỉ trả lời và sinh mã ví dụ bằng tiếng Việt để tối ưu cho đội dự án.

- **Tránh code làm sai hoặc phá vỡ design**: Không sinh mã thay đổi cấu trúc UI/UX so với thiết kế gốc, không sử dụng mã tắt, code nhanh làm mất bố cục hoặc logic đặc thù của giao diện.
Các input khi hover là border màu xanh dương, khi lỗi là border màu đỏ

- **Cấu trúc trang chuẩn hóa**: Mỗi module/trang bắt buộc có đủ chức năng:
  - Thêm mới (Create)
  - Sửa (Update)
  - Xóa (Delete)
  - In ấn (Print)
  - Nhập, xuất Excel (Import/Export)
  - Khác nhau ở link API và các trường dữ liệu, layout giữ nguyên mẫu.

- **Sao chép trang mới**: Khi tạo trang mới, chỉ cần copy các file cấu trúc cũ; điều chỉnh link API, fields và logic nghiệp vụ dựa trên detail design, không dựng từ đầu.

- **Sử dụng Tailwind CSS**: Mọi thành phần giao diện mới đều phải áp dụng Tailwind CSS. Không sử dụng CSS hoặc thư viện ngoài khác cho phần giao diện.

- **Luôn đảm bảo phát triển các màn hình nhập excel, xác thực dữ liệu và giao diện thân thiện với người dùng. Xuất excel phải đồng bộ tiêu chuẩn.**

- **Các thao tác liên quan tới quản lý dữ liệu (reload, filter, cài đặt cột...) phải đồng bộ trải nghiệm, sao chép logic từ các trang dữ liệu đã tồn tại.**