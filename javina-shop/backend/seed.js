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
  // 📚 SÁCH (category_id: 1)
  { name: 'Sách Giải Tích 1',                  category_slug: 'sach-tai-lieu', price: 45000 },
  { name: 'Sách Đại Số Tuyến Tính',            category_slug: 'sach-tai-lieu', price: 50000 },
  { name: 'Giáo Trình Lập Trình C++',          category_slug: 'sach-tai-lieu', price: 60000 },
  { name: 'Sách Cấu Trúc Dữ Liệu & Giải Thuật', category_slug: 'sach-tai-lieu', price: 55000 },
  { name: 'Sách Tiếng Nhật N5 Minna',          category_slug: 'sach-tai-lieu', price: 80000 },
  { name: 'Sách IELTS Cambridge 17',            category_slug: 'sach-tai-lieu', price: 120000 },
  { name: 'Sách Lập Trình Python Cơ Bản',      category_slug: 'sach-tai-lieu', price: 75000 },
  { name: 'Sách Đắc Nhân Tâm',                 category_slug: 'sach-tai-lieu', price: 65000 },
  { name: 'Giáo Trình Xác Suất Thống Kê',      category_slug: 'sach-tai-lieu', price: 45000 },
  { name: 'Giáo Trình Cơ Sở Dữ Liệu',         category_slug: 'sach-tai-lieu', price: 52000 },
  { name: 'Sách Harry Potter Tập 1',           category_slug: 'sach-tai-lieu', price: 90000 },
  { name: 'Giáo Trình Vật Lý Đại Cương',       category_slug: 'sach-tai-lieu', price: 48000 },
  { name: 'Giáo Trình Kinh Tế Vi Mô',          category_slug: 'sach-tai-lieu', price: 42000 },
  { name: 'Sách Triết Học Mác-Lênin',          category_slug: 'sach-tai-lieu', price: 35000 },
  { name: 'Giáo Trình Mạng Máy Tính',          category_slug: 'sach-tai-lieu', price: 48000 },

  // 💻 ĐIỆN TỬ (category_id: 2)
  { name: 'Laptop Dell Inspiron 15 cũ',        category_slug: 'do-dien-tu', price: 7500000 },
  { name: 'Laptop Asus VivoBook 14 cũ',        category_slug: 'do-dien-tu', price: 6800000 },
  { name: 'MacBook Air M1 2020 cũ',            category_slug: 'do-dien-tu', price: 18000000 },
  { name: 'Tai nghe Sony WH-1000XM4',          category_slug: 'do-dien-tu', price: 3500000 },
  { name: 'Tai nghe JBL Tune 510BT',           category_slug: 'do-dien-tu', price: 800000 },
  { name: 'Airpods Pro 2 like new',            category_slug: 'do-dien-tu', price: 4200000 },
  { name: 'iPhone 13 128GB cũ',               category_slug: 'do-dien-tu', price: 12000000 },
  { name: 'Samsung Galaxy A54 cũ',            category_slug: 'do-dien-tu', price: 6500000 },
  { name: 'Bàn phím cơ Keychron K2',          category_slug: 'do-dien-tu', price: 1800000 },
  { name: 'Chuột Logitech MX Master 3',       category_slug: 'do-dien-tu', price: 1500000 },
  { name: 'Màn hình LG 24 inch Full HD',      category_slug: 'do-dien-tu', price: 2800000 },
  { name: 'iPad Gen 9 64GB cũ',               category_slug: 'do-dien-tu', price: 7200000 },
  { name: 'Sạc dự phòng Anker 20000mAh',      category_slug: 'do-dien-tu', price: 450000 },
  { name: 'Ổ cứng SSD 256GB Samsung',         category_slug: 'do-dien-tu', price: 700000 },
  { name: 'Webcam Logitech C920 cũ',          category_slug: 'do-dien-tu', price: 900000 },

  // 👕 THỜI TRANG (category_id: 3)
  { name: 'Áo thun trắng basic unisex',       category_slug: 'thoi-trang', price: 80000 },
  { name: 'Áo hoodie xám oversize',           category_slug: 'thoi-trang', price: 180000 },
  { name: 'Quần jean xanh slim fit',          category_slug: 'thoi-trang', price: 220000 },
  { name: 'Áo khoác dù 2 lớp',               category_slug: 'thoi-trang', price: 250000 },
  { name: 'Váy hoa dáng midi',               category_slug: 'thoi-trang', price: 150000 },
  { name: 'Giày Converse Chuck Taylor cũ',   category_slug: 'thoi-trang', price: 350000 },
  { name: 'Giày Adidas Ultraboost cũ',       category_slug: 'thoi-trang', price: 800000 },
  { name: 'Túi tote vải canvas',             category_slug: 'thoi-trang', price: 120000 },
  { name: 'Balo laptop Samsonite cũ',        category_slug: 'thoi-trang', price: 450000 },
  { name: 'Mũ bucket màu be',               category_slug: 'thoi-trang', price: 90000 },
  { name: 'Áo sơ mi kẻ caro',               category_slug: 'thoi-trang', price: 160000 },
  { name: 'Quần short thể thao Nike',        category_slug: 'thoi-trang', price: 130000 },
  { name: 'Áo len cổ lọ màu nâu',           category_slug: 'thoi-trang', price: 200000 },
  { name: 'Giày lười da đen',               category_slug: 'thoi-trang', price: 280000 },
  { name: 'Dép tông Nike chính hãng',        category_slug: 'thoi-trang', price: 200000 },

  // 🍜 ĐỒ ĂN (category_id: 4)
  { name: 'Bánh tráng trộn handmade',        category_slug: 'do-an-thuc-uong', price: 25000 },
  { name: 'Trà sữa trân châu đường đen',     category_slug: 'do-an-thuc-uong', price: 35000 },
  { name: 'Hộp cookies bơ homemade',         category_slug: 'do-an-thuc-uong', price: 55000 },
  { name: 'Cơm hộp văn phòng',              category_slug: 'do-an-thuc-uong', price: 30000 },
  { name: 'Chè khúc bạch',                  category_slug: 'do-an-thuc-uong', price: 25000 },
  { name: 'Gà nướng muối ớt',              category_slug: 'do-an-thuc-uong', price: 45000 },
  { name: 'Bánh flan caramel homemade',     category_slug: 'do-an-thuc-uong', price: 20000 },
  { name: 'Nước ép cam tươi 500ml',         category_slug: 'do-an-thuc-uong', price: 20000 },
  { name: 'Xôi mặn gà',                    category_slug: 'do-an-thuc-uong', price: 25000 },
  { name: 'Tokbokki tự làm',               category_slug: 'do-an-thuc-uong', price: 30000 },
  { name: 'Bánh tráng nướng phô mai',       category_slug: 'do-an-thuc-uong', price: 20000 },
  { name: 'Bánh mì que phô mai',           category_slug: 'do-an-thuc-uong', price: 15000 },
  { name: 'Bánh cupcake sinh nhật',         category_slug: 'do-an-thuc-uong', price: 35000 },
  { name: 'Hủ tiếu khô handmade',          category_slug: 'do-an-thuc-uong', price: 35000 },
  { name: 'Cà phê sữa đá mang về',         category_slug: 'do-an-thuc-uong', price: 20000 },

  // 📐 HỌC TẬP (category_id: 5)
  { name: 'Bộ dụng cụ vẽ kỹ thuật',        category_slug: 'dung-cu-hoc-tap', price: 85000 },
  { name: 'Máy tính Casio FX-580VN cũ',    category_slug: 'dung-cu-hoc-tap', price: 200000 },
  { name: 'Bảng vẽ điện tử Wacom cũ',      category_slug: 'dung-cu-hoc-tap', price: 1200000 },
  { name: 'Bộ màu nước 24 màu Winsor',     category_slug: 'dung-cu-hoc-tap', price: 180000 },
  { name: 'Tập vở 200 trang lốc 10 cuốn', category_slug: 'dung-cu-hoc-tap', price: 45000 },
  { name: 'Bút máy Pilot Kakuno',          category_slug: 'dung-cu-hoc-tap', price: 95000 },
  { name: 'Flashcard tiếng Anh 1000 từ',  category_slug: 'dung-cu-hoc-tap', price: 60000 },
  { name: 'Bộ highlight Mildliner 10 màu', category_slug: 'dung-cu-hoc-tap', price: 120000 },
  { name: 'Đèn học LED chống cận',         category_slug: 'dung-cu-hoc-tap', price: 280000 },
  { name: 'Giá đỡ sách Laptop',           category_slug: 'dung-cu-hoc-tap', price: 150000 },
  { name: 'Sổ tay bullet journal A5',     category_slug: 'dung-cu-hoc-tap', price: 75000 },
  { name: 'Bút bi Uni Jetstream lốc 10',  category_slug: 'dung-cu-hoc-tap', price: 85000 },
  { name: 'Kệ sách gỗ mini để bàn',       category_slug: 'dung-cu-hoc-tap', price: 180000 },
  { name: 'Máy in mini A4 cũ',            category_slug: 'dung-cu-hoc-tap', price: 950000 },
  { name: 'Bộ compa + thước kẻ kỹ thuật', category_slug: 'dung-cu-hoc-tap', price: 55000 },

  // 🛵 XE CỘ (category_id: 6)
  { name: 'Xe đạp Giant Escape 3 cũ',     category_slug: 'xe-co-phu-kien', price: 3200000 },
  { name: 'Xe đạp điện Vinfast cũ',       category_slug: 'xe-co-phu-kien', price: 8500000 },
  { name: 'Xe máy Honda Wave Alpha 2019', category_slug: 'xe-co-phu-kien', price: 12000000 },
  { name: 'Xe máy Yamaha Exciter 150 cũ', category_slug: 'xe-co-phu-kien', price: 28000000 },
  { name: 'Xe đạp thể thao Trek cũ',      category_slug: 'xe-co-phu-kien', price: 5500000 },
  { name: 'Mũ bảo hiểm fullface GRS',     category_slug: 'xe-co-phu-kien', price: 450000 },
  { name: 'Mũ bảo hiểm nửa đầu Protec',  category_slug: 'xe-co-phu-kien', price: 180000 },
  { name: 'Bơm xe đạp mini cầm tay',      category_slug: 'xe-co-phu-kien', price: 95000 },
  { name: 'Khóa chữ U xe đạp Abus',       category_slug: 'xe-co-phu-kien', price: 250000 },
  { name: 'Áo mưa xe máy 2 lớp',         category_slug: 'xe-co-phu-kien', price: 85000 },
  { name: 'Găng tay lái xe chống nắng',   category_slug: 'xe-co-phu-kien', price: 65000 },
  { name: 'Đèn pin gắn xe đạp USB',       category_slug: 'xe-co-phu-kien', price: 120000 },
  { name: 'Lốp xe đạp 26 inch Kenda',     category_slug: 'xe-co-phu-kien', price: 95000 },
  { name: 'Baga sau xe đạp',             category_slug: 'xe-co-phu-kien', price: 150000 },
  { name: 'Giỏ xe đạp inox',             category_slug: 'xe-co-phu-kien', price: 120000 },
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
       (shop_id, category_id, name, slug, base_price, stock_qty, is_active)
       VALUES (?,?,?,?,?,?,1)`,
      [
        shopIds[shopIdx],
        categoryId,
        p.name,
        slug,
        p.price,
        Math.floor(Math.random() * 10) + 1
      ]
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
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ ERROR:', err)
  process.exit(1)
})