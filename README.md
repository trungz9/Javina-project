# 🌸 Javina Shop
### ジャビナショップ — Sàn thương mại điện tử dành cho sinh viên

<div align="center">

![Javina Shop Banner](https://placehold.co/900x300/FFB7C5/ffffff?text=+Javina+Shop+)

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Vite](https://img.shields.io/badge/Vite-v5+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Mua bán • Trao đổi • Kết nối cộng đồng sinh viên**

[🚀 Demo](#) • [📖 Tài liệu](#hướng-dẫn-cài-đặt) • [🐛 Báo lỗi](issues)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Thuật toán nổi bật](#-thuật-toán-nổi-bật)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Chạy dự án](#-chạy-dự-án)
- [Seed dữ liệu](#-seed-dữ-liệu)
- [API Documentation](#-api-documentation)
- [Giao diện](#-giao-diện)
- [Đóng góp](#-đóng-góp)
- [Liên hệ](#-liên-hệ)

---

## 🌸 Giới thiệu

**Javina Shop** là nền tảng thương mại điện tử được thiết kế riêng cho cộng đồng sinh viên Việt Nam, lấy cảm hứng từ phong cách Nhật Bản (pastel, dễ thương, tinh tế).

Khác với các sàn TMĐT thông thường như Shopee hay Lazada, Javina Shop tập trung vào:

- 🎓 **Cộng đồng sinh viên** — Mua bán trong nội bộ trường, tăng độ tin cậy
- 💰 **Giá sinh viên** — Hàng cũ, sách giáo trình, đồ dùng học tập giá rẻ
- 🇯🇵 **Hàng Việt - Nhật** — Hỗ trợ xem giá theo VNĐ và JPY với biểu đồ tỷ giá thời gian thực
- 📊 **Dự đoán tỷ giá** — Thuật toán Linear Regression dự đoán xu hướng 1-2 ngày tới
- 🤖 **Gợi ý thông minh** — Hệ thống gợi ý sản phẩm 3 tầng (Cluster → View History → Collaborative Filtering)
- 🔍 **Tìm kiếm nhanh** — Autocomplete bằng cấu trúc dữ liệu Trie, hỗ trợ tiếng Việt không dấu

---

## ✨ Tính năng chính

### 👤 Người dùng
- Đăng ký / Đăng nhập với JWT Authentication
- Hồ sơ sinh viên (tên trường, mã sinh viên)
- Quản lý địa chỉ giao hàng (nhà, ký túc xá, trường...)

### 🛍️ Mua sắm
- **Autocomplete tìm kiếm** — Gợi ý sản phẩm ngay khi gõ, hỗ trợ không dấu tiếng Việt
- Tìm kiếm và lọc sản phẩm theo danh mục, giá, tình trạng
- Xem chi tiết sản phẩm với gallery ảnh
- **Đổi giá VNĐ ⇄ JPY** ngay trên trang sản phẩm
- Thêm vào giỏ hàng, điều chỉnh số lượng
- Đặt hàng COD (thanh toán khi nhận hàng)
- Theo dõi trạng thái đơn hàng

### 🤖 Hệ thống gợi ý sản phẩm (3 tầng)
- **Tầng 1 — Cold Start (Text Clustering):** Gợi ý sản phẩm tương tự dựa trên mô tả, dành cho user mới chưa có lịch sử
- **Tầng 2 — View History:** Theo dõi hành vi xem/mua/đánh giá để tính điểm tổng hợp
- **Tầng 3 — Collaborative Filtering:** Gợi ý cá nhân hóa dựa trên Cosine Similarity giữa các user

### 🏪 Người bán
- Tạo gian hàng tự động khi đăng sản phẩm
- Đăng bán sản phẩm với upload ảnh (tối đa 5 ảnh)
- Dashboard thống kê doanh thu, đơn hàng
- Quản lý đơn hàng và cập nhật trạng thái
- Top sản phẩm bán chạy

### 💱 Tỷ giá VNĐ / JPY
- Biểu đồ tỷ giá lịch sử **7 ngày**
- Lọc theo: **3 tiếng / 12 tiếng / 1 ngày / 3 ngày / 7 ngày**
- Cập nhật tự động mỗi **30 phút**
- **Dự đoán 1-2 ngày tới** bằng thuật toán Linear Regression
- Nút đổi tiền tệ trên trang chủ và giỏ hàng

---

## 🧠 Thuật toán nổi bật

### 1. Autocomplete bằng Trie

Cấu trúc dữ liệu Trie được dùng để gợi ý sản phẩm khi người dùng gõ từ khóa.

```
Độ phức tạp tìm kiếm: O(m) — m = độ dài prefix
So với MySQL LIKE:    O(n×m) — n = số sản phẩm
```

Tính năng đặc biệt:
- Hỗ trợ tiếng Việt không dấu (`sach` tìm được `Sách Giải Tích`)
- Sắp xếp kết quả theo rating trung bình
- Cập nhật realtime khi có sản phẩm mới
- Debounce 300ms để giảm tải server

### 2. Gợi ý sản phẩm — Collaborative Filtering

Dùng **Cosine Similarity** để tìm người dùng tương tự:

```
similarity(A,B) = (A · B) / (|A| × |B|)
```

Điểm tương tác tổng hợp:
| Hành vi | Điểm |
|---|---|
| Xem sản phẩm | +1 (tối đa 5 lần) |
| Thêm vào giỏ | +2 |
| Mua hàng | +3 |
| Đánh giá sao | +rating (1-5) |

### 3. Cold Start — Text Clustering

Giải quyết bài toán Cold Start Problem bằng TF-IDF + K-Means:
- Phân tích mô tả sản phẩm tiếng Việt
- Phân cụm thành 6 nhóm tương ứng 6 danh mục
- Gợi ý sản phẩm cùng cluster cho user mới

### 4. Luồng gợi ý 3 tầng

```
User mới (chưa có lịch sử)
        ↓
Tầng 1: CLUSTER — "Sản phẩm tương tự về mô tả"
        ↓
User xem vài sản phẩm
        ↓
Tầng 2: VIEW HISTORY — "Sản phẩm cùng nhóm bạn hay xem"
        ↓
User có đủ dữ liệu tương tác
        ↓
Tầng 3: COLLABORATIVE FILTERING — "Người giống bạn đã thích gì"
```

---

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Node.js | v20+ | Runtime environment |
| Express.js | v4+ | Web framework |
| MySQL2 | v3+ | Database driver |
| JWT | - | Authentication |
| bcryptjs | - | Password hashing |
| multer | - | Upload ảnh sản phẩm |
| node-cron | - | Scheduled jobs |
| helmet | - | Bảo mật HTTP headers |
| express-rate-limit | - | Chống brute force |
| axios | - | HTTP client |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | v18+ | UI framework |
| Vite | v5+ | Build tool |
| React Router DOM | v6+ | Client-side routing |
| Axios | - | API calls |
| Recharts | - | Biểu đồ tỷ giá |

### AI / Machine Learning
| Công nghệ | Mục đích |
|---|---|
| Python + scikit-learn | TF-IDF + K-Means clustering |
| mysql-connector-python | Kết nối DB từ Python |

### Database & Tools
| Công nghệ | Mục đích |
|---|---|
| MySQL 8.0+ | Cơ sở dữ liệu chính |
| MySQL Workbench | Quản lý database |
| Thunder Client | Test API |
| ExchangeRate-API | Dữ liệu tỷ giá JPY/VND |

---

## 📁 Cấu trúc dự án

```
javina-shop/
│
├── 📂 backend/
│   ├── 📂 config/
│   │   └── db.js                    # Kết nối MySQL
│   ├── 📂 src/
│   │   ├── 📂 controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js  # Bao gồm: getRecommendedProducts, searchAutocomplete, getClusterRecommendations
│   │   │   ├── interaction.controller.js  # ✅ Theo dõi hành vi user
│   │   │   ├── cart.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── shop.controller.js
│   │   │   └── currency.controller.js
│   │   ├── 📂 routes/
│   │   │   ├── auth.route.js
│   │   │   ├── product.route.js       # Bao gồm: /autocomplete, /recommendations, /:id/similar
│   │   │   ├── interaction.route.js   # ✅ Route theo dõi hành vi
│   │   │   ├── cart.route.js
│   │   │   ├── order.route.js
│   │   │   ├── shop.route.js
│   │   │   ├── category.route.js
│   │   │   ├── address.route.js
│   │   │   └── currency.route.js
│   │   ├── 📂 middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── 📂 utils/
│   │   │   ├── Trie.js               # ✅ Cấu trúc dữ liệu Trie + rating score
│   │   │   ├── collaborative.js      # ✅ Thuật toán Collaborative Filtering
│   │   │   └── scoring.js            # ✅ Tính điểm tổng hợp hành vi
│   │   └── 📂 jobs/
│   │       └── currency.job.js
│   ├── 📂 clustering/
│   │   ├── cluster_products.py       # ✅ Script Python phân cụm sản phẩm
│   │   └── model.pkl                 # ✅ Model TF-IDF + K-Means đã train
│   ├── 📂 uploads/                   # ✅ Thư mục lưu ảnh sản phẩm
│   ├── seed.js                       # ✅ Script tạo dữ liệu mẫu
│   ├── .env
│   ├── .env.example
│   └── server.js
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   │   └── axios.js
│   │   ├── 📂 components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SearchBar.jsx          # ✅ Autocomplete Trie
│   │   │   ├── RecommendedProducts.jsx # ✅ Gợi ý sản phẩm
│   │   │   ├── CurrencyChart.jsx
│   │   │   └── CurrencyToggle.jsx
│   │   ├── 📂 context/
│   │   │   └── AuthContext.jsx
│   │   ├── 📂 pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ProductDetail.jsx      # Tích hợp trackView + gợi ý cùng cluster
│   │   │   ├── CreateProduct.jsx      # Upload ảnh tối đa 5 ảnh
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageOrders.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   └── Currency.jsx
│   │   ├── 📂 styles/
│   │   │   ├── global.css
│   │   │   ├── components.css
│   │   │   └── pages.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── 📄 database.sql                    # Database schema đầy đủ
└── 📄 README.md
```

---

## 💻 Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu | Kiểm tra |
|---|---|---|
| Node.js | v18.0+ | `node -v` |
| npm | v9.0+ | `npm -v` |
| MySQL | v8.0+ | MySQL Workbench |
| Python | v3.8+ | `python --version` |
| Git | Bất kỳ | `git -v` |

---

## 🚀 Hướng dẫn cài đặt

### Bước 1 — Clone dự án

```bash
git clone https://github.com/your-username/javina-shop.git
cd javina-shop
```

### Bước 2 — Tạo Database MySQL

Mở **MySQL Workbench**, kết nối vào local instance, chạy file schema:

```sql
SOURCE /đường/dẫn/tới/javina-shop/database.sql;
```

Sau đó thêm các bảng mới cho hệ thống gợi ý:

```sql
USE `javina-shop`;

-- Bảng lưu lịch sử xem sản phẩm
CREATE TABLE IF NOT EXISTS view_history (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  product_id  BIGINT UNSIGNED NOT NULL,
  view_count  INT DEFAULT 1,
  last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_view (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng lưu điểm tổng hợp hành vi (dùng cho Collaborative Filtering)
CREATE TABLE IF NOT EXISTS user_interactions (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  score      FLOAT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_interaction (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Thêm cột cluster_id cho Text Clustering
ALTER TABLE products ADD COLUMN IF NOT EXISTS cluster_id INT DEFAULT NULL;

-- Bảng tỷ giá
CREATE TABLE IF NOT EXISTS currency_rates (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vnd_to_jpy  DECIMAL(10,6)   NOT NULL,
    jpy_to_vnd  DECIMAL(10,4)   NOT NULL,
    source      VARCHAR(50)     DEFAULT 'exchangerate-api',
    recorded_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recorded (recorded_at)
) ENGINE=InnoDB;
```

### Bước 3 — Cài đặt Backend

```bash
cd backend
npm install
```

### Bước 4 — Cài đặt Frontend

```bash
cd ../frontend
npm install
```

### Bước 5 — Cài đặt Python (cho Text Clustering)

```bash
cd ../backend/clustering
python -m venv .venv

# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate

pip install scikit-learn mysql-connector-python
```

### Bước 6 — Đăng ký API tỷ giá (miễn phí)

1. Truy cập [https://app.exchangerate-api.com](https://app.exchangerate-api.com)
2. Đăng ký tài khoản miễn phí
3. Copy **API Key** từ Dashboard

---

## ⚙️ Cấu hình môi trường

### Backend — Tạo file `backend/.env`

```env
# ── Database ──────────────────────────────
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mật_khẩu_mysql_của_bạn
DB_NAME=javina-shop

# ── Authentication ─────────────────────────
JWT_SECRET=javina_secret_key_2024_change_this
JWT_EXPIRES_IN=7d

# ── Server ────────────────────────────────
PORT=5000

# ── Currency API ──────────────────────────
EXCHANGE_RATE_API_KEY=your_api_key_here
```

### Frontend — Tạo file `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Lưu ý:** Không bao giờ commit file `.env` lên GitHub!

---

## ▶️ Chạy dự án

Mở **2 terminal riêng biệt** trong VSCode

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Kết quả mong đợi:
```
🚀 Server: http://localhost:5000
✅ MySQL connected!
✅ Trie loaded: 90 sản phẩm
💱 Currency job started
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Kết quả mong đợi:
```
  VITE v5.x.x  ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

---

## 🌱 Seed dữ liệu

Tạo dữ liệu mẫu để test hệ thống gợi ý:

```bash
cd backend
node seed.js
```

Script sẽ tạo:
- 10 users với preference riêng theo danh mục
- 10 shops (mỗi user 1 shop)
- 90 sản phẩm (15 sản phẩm × 6 danh mục) với mô tả đầy đủ
- Orders và order_items
- Reviews theo preference (user thích danh mục → rating cao hơn)
- View history
- User interactions (điểm tổng hợp cho Collaborative Filtering)

**Tài khoản test:**
| Email | Password | Đặc điểm |
|---|---|---|
| an@test.com | 123456 | Thích sách, học tập |
| emily@test.com | 123456 | Thích điện tử |
| giang@test.com | 123456 | Thích xe cộ |

### Phân cụm sản phẩm (Text Clustering)

Sau khi seed xong, chạy Python để phân cụm:

```bash
cd backend/clustering
.venv\Scripts\activate   # Windows
python cluster_products.py
```

Kết quả:
```
=== Top terms per cluster ===
Cluster 1: sách, học, sinh viên, giáo trình, tập...
Cluster 2: laptop, màn hình, tai nghe, bluetooth...
Cluster 3: áo, quần, giày, vải, mặc...
...
✅ Gán cluster cho 90 sản phẩm!
✅ Lưu model.pkl!
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Thông tin bản thân | ✅ |

### Sản phẩm
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/products` | Danh sách sản phẩm | ❌ |
| GET | `/api/products/autocomplete?q=sach` | Gợi ý tìm kiếm (Trie) | ❌ |
| GET | `/api/products/recommendations` | Gợi ý cá nhân hóa | ✅ |
| GET | `/api/products/:id` | Chi tiết sản phẩm | ❌ |
| GET | `/api/products/:id/similar` | Sản phẩm cùng cluster | ❌ |
| POST | `/api/products` | Tạo sản phẩm + upload ảnh | ✅ |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | ✅ |
| DELETE | `/api/products/:id` | Xoá sản phẩm | ✅ |

### Theo dõi hành vi (User Interactions)
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/api/interactions/view/:id` | Ghi lại lượt xem sản phẩm | ✅ |
| GET | `/api/interactions/history` | Lịch sử xem của user | ✅ |

### Giỏ hàng
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/cart` | Xem giỏ hàng | ✅ |
| POST | `/api/cart` | Thêm vào giỏ | ✅ |
| PUT | `/api/cart/:id` | Cập nhật số lượng | ✅ |
| DELETE | `/api/cart/:id` | Xoá khỏi giỏ | ✅ |

### Đơn hàng
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/api/orders` | Đặt hàng | ✅ |
| GET | `/api/orders/my` | Đơn hàng của tôi | ✅ |
| GET | `/api/orders/:id` | Chi tiết đơn hàng | ✅ |
| PUT | `/api/orders/:id/cancel` | Huỷ đơn hàng | ✅ |

### Shop & Dashboard
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/shop/my` | Thông tin shop | ✅ |
| PUT | `/api/shop/my` | Cập nhật shop | ✅ |
| GET | `/api/shop/my/orders` | Đơn hàng của shop | ✅ |
| PUT | `/api/shop/my/orders/:id` | Cập nhật trạng thái | ✅ |
| GET | `/api/shop/my/stats` | Thống kê doanh thu | ✅ |

### Tỷ giá
| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/currency/current` | Tỷ giá hiện tại | ❌ |
| GET | `/api/currency/history` | Lịch sử 7 ngày | ❌ |
| GET | `/api/currency/predict` | Dự đoán 1-2 ngày | ❌ |
| GET | `/api/currency/convert?amount=100&from=VND` | Đổi tiền | ❌ |

---

## 🗄️ Database Schema

Dự án sử dụng **23 bảng** chính:

```
users               → Tài khoản người dùng
user_addresses      → Địa chỉ giao hàng
categories          → Danh mục sản phẩm (6 danh mục)
shops               → Gian hàng người bán
products            → Sản phẩm (có cluster_id cho Text Clustering)
product_images      → Hình ảnh sản phẩm (tối đa 5 ảnh)
product_variants    → Biến thể (màu, size)
wishlists           → Danh sách yêu thích
cart_items          → Giỏ hàng
coupons             → Mã giảm giá
orders              → Đơn hàng
order_items         → Chi tiết đơn hàng
payments            → Thanh toán
reviews             → Đánh giá sản phẩm (dùng cho CF)
view_history        → ✅ Lịch sử xem sản phẩm
user_interactions   → ✅ Điểm tổng hợp hành vi (dùng cho CF)
conversations       → Hội thoại
messages            → Tin nhắn
notifications       → Thông báo
banners             → Banner quảng cáo
shipping_logs       → Lịch sử vận chuyển
reports             → Báo cáo vi phạm
currency_rates      → Lịch sử tỷ giá JPY/VND
```

---

## ❗ Xử lý lỗi thường gặp

### ❌ MySQL connected không hiện
```bash
# Kiểm tra thông tin trong .env
DB_HOST=127.0.0.1   # không dùng "localhost"
DB_PORT=3306
DB_USER=root
DB_PASSWORD=đúng_mật_khẩu
```

### ❌ ModuleNotFoundError: No module named 'mysql'
```bash
# Cần kích hoạt virtual environment trước
cd backend/clustering
.venv\Scripts\activate    # Windows
pip install mysql-connector-python scikit-learn
```

### ❌ Trie loaded: 0 sản phẩm
```bash
# Chưa có sản phẩm trong DB — chạy seed trước
cd backend
node seed.js
```

### ❌ method luôn là "popular" không ra "collaborative"
```bash
# User đang dùng chưa có đủ data trong user_interactions
# Đăng nhập bằng tài khoản seed:
# Email: an@test.com / Password: 123456
```

### ❌ 404 Not Found khi gọi /recommendations
```bash
# Route bị conflict với /:id — kiểm tra thứ tự trong product.route.js
# Route cụ thể phải đặt TRƯỚC route có tham số:
router.get('/autocomplete', ...)      # ← đặt trước
router.get('/recommendations', ...)  # ← đặt trước
router.get('/:id', ...)              # ← đặt sau
```

### ❌ Token không hợp lệ hoặc đã hết hạn
```bash
# 1. Đăng nhập lại để lấy token mới
# 2. Kiểm tra Authorization header: Bearer <token> (không có dấu "")
# 3. Tăng thời hạn trong .env: JWT_EXPIRES_IN=7d
```

### ❌ Table 'cart' doesn't exist
```bash
# Tên bảng đúng là cart_items, không phải cart
# Kiểm tra lại trong interaction.controller.js
```

### ❌ CORS error trên frontend
```bash
# Kiểm tra trong server.js:
app.use(cors({ origin: 'http://localhost:5173' }));
```

### ❌ Biểu đồ tỷ giá trống
```bash
# Kiểm tra EXCHANGE_RATE_API_KEY trong .env
# Đợi 30 phút để cron job chạy lần đầu
```

---

## 🖼️ Giao diện

| Trang | Mô tả |
|---|---|
| 🏠 Trang chủ | Hero banner, autocomplete search, gợi ý sản phẩm, nút đổi VNĐ/JPY |
| 🔐 Đăng nhập/Đăng ký | Giao diện pastel phong cách Nhật Bản |
| 📦 Chi tiết sản phẩm | Gallery ảnh, sản phẩm tương tự cùng cluster, nút đổi tiền tệ |
| 🛒 Giỏ hàng | Danh sách sản phẩm, tổng tiền VNĐ/JPY |
| 💱 Tỷ giá | Biểu đồ lịch sử, dự đoán Linear Regression |
| 🏪 Dashboard | Thống kê shop, top sản phẩm, quản lý đơn |

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón!

```bash
# 1. Fork dự án
# 2. Tạo branch mới
git checkout -b feature/ten-tinh-nang

# 3. Commit thay đổi
git commit -m "feat: thêm tính năng X"

# 4. Push lên branch
git push origin feature/ten-tinh-nang

# 5. Tạo Pull Request
```

### Quy tắc commit message
```
feat:     Thêm tính năng mới
fix:      Sửa lỗi
style:    Thay đổi CSS/UI
refactor: Tái cấu trúc code
docs:     Cập nhật tài liệu
```

---

## 📄 License

Dự án được phát hành dưới giấy phép [MIT License](LICENSE).

---

## 📬 Liên hệ

**Javina Shop Team**

- 📧 Email: your-email@gmail.com
- 🐙 GitHub: [github.com/your-username](https://github.com/your-username)
- 🌐 Website: [javina-shop.vercel.app](#)

---

<div align="center">

Made with 🌸 for students

**Javina Shop © 2025**

</div>