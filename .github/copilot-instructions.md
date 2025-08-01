# 📌 Amnote Accounting Software – Custom Copilot Instructions

## 🎯 Nguyên tắc chung
- ✅ **Luôn tuân thủ tài liệu Detail Design**: Mọi code, giao diện, logic nghiệp vụ **phải bám sát 100% mô tả trong tài liệu thiết kế chi tiết** đã được duyệt.
- ✅ **Tất cả phản hồi, code ví dụ, ghi chú phải bằng tiếng Việt** để đồng bộ với đội dự án.
- ✅ **Không được viết code phá vỡ UI/UX gốc**:  
  - Không tự ý đổi layout, bỏ qua các logic đặc thù.  
  - Không dùng code tắt/shortcut làm mất cấu trúc hoặc giảm tính chuẩn hóa của dự án.  

---

## 🖥️ Cấu trúc trang & chức năng bắt buộc
Mỗi module/trang phải có đầy đủ:
- ➕ **Thêm mới (Create)**  
- ✏️ **Sửa (Update)**  
- ❌ **Xóa (Delete)**  
- 🖨️ **In ấn (Print)**  
- ⬆️⬇️ **Nhập/Xuất Excel (Import/Export)**  
- 🔄 **Reload, filter, cài đặt cột** theo trải nghiệm đã chuẩn hóa từ các trang dữ liệu khác.

📌 **Khi tạo trang mới:**  
- **Copy cấu trúc từ trang mẫu** → chỉnh API, fields và logic theo detail design.  
- **Không dựng UI từ đầu** để tránh lệch chuẩn.

---

## 🎨 Quy định UI/UX
### 🔹 Input:
- Font: `Noto Sans`, size `13px`.
- Hover: `border-blue-500`.
- Lỗi: `border-red-500`.

### 🔹 Button:
- Style mặc định:  
  - Nền: trắng  
  - Border: `#ccc`  
  - Màu chữ: `#666`  
  - Hover: `bg-blue-600`, `border-blue-600`, chữ trắng  
- Font: `Noto Sans`, size `13px`.

### 🔹 Header:
- Font: `Noto Sans`, size `16px` (hoặc `Noto Sans Bold` cho tiêu đề lớn).

### 🔹 Table:
- Header:  
  - BG: `#f5f5f5`  
  - Border: `#e0e0e0`  
  - Text: `#212121`  
  - Font size: `13px`, weight `600`.
- Cell:  
  - BG: `white`  
  - Border bottom: `#e0e0e0`  
  - Text: `#212121`  
  - Font size: `13px`, weight `400`.

---
Icon: Sử dụng thư viện: lucide-react cho toàn bộ icon. Style icon: Thêm class w-4 h-4 cho tất cả các icon để đảm bảo kích thước đồng nhất, tránh icon quá to hoặc quá nhỏ. Không sử dụng icon ngoài hoặc SVG tự tạo.

## 🛠️ Code & Dev Rules
- **Sử dụng Tailwind CSS** cho tất cả giao diện. **Không dùng CSS thuần hoặc thư viện ngoài.**
- API endpoint **phải lấy từ file config chung**. Không hard-code trong component.
- Code phải **có comment giải thích logic** nếu phức tạp.
- Trước khi commit:
  - 🧪 Viết test case cho CRUD + Import/Export.
  - ✅ Tự kiểm tra: *"Một người thuộc 0.1% giỏi nhất ngành sẽ nghĩ gì về code này?"*
- Tất cả các chức năng Excel (nhập/xuất) **phải đồng bộ tiêu chuẩn và có xác thực dữ liệu thân thiện với người dùng.**

---

## 🌐 Responsive
- Bắt buộc hỗ trợ **desktop + tablet** theo layout chuẩn dự án.  
- Ưu tiên **grid + flex Tailwind** để đảm bảo thích ứng.  

---

## 🔄 Quy trình Git & Review
- **Branching theo Git Flow:**  
  - `feature/*` → `develop` → `release/*` → `main`.  
- **Không commit trực tiếp vào main**.  
- Mọi merge phải qua **ít nhất 1 lần code review**.

---

## ✅ Checklist trước khi bàn giao module
- [ ] Bám sát detail design 100%.  
- [ ] UI/UX theo đúng guideline (font, màu sắc, hover, lỗi).  
- [ ] Có đủ CRUD + Print + Import/Export.  
- [ ] API dùng config chung.  
- [ ] Test case CRUD + Excel đầy đủ.  
- [ ] Responsive đúng chuẩn.  
- [ ] Code qua review trước merge.  

---

📌 **Note:** Nếu có bất kỳ điểm nào chưa rõ > 5%, **phải hỏi lại trước khi code**. Luôn đảm bảo có thể giải thích logic một cách rõ ràng. Nếu không giải thích được, **xem lại code trước khi gửi.**
