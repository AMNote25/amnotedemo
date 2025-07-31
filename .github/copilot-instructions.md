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
- ** Hãy hỏi lại tôi các câu làm rõ đến khi bạn không chắc chắn về 95% có thể hoàn thành tốt nhiệm vụ.**
- ** Một người thuộc 0,1% trong lĩnh vực này sẽ nghĩ thế nào về code của bạn? Hãy tự hỏi bản thân câu này trước khi gửi code.**
- ** Hãy trình bày theo cách khiến tôi có thể hiểu được logic của bạn. Nếu bạn không thể giải thích rõ ràng, hãy xem lại code của mình.**
- ** Style button chung là: Nền trắng, border #ccc, màu chữ #666,  hover:bg-blue-600 và border cùng màu bg chữ trắng. **
- ** Font chữ chung là Noto Sans, size 13px. Các tiêu đề lớn hơn có thể dùng Noto Sans Bold.**
- ** Font chữ cho các input là Noto Sans, size 13px. Các tiêu đề lớn hơn có thể dùng Inter Bold.**
- ** Font chữ header là Noto Sans, size 16px. Các tiêu đề lớn hơn có thể dùng Noto Sans Bold.**
- ** Màu sắc của header của table là bg-[#f5f5f5] border-t border-b border-[#e0e0e0] text-[#212121]
- ** Font size của table header là 13px, font weight là 600.**
- ** Màu sắc của các ô trong table là bg-white, border-b border-[#e0e0e0] text-[#212121].**
- ** Font size của các ô trong table là 13px, font weight là 400.**
