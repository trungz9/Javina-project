import dotenv from 'dotenv'
dotenv.config()

import db from './config/db.js'
import bcrypt from 'bcryptjs'

const users = [
  { username: 'annguyen', email: 'an@test.com' },
  { username: 'binhle', email: 'binh@test.com' },
  { username: 'camtran', email: 'cam@test.com' },
  { username: 'dungpham', email: 'dung@test.com' },
  { username: 'emilyvu', email: 'emily@test.com' },
  { username: 'fongdo', email: 'fong@test.com' },
  { username: 'gianghoang', email: 'giang@test.com' },
  { username: 'hanhdinh', email: 'hanh@test.com' },
  { username: 'ivanphan', email: 'ivan@test.com' },
  { username: 'jynguyen', email: 'jy@test.com' },
]

// ✅ dùng slug thay vì id
const products = [
  // 📚 SÁCH
  { name: 'Sách Giải Tích 1', category_slug: 'sach-tai-lieu', price: 45000,
    description: 'giáo trình giải tích toán học sinh viên đại học giới hạn đạo hàm tích phân bài tập lời giải' },
  { name: 'Sách Đại Số Tuyến Tính', category_slug: 'sach-tai-lieu', price: 50000,
    description: 'đại số tuyến tính ma trận định thức không gian vectơ ánh xạ tuyến tính sinh viên toán học' },
  { name: 'Giáo Trình Lập Trình C++', category_slug: 'sach-tai-lieu', price: 60000,
    description: 'lập trình c++ cơ bản nâng cao con trỏ hàm lớp kế thừa template sinh viên công nghệ thông tin' },
  { name: 'Sách Cấu Trúc Dữ Liệu & Giải Thuật', category_slug: 'sach-tai-lieu', price: 55000,
    description: 'cấu trúc dữ liệu giải thuật stack queue tree graph sort search sinh viên lập trình' },
  { name: 'Sách Tiếng Nhật N5 Minna', category_slug: 'sach-tai-lieu', price: 80000,
    description: 'tiếng nhật n5 minna no nihongo giáo trình hiragana katakana kanji từ vựng ngữ pháp học ngoại ngữ' },
  { name: 'Sách IELTS Cambridge 17', category_slug: 'sach-tai-lieu', price: 120000,
    description: 'luyện thi ielts cambridge reading writing listening speaking bài tập đề thi thật band điểm tiếng anh' },
  { name: 'Sách Lập Trình Python Cơ Bản', category_slug: 'sach-tai-lieu', price: 75000,
    description: 'lập trình python cơ bản nâng cao cú pháp vòng lặp hàm lớp đối tượng sinh viên công nghệ thông tin' },
  { name: 'Sách Đắc Nhân Tâm', category_slug: 'sach-tai-lieu', price: 65000,
    description: 'kỹ năng mềm giao tiếp tâm lý con người thành công cuộc sống phát triển bản thân đọc hay' },
  { name: 'Giáo Trình Xác Suất Thống Kê', category_slug: 'sach-tai-lieu', price: 45000,
    description: 'xác suất thống kê phân phối biến ngẫu nhiên kiểm định giả thuyết hồi quy sinh viên toán kỹ thuật' },
  { name: 'Giáo Trình Cơ Sở Dữ Liệu', category_slug: 'sach-tai-lieu', price: 52000,
    description: 'cơ sở dữ liệu sql mysql thiết kế bảng truy vấn quan hệ chuẩn hóa sinh viên công nghệ thông tin' },
  { name: 'Sách Harry Potter Tập 1', category_slug: 'sach-tai-lieu', price: 90000,
    description: 'tiểu thuyết harry potter phù thủy phiêu lưu trường hogwarts voldemort đọc giải trí văn học' },
  { name: 'Giáo Trình Vật Lý Đại Cương', category_slug: 'sach-tai-lieu', price: 48000,
    description: 'vật lý đại cương cơ học nhiệt học điện từ học quang học lượng tử sinh viên kỹ thuật' },
  { name: 'Giáo Trình Kinh Tế Vi Mô', category_slug: 'sach-tai-lieu', price: 42000,
    description: 'kinh tế vi mô cung cầu thị trường giá cả sản xuất tiêu dùng sinh viên kinh tế quản trị' },
  { name: 'Sách Triết Học Mác-Lênin', category_slug: 'sach-tai-lieu', price: 35000,
    description: 'triết học mác lênin chủ nghĩa duy vật biện chứng lịch sử sinh viên đại học đại cương' },
  { name: 'Giáo Trình Mạng Máy Tính', category_slug: 'sach-tai-lieu', price: 48000,
    description: 'mạng máy tính tcp ip giao thức định tuyến bảo mật wifi internet sinh viên công nghệ thông tin' },

  // 💻 ĐIỆN TỬ
  { name: 'Laptop Dell Inspiron 15 cũ', category_slug: 'do-dien-tu', price: 7500000,
    description: 'laptop dell inspiron intel core i5 ram 8gb ssd 256gb pin màn hình 15 inch học tập lập trình văn phòng' },
  { name: 'Laptop Asus VivoBook 14 cũ', category_slug: 'do-dien-tu', price: 6800000,
    description: 'laptop asus vivobook 14 inch amd ryzen ram 8gb ssd 512gb pin lâu mỏng nhẹ học tập sinh viên' },
  { name: 'MacBook Air M1 2020 cũ', category_slug: 'do-dien-tu', price: 18000000,
    description: 'macbook air m1 chip apple silicon ram 8gb ssd 256gb pin 18 tiếng mỏng nhẹ lập trình thiết kế' },
  { name: 'Tai nghe Sony WH-1000XM4', category_slug: 'do-dien-tu', price: 3500000,
    description: 'tai nghe chống ồn sony bluetooth pin 30 tiếng âm thanh bass treble đệm tai mềm nghe nhạc học bài' },
  { name: 'Tai nghe JBL Tune 510BT', category_slug: 'do-dien-tu', price: 800000,
    description: 'tai nghe bluetooth jbl tune pin 40 tiếng âm thanh bass kết nối không dây học bài nghe nhạc' },
  { name: 'Airpods Pro 2 like new', category_slug: 'do-dien-tu', price: 4200000,
    description: 'tai nghe airpods pro 2 apple chống ồn bluetooth kết nối iphone ipad pin sạc không dây' },
  { name: 'iPhone 13 128GB cũ', category_slug: 'do-dien-tu', price: 12000000,
    description: 'điện thoại iphone 13 apple 128gb camera chip a15 màn hình pin sạc nhanh kết nối 5g wifi' },
  { name: 'Samsung Galaxy A54 cũ', category_slug: 'do-dien-tu', price: 6500000,
    description: 'điện thoại samsung galaxy a54 màn hình amoled camera pin 5000mah sạc nhanh kết nối 5g' },
  { name: 'Bàn phím cơ Keychron K2', category_slug: 'do-dien-tu', price: 1800000,
    description: 'bàn phím cơ keychron switch bluetooth usb gõ phím lập trình văn phòng gaming đèn led rgb' },
  { name: 'Chuột Logitech MX Master 3', category_slug: 'do-dien-tu', price: 1500000,
    description: 'chuột không dây logitech mx master ergonomic pin sạc bluetooth usb thiết kế văn phòng lập trình' },
  { name: 'Màn hình LG 24 inch Full HD', category_slug: 'do-dien-tu', price: 2800000,
    description: 'màn hình máy tính lg 24 inch full hd 1080p hdmi displayport độ sáng thiết kế lập trình văn phòng' },
  { name: 'iPad Gen 9 64GB cũ', category_slug: 'do-dien-tu', price: 7200000,
    description: 'ipad gen 9 apple 64gb wifi màn hình retina pin chip a13 học online vẽ đọc sách giải trí' },
  { name: 'Sạc dự phòng Anker 20000mAh', category_slug: 'do-dien-tu', price: 450000,
    description: 'sạc dự phòng anker 20000mah sạc nhanh usb c cổng kép nhỏ gọn du lịch học tập đi xa' },
  { name: 'Ổ cứng SSD 256GB Samsung', category_slug: 'do-dien-tu', price: 700000,
    description: 'ổ cứng ssd samsung 256gb sata tốc độ đọc ghi nhanh nâng cấp laptop máy tính lưu trữ dữ liệu' },
  { name: 'Webcam Logitech C920 cũ', category_slug: 'do-dien-tu', price: 900000,
    description: 'webcam logitech c920 full hd 1080p học online họp zoom chất lượng hình ảnh tốt micro tích hợp' },

  // 👕 THỜI TRANG
  { name: 'Áo thun trắng basic unisex', category_slug: 'thoi-trang', price: 80000,
    description: 'áo thun cotton trắng basic form regular unisex nam nữ mặc học đi chơi thoáng mát thấm mồ hôi' },
  { name: 'Áo hoodie xám oversize', category_slug: 'thoi-trang', price: 180000,
    description: 'áo hoodie nỉ bông dày màu xám form oversize unisex túi kangaroo dây rút mũ mặc học mùa lạnh' },
  { name: 'Quần jean xanh slim fit', category_slug: 'thoi-trang', price: 220000,
    description: 'quần jean denim xanh form slim fit co giãn thoải mái mặc học đi làm size vải bền màu đẹp' },
  { name: 'Áo khoác dù 2 lớp', category_slug: 'thoi-trang', price: 250000,
    description: 'áo khoác dù 2 lớp chống gió chống nước nhẹ có mũ kéo khóa mặc học đi chơi mùa mưa' },
  { name: 'Váy hoa dáng midi', category_slug: 'thoi-trang', price: 150000,
    description: 'váy hoa dáng midi vải voan nhẹ form xòe eo chun màu pastel mặc học đi chơi nữ tính dễ thương' },
  { name: 'Giày Converse Chuck Taylor cũ', category_slug: 'thoi-trang', price: 350000,
    description: 'giày converse chuck taylor cổ cao vải canvas đế cao su size nam nữ đi học đi chơi bền đẹp' },
  { name: 'Giày Adidas Ultraboost cũ', category_slug: 'thoi-trang', price: 800000,
    description: 'giày adidas ultraboost đế boost êm chân chạy bộ thể thao size nam nữ lưới thoáng khí' },
  { name: 'Túi tote vải canvas', category_slug: 'thoi-trang', price: 120000,
    description: 'túi tote vải canvas dày quai dài đựng sách vở laptop đi học đi chợ bền nhẹ nhiều màu' },
  { name: 'Balo laptop Samsonite cũ', category_slug: 'thoi-trang', price: 450000,
    description: 'balo samsonite đựng laptop 15 inch ngăn chính phụ dây đeo êm chống nước đi học đi làm' },
  { name: 'Mũ bucket màu be', category_slug: 'thoi-trang', price: 90000,
    description: 'mũ bucket vải cotton màu be chống nắng unisex nam nữ đội học đi chơi dạo phố thời trang' },
  { name: 'Áo sơ mi kẻ caro', category_slug: 'thoi-trang', price: 160000,
    description: 'áo sơ mi kẻ caro vải cotton form regular tay dài cúc cổ đi học đi làm lịch sự nam nữ' },
  { name: 'Quần short thể thao Nike', category_slug: 'thoi-trang', price: 130000,
    description: 'quần short thể thao nike vải thun co giãn thoáng khí thấm mồ hôi chạy bộ gym tập luyện' },
  { name: 'Áo len cổ lọ màu nâu', category_slug: 'thoi-trang', price: 200000,
    description: 'áo len cổ lọ màu nâu dày dặn ấm áp mùa đông unisex nam nữ mặc học đi chơi phong cách' },
  { name: 'Giày lười da đen', category_slug: 'thoi-trang', price: 280000,
    description: 'giày lười da đen đế bằng không cần buộc dây đi học đi làm lịch sự bền đẹp nam nữ' },
  { name: 'Dép tông Nike chính hãng', category_slug: 'thoi-trang', price: 200000,
    description: 'dép tông nike quai ngang đế xốp êm chân đi học đi chơi ở nhà chống trơn trượt nam nữ' },

  // 🍜 ĐỒ ĂN
  { name: 'Bánh tráng trộn handmade', category_slug: 'do-an-thuc-uong', price: 25000,
    description: 'bánh tráng trộn handmade tự làm nhà sạch sa tế trứng cút khô bò cay thơm ngon giao trường' },
  { name: 'Trà sữa trân châu đường đen', category_slug: 'do-an-thuc-uong', price: 35000,
    description: 'trà sữa trân châu đường đen thơm ngon tự pha handmade ly lớn đá ít ngọt giao khu trường đại học' },
  { name: 'Hộp cookies bơ homemade', category_slug: 'do-an-thuc-uong', price: 55000,
    description: 'bánh cookies bơ homemade nướng tươi bơ đường trứng hộp 10 cái thơm giòn ngon quà tặng' },
  { name: 'Cơm hộp văn phòng', category_slug: 'do-an-thuc-uong', price: 30000,
    description: 'cơm hộp nấu tươi ngày cơm trắng thịt kho rau xào canh giao trưa chiều khu vực trường học' },
  { name: 'Chè khúc bạch', category_slug: 'do-an-thuc-uong', price: 25000,
    description: 'chè khúc bạch thạch hạnh nhân nước cốt dừa đường thơm ngon mát lạnh tráng miệng handmade' },
  { name: 'Gà nướng muối ớt', category_slug: 'do-an-thuc-uong', price: 45000,
    description: 'gà nướng muối ớt tươi ngon ướp gia vị nướng than thơm cay đặt trước giao khu vực trường' },
  { name: 'Bánh flan caramel homemade', category_slug: 'do-an-thuc-uong', price: 20000,
    description: 'bánh flan caramel homemade tự làm trứng sữa đường caramel mềm mịn thơm ngon tráng miệng' },
  { name: 'Nước ép cam tươi 500ml', category_slug: 'do-an-thuc-uong', price: 20000,
    description: 'nước ép cam tươi 500ml ép tươi nguyên chất không đường không phẩm màu vitamin c bổ dưỡng' },
  { name: 'Xôi mặn gà', category_slug: 'do-an-thuc-uong', price: 25000,
    description: 'xôi mặn gà nếp dẻo thịt gà xé hành phi nước mắm ăn sáng ăn trưa giao khu trường học' },
  { name: 'Tokbokki tự làm', category_slug: 'do-an-thuc-uong', price: 30000,
    description: 'tokbokki bánh gạo hàn quốc tự làm sốt cay ngọt chả cá rau củ nấu tươi ăn liền đặt trước' },
  { name: 'Bánh tráng nướng phô mai', category_slug: 'do-an-thuc-uong', price: 20000,
    description: 'bánh tráng nướng phô mai trứng hành sa tế nướng than thơm giòn ăn vặt giao khu trường học' },
  { name: 'Bánh mì que phô mai', category_slug: 'do-an-thuc-uong', price: 15000,
    description: 'bánh mì que phô mai nướng giòn bơ tươi phô mai béo thơm ăn sáng ăn vặt giao khu trường' },
  { name: 'Bánh cupcake sinh nhật', category_slug: 'do-an-thuc-uong', price: 35000,
    description: 'bánh cupcake sinh nhật tự làm kem bơ trang trí đẹp nhiều màu đặt trước giao tận nơi quà tặng' },
  { name: 'Hủ tiếu khô handmade', category_slug: 'do-an-thuc-uong', price: 35000,
    description: 'hủ tiếu khô handmade sợi tươi thịt bằm tôm hành phi tương đen ăn sáng trưa ngon đặc biệt' },
  { name: 'Cà phê sữa đá mang về', category_slug: 'do-an-thuc-uong', price: 20000,
    description: 'cà phê sữa đá pha phin đậm đà thơm ngon mang về ly lớn đá nhiều giao khu vực trường học' },

  // 📐 HỌC TẬP
  { name: 'Bộ dụng cụ vẽ kỹ thuật', category_slug: 'dung-cu-hoc-tap', price: 85000,
    description: 'bộ dụng cụ vẽ kỹ thuật compa thước ê ke thước đo độ bút chì sinh viên kiến trúc xây dựng' },
  { name: 'Máy tính Casio FX-580VN cũ', category_slug: 'dung-cu-hoc-tap', price: 200000,
    description: 'máy tính khoa học casio fx 580 tích phân đạo hàm ma trận phương trình pin mới thi đại học' },
  { name: 'Bảng vẽ điện tử Wacom cũ', category_slug: 'dung-cu-hoc-tap', price: 1200000,
    description: 'bảng vẽ điện tử wacom bút cảm ứng thiết kế đồ họa vẽ kỹ thuật số usb driver học thiết kế' },
  { name: 'Bộ màu nước 24 màu Winsor', category_slug: 'dung-cu-hoc-tap', price: 180000,
    description: 'màu nước winsor newton 24 màu hộp thiếc vẽ tranh pha màu sinh viên mỹ thuật thiết kế nghệ thuật' },
  { name: 'Tập vở 200 trang lốc 10 cuốn', category_slug: 'dung-cu-hoc-tap', price: 45000,
    description: 'tập vở 200 trang lốc 10 cuốn giấy trắng dày mực không lem bìa cứng ghi chép học bài sinh viên' },
  { name: 'Bút máy Pilot Kakuno', category_slug: 'dung-cu-hoc-tap', price: 95000,
    description: 'bút máy pilot kakuno ngòi f m viết mực chảy đều luyện chữ đẹp học sinh sinh viên nhật bản' },
  { name: 'Flashcard tiếng Anh 1000 từ', category_slug: 'dung-cu-hoc-tap', price: 60000,
    description: 'flashcard tiếng anh 1000 từ vựng thông dụng học ngoại ngữ ielts toeic luyện thi bìa cứng' },
  { name: 'Bộ highlight Mildliner 10 màu', category_slug: 'dung-cu-hoc-tap', price: 120000,
    description: 'bút highlight mildliner 10 màu pastel tô màu ghi chú sổ tay học bài không lem mực nhật bản' },
  { name: 'Đèn học LED chống cận', category_slug: 'dung-cu-hoc-tap', price: 280000,
    description: 'đèn học led chống cận điều chỉnh độ sáng màu ánh sáng usb tiết kiệm điện để bàn học ban đêm' },
  { name: 'Giá đỡ sách Laptop', category_slug: 'dung-cu-hoc-tap', price: 150000,
    description: 'giá đỡ sách laptop nhôm điều chỉnh góc độ cao thấp tản nhiệt tốt học online làm việc lâu' },
  { name: 'Sổ tay bullet journal A5', category_slug: 'dung-cu-hoc-tap', price: 75000,
    description: 'sổ tay bullet journal a5 dotted grid bìa cứng giấy dày không lem ghi chú lên kế hoạch học' },
  { name: 'Bút bi Uni Jetstream lốc 10', category_slug: 'dung-cu-hoc-tap', price: 85000,
    description: 'bút bi uni jetstream viết trơn nhanh khô mực không lem lốc 10 cây học thi viết tay nhật bản' },
  { name: 'Kệ sách gỗ mini để bàn', category_slug: 'dung-cu-hoc-tap', price: 180000,
    description: 'kệ sách gỗ mini để bàn đựng sách vở tài liệu ngăn nắp phòng học phòng trọ sinh viên tiết kiệm' },
  { name: 'Máy in mini A4 cũ', category_slug: 'dung-cu-hoc-tap', price: 950000,
    description: 'máy in mini a4 in laser trắng đen kết nối usb wifi in tài liệu bài tập sinh viên văn phòng' },
  { name: 'Bộ compa + thước kẻ kỹ thuật', category_slug: 'dung-cu-hoc-tap', price: 55000,
    description: 'bộ compa thước kẻ kỹ thuật vẽ hình học thiết kế kiến trúc sinh viên xây dựng cơ khí bền đẹp' },

  // 🛵 XE CỘ
  { name: 'Xe đạp Giant Escape 3 cũ', category_slug: 'xe-co-phu-kien', price: 3200000,
    description: 'xe đạp thể thao giant escape khung nhôm nhẹ 24 tốc độ bánh 700c phanh đĩa lốp mới đi học' },
  { name: 'Xe đạp điện Vinfast cũ', category_slug: 'xe-co-phu-kien', price: 8500000,
    description: 'xe đạp điện vinfast pin lithium sạc điện tốc độ 25kmh khung nhôm đèn led đi học đi làm' },
  { name: 'Xe máy Honda Wave Alpha 2019', category_slug: 'xe-co-phu-kien', price: 12000000,
    description: 'xe máy honda wave alpha 110cc tiết kiệm xăng chính chủ đăng ký đủ đi học đi làm bền bỉ' },
  { name: 'Xe máy Yamaha Exciter 150 cũ', category_slug: 'xe-co-phu-kien', price: 28000000,
    description: 'xe máy yamaha exciter 150cc động cơ mạnh phanh đĩa trước sau chính chủ đăng ký đủ phân khối' },
  { name: 'Xe đạp thể thao Trek cũ', category_slug: 'xe-co-phu-kien', price: 5500000,
    description: 'xe đạp thể thao trek khung carbon nhôm tay lái cong tốc độ phanh đĩa đi học tập thể dục' },
  { name: 'Mũ bảo hiểm fullface GRS', category_slug: 'xe-co-phu-kien', price: 450000,
    description: 'mũ bảo hiểm fullface grs kính chống uv khóa an toàn lớp lót mềm đi xe máy bảo vệ đầu' },
  { name: 'Mũ bảo hiểm nửa đầu Protec', category_slug: 'xe-co-phu-kien', price: 180000,
    description: 'mũ bảo hiểm nửa đầu protec nhựa abs nhẹ thoáng khí khóa cài an toàn đi xe đạp xe máy' },
  { name: 'Bơm xe đạp mini cầm tay', category_slug: 'xe-co-phu-kien', price: 95000,
    description: 'bơm xe đạp mini cầm tay nhẹ gọn bơm nhanh van presta schrader áp suất cao mang theo túi' },
  { name: 'Khóa chữ U xe đạp Abus', category_slug: 'xe-co-phu-kien', price: 250000,
    description: 'khóa chữ u xe đạp abus thép cứng chống cắt chống phá an toàn bảo vệ xe để ngoài trường' },
  { name: 'Áo mưa xe máy 2 lớp', category_slug: 'xe-co-phu-kien', price: 85000,
    description: 'áo mưa xe máy 2 lớp vải dù không thấm nước túi đựng nhỏ gọn size m l xl đi học đi làm' },
  { name: 'Găng tay lái xe chống nắng', category_slug: 'xe-co-phu-kien', price: 65000,
    description: 'găng tay lái xe chống nắng uv vải thun thoáng khí chống trơn trượt tay lái xe máy xe đạp' },
  { name: 'Đèn pin gắn xe đạp USB', category_slug: 'xe-co-phu-kien', price: 120000,
    description: 'đèn pin gắn xe đạp sạc usb led sáng chống nước nhiều chế độ sáng đi đêm an toàn gọn nhẹ' },
  { name: 'Lốp xe đạp 26 inch Kenda', category_slug: 'xe-co-phu-kien', price: 95000,
    description: 'lốp xe đạp kenda 26 inch chống đinh chịu mài mòn bám đường tốt thay lốp xe đạp địa hình' },
  { name: 'Baga sau xe đạp', category_slug: 'xe-co-phu-kien', price: 150000,
    description: 'baga sau xe đạp sắt inox chịu lực tải nặng gắn yên sau chở hàng đi học đi chợ tiện lợi' },
  { name: 'Giỏ xe đạp inox', category_slug: 'xe-co-phu-kien', price: 120000,
    description: 'giỏ xe đạp inox không gỉ gắn ghi đông phía trước đựng túi sách vở đi học tiện lợi bền đẹp' },
]

// mapping user thích category
const categoryPreference = {
  1: [1,2,3,4,5,6],
  2: [4,5,6,7,8,9,10],
  3: [1,2,3,7,8],
  4: [1,2,3,4,5],
  5: [2,3,4,5,6,7],
  6: [6,7,8,9,10],
}

const seed = async () => {
  console.log('🌱 START SEED...')

  // ❗ RESET DATA (tránh trùng)
  console.log('🧹 Reset database...')
  await db.query('SET FOREIGN_KEY_CHECKS = 0')
  await db.query('TRUNCATE TABLE reviews')
  await db.query('TRUNCATE TABLE view_history')
  await db.query('TRUNCATE TABLE products')
  await db.query('TRUNCATE TABLE shops')
  await db.query('TRUNCATE TABLE users')
  await db.query('SET FOREIGN_KEY_CHECKS = 1')

  // ── USERS ─────────────────
  console.log('👤 Creating users...')
  const hash = await bcrypt.hash('123456', 10)
  const userIds = []

  for (const u of users) {
    const [res] = await db.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES (?,?,?,?)',
      [u.username, u.email, hash, u.username]
    )
    userIds.push(res.insertId)
  }

  console.log(`✅ ${userIds.length} users`)
// ── 1.5. TẠO USER_ADDRESSES ─────────────────
console.log('📍 Creating addresses...')
const addressIds = []

for (let i = 0; i < userIds.length; i++) {
  try {
    const [res] = await db.query(
      `INSERT INTO user_addresses
      (user_id, recipient, phone, province, district, ward, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userIds[i],
        users[i].username,
        '0123456789',
        'Hà Nội',
        'Hoàn Kiếm',
        'Phường 1',
        'Số 1 Test'
      ]
    )

    addressIds.push(res.insertId)

  } catch (err) {
    console.log('❌ Address lỗi:', err.message)
  }
}

console.log(`   ✅ ${addressIds.length} addresses`)
  // ── SHOPS ─────────────────
  console.log('🏪 Creating shops...')
  const shopIds = []

  for (let i = 0; i < userIds.length; i++) {
    const uid = userIds[i]
    const username = users[i].username

    const [res] = await db.query(
      'INSERT INTO shops (user_id, shop_name, slug) VALUES (?,?,?)',
      [uid, `Shop của ${username}`, `shop-${uid}-${Date.now()}-${i}`]
    )

    shopIds.push(res.insertId)
  }

  console.log(`✅ ${shopIds.length} shops`)

  // ── LOAD CATEGORY MAP ─────────────────
  console.log('📂 Loading categories...')
  const categoryMap = {}
  const [categories] = await db.query('SELECT id, slug FROM categories')

  for (const c of categories) {
    categoryMap[c.slug] = c.id
  }

  console.log(categoryMap)

  // ── PRODUCTS ─────────────────
  console.log('📦 Creating products...')
  const productIds = []

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const shopIdx = i % shopIds.length

    const categoryId = categoryMap[p.category_slug]

    if (!categoryId) {
      console.log(`❌ Category not found: ${p.category_slug}`)
      continue
    }

    const slug = `${p.name.toLowerCase().replace(/\s+/g,'-')}-${Date.now()}-${i}`

    const [res] = await db.query(
  `INSERT INTO products
   (shop_id, category_id, name, slug, description, base_price, stock_qty, is_active)
   VALUES (?,?,?,?,?,?,?,1)`,
  [shopIds[shopIdx], categoryId, p.name, slug, p.description || '',
   p.price, Math.floor(Math.random() * 10) + 1]
)

    productIds.push({ id: res.insertId, category_id: categoryId })
  }

  console.log(`✅ ${productIds.length} products`)
// ── 4. TẠO ORDERS ─────────────────────────
console.log('🧾 Creating orders...')
const orderMap = [] // lưu product_id → order_id

for (const prod of productIds) {
  const buyerId = userIds[Math.floor(Math.random() * userIds.length)]
  const shopId = shopIds[Math.floor(Math.random() * shopIds.length)]

  try {
    const addressId = addressIds[Math.floor(Math.random() * addressIds.length)]
    const [orderRes] = await db.query(
      `INSERT INTO orders 
      (order_code, buyer_id, shop_id, address_id, subtotal, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        `ORD-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
        buyerId,
        shopId,
        addressId, // ⚠️ cần tồn tại address_id = 1
        prod.price || 100000,
        prod.price || 100000
      ]
    )

    const orderId = orderRes.insertId
    // tạo order_item
    await db.query(
      `INSERT INTO order_items
       (order_id, product_id, product_name, unit_price, quantity, total_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        prod.id,
        'Sample product',
        prod.price || 100000,
        1,
        prod.price || 100000
      ]
    )

    orderMap.push({
      product_id: prod.id,
      order_id: orderId
    })

  } catch (err) {
    console.log('❌ Order lỗi:', err.message)
  }
}

console.log(`   ✅ ${orderMap.length} orders`)
// ── 5. TẠO REVIEWS ───────────────────────
console.log('⭐ Creating reviews...')
let reviewCount = 0

for (const prod of productIds) {
  const preferredUsers = categoryPreference[prod.category_id] || []

  const order = orderMap.find(o => o.product_id === prod.id)
  if (!order) continue

  for (const uid of preferredUsers) {
    if (Math.random() < 0.7) {
      const rating = Math.floor(Math.random() * 3) + 3

      try {
        await db.query(
          `INSERT IGNORE INTO reviews 
           (user_id, product_id, rating, order_id)
           VALUES (?, ?, ?, ?)`,
          [userIds[uid - 1], prod.id, rating, order.order_id]
        )
        reviewCount++
      } catch {}
    }
  }
}

console.log(`   ✅ ${reviewCount} reviews`)
  // ── VIEW HISTORY ─────────────────
  console.log('👀 Creating views...')
  let viewCount = 0

  for (const prod of productIds) {
    const preferredUsers = categoryPreference[prod.category_id] || []

    for (const uid of preferredUsers) {
      if (Math.random() < 0.8) {
        await db.query(
          'INSERT IGNORE INTO view_history (user_id, product_id) VALUES (?,?)',
          [userIds[uid - 1], prod.id]
        )
        viewCount++
      }
    }
  }

  console.log(`✅ ${viewCount} views`)

  console.log('🎉 DONE!')
  console.log('🤝 Creating user_interactions...')
let interactionCount = 0

// Lấy tất cả view_history
const [views] = await db.query('SELECT user_id, product_id, view_count FROM view_history')

for (const v of views) {
  const score = Math.min(v.view_count, 5) * 1  // mỗi lượt xem = 1đ, tối đa 5đ

  await db.query(`
    INSERT INTO user_interactions (user_id, product_id, score)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE score = ?, updated_at = NOW()
  `, [v.user_id, v.product_id, score, score])

  interactionCount++
}

// Cộng thêm điểm từ reviews
const [reviewRows] = await db.query('SELECT user_id, product_id, rating FROM reviews')

for (const r of reviewRows) {
  await db.query(`
    INSERT INTO user_interactions (user_id, product_id, score)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE score = score + ?, updated_at = NOW()
  `, [r.user_id, r.product_id, r.rating, r.rating])
}

console.log(`✅ ${interactionCount} interactions`)
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ ERROR:', err)
  process.exit(1)
})