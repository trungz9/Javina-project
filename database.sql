-- ============================================================
--  MINISHOPEE - SQL Schema dành cho sinh viên
--  Database: MySQL / MariaDB
--  Encoding: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `javina-shop`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `javina-shop`;

-- ============================================================
-- 1. USERS - Người dùng (sinh viên mua/bán)
-- ============================================================
CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(120) NOT NULL UNIQUE,
    phone           VARCHAR(15)  UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    bio             TEXT,                                   -- Giới thiệu ngắn
    student_id      VARCHAR(20),                            -- Mã số sinh viên (tuỳ chọn)
    university      VARCHAR(150),                           -- Trường đại học
    role            ENUM('buyer','seller','both','admin') NOT NULL DEFAULT 'both',
    is_verified     TINYINT(1)   NOT NULL DEFAULT 0,        -- Xác thực email
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    last_login_at   DATETIME,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email   (email),
    INDEX idx_phone   (phone),
    INDEX idx_university (university)
) ENGINE=InnoDB;
 
-- ============================================================
-- 2. USER_ADDRESSES - Địa chỉ giao hàng
-- ============================================================
CREATE TABLE user_addresses (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    label       VARCHAR(50)  DEFAULT 'Nhà',               -- Nhà, Ký túc xá, Trường...
    recipient   VARCHAR(100) NOT NULL,
    phone       VARCHAR(15)  NOT NULL,
    province    VARCHAR(100) NOT NULL,
    district    VARCHAR(100) NOT NULL,
    ward        VARCHAR(100) NOT NULL,
    address     VARCHAR(255) NOT NULL,                     -- Số nhà, tên đường
    is_default  TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- 3. CATEGORIES - Danh mục sản phẩm
-- ============================================================
CREATE TABLE categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id   INT UNSIGNED DEFAULT NULL,                 -- Danh mục cha (null = gốc)
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    icon_url    VARCHAR(500),
    sort_order  SMALLINT     NOT NULL DEFAULT 0,
    is_active   TINYINT(1)   NOT NULL DEFAULT 1,

    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent (parent_id),
    INDEX idx_slug   (slug)
) ENGINE=InnoDB;

-- Dữ liệu mẫu danh mục
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Sách & Tài liệu',       'sach-tai-lieu',        1),
  ('Đồ điện tử',            'do-dien-tu',           2),
  ('Thời trang',             'thoi-trang',           3),
  ('Đồ ăn & Thức uống',     'do-an-thuc-uong',      4),
  ('Dụng cụ học tập',       'dung-cu-hoc-tap',      5),
  ('Xe cộ & Phụ kiện',      'xe-co-phu-kien',       6),
  ('Phòng trọ & Nội thất',  'phong-tro-noi-that',   7),
  ('Dịch vụ sinh viên',     'dich-vu-sinh-vien',    8),
  ('Khác',                   'khac',                 9);

-- ============================================================
-- 4. SHOPS - Gian hàng của người bán
-- ============================================================
CREATE TABLE shops (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL UNIQUE,
    shop_name       VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) NOT NULL UNIQUE,
    description     TEXT,
    logo_url        VARCHAR(500),
    banner_url      VARCHAR(500),
    rating_avg      DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    rating_count    INT UNSIGNED NOT NULL DEFAULT 0,
    total_sold      INT UNSIGNED NOT NULL DEFAULT 0,
    is_verified     TINYINT(1)   NOT NULL DEFAULT 0,       -- Shop đã xác minh danh tính SV
    is_active       TINYINT(1)   NOT NULL DEFAULT 1,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- ============================================================
-- 5. PRODUCTS - Sản phẩm
-- ============================================================
CREATE TABLE products (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    shop_id         BIGINT UNSIGNED NOT NULL,
    category_id     INT UNSIGNED    NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    slug            VARCHAR(280)    NOT NULL UNIQUE,
    description     TEXT,
    condition_type  ENUM('new','like_new','used','for_rent') NOT NULL DEFAULT 'used',
    base_price      DECIMAL(12,0)   NOT NULL,              -- Giá gốc (VNĐ)
    discount_pct    TINYINT UNSIGNED NOT NULL DEFAULT 0,   -- % giảm giá (0-100)
    final_price     DECIMAL(12,0)   GENERATED ALWAYS AS (
                        ROUND(base_price * (100 - discount_pct) / 100)
                    ) STORED,
    stock_qty       INT UNSIGNED    NOT NULL DEFAULT 0,
    sold_qty        INT UNSIGNED    NOT NULL DEFAULT 0,
    view_count      INT UNSIGNED    NOT NULL DEFAULT 0,
    rating_avg      DECIMAL(2,1)    NOT NULL DEFAULT 0.0,
    rating_count    INT UNSIGNED    NOT NULL DEFAULT 0,
    is_negotiable   TINYINT(1)      NOT NULL DEFAULT 0,    -- Có thể thương lượng giá
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    approved_at     DATETIME,                              -- Duyệt bởi admin
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (shop_id)     REFERENCES shops(id)      ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_shop       (shop_id),
    INDEX idx_category   (category_id),
    INDEX idx_price      (final_price),
    FULLTEXT idx_search  (name, description)
) ENGINE=InnoDB;

-- ============================================================
-- 6. PRODUCT_IMAGES - Hình ảnh sản phẩm
-- ============================================================
CREATE TABLE product_images (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    image_url   VARCHAR(500)    NOT NULL,
    alt_text    VARCHAR(200),
    sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,
    is_cover    TINYINT(1)      NOT NULL DEFAULT 0,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
-- 7. PRODUCT_VARIANTS - Biến thể sản phẩm (màu, size...)
-- ============================================================
CREATE TABLE product_variants (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED NOT NULL,
    name        VARCHAR(100)    NOT NULL,                  -- VD: "Màu Đỏ - Size M"
    sku         VARCHAR(100)    UNIQUE,
    extra_price DECIMAL(12,0)   NOT NULL DEFAULT 0,        -- Giá cộng thêm so với base
    stock_qty   INT UNSIGNED    NOT NULL DEFAULT 0,
    image_url   VARCHAR(500),
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
-- 8. WISHLISTS - Danh sách yêu thích
-- ============================================================
CREATE TABLE wishlists (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_user_product (user_id, product_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 9. CART_ITEMS - Giỏ hàng (lưu DB để sync đa thiết bị)
-- ============================================================
CREATE TABLE cart_items (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED NOT NULL,
    variant_id  BIGINT UNSIGNED DEFAULT NULL,
    quantity    SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_cart (user_id, product_id, variant_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)            ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)         ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 10. COUPONS - Mã giảm giá / Voucher
-- ============================================================
CREATE TABLE coupons (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    shop_id         BIGINT UNSIGNED DEFAULT NULL,          -- NULL = toàn sàn (admin)
    code            VARCHAR(30)     NOT NULL UNIQUE,
    type            ENUM('percent','fixed','free_ship') NOT NULL,
    value           DECIMAL(12,0)   NOT NULL,              -- % hoặc số tiền
    min_order       DECIMAL(12,0)   NOT NULL DEFAULT 0,    -- Đơn tối thiểu
    max_discount    DECIMAL(12,0)   DEFAULT NULL,          -- Giới hạn giảm tối đa
    total_qty       INT UNSIGNED    DEFAULT NULL,          -- Số lần sử dụng tối đa
    used_qty        INT UNSIGNED    NOT NULL DEFAULT 0,
    per_user_limit  TINYINT UNSIGNED NOT NULL DEFAULT 1,
    starts_at       DATETIME        NOT NULL,
    expires_at      DATETIME        NOT NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    INDEX idx_code    (code),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB;

-- ============================================================
-- 11. ORDERS - Đơn hàng
-- ============================================================
CREATE TABLE orders (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_code      VARCHAR(20)     NOT NULL UNIQUE,       -- VD: MS-20240913-0001
    buyer_id        BIGINT UNSIGNED NOT NULL,
    shop_id         BIGINT UNSIGNED NOT NULL,
    address_id      BIGINT UNSIGNED NOT NULL,
    coupon_id       BIGINT UNSIGNED DEFAULT NULL,
    subtotal        DECIMAL(12,0)   NOT NULL,              -- Tổng trước giảm
    discount_amt    DECIMAL(12,0)   NOT NULL DEFAULT 0,
    shipping_fee    DECIMAL(12,0)   NOT NULL DEFAULT 0,
    total_amount    DECIMAL(12,0)   NOT NULL,              -- Thực thanh toán
    status          ENUM(
                        'pending',      -- Chờ xác nhận
                        'confirmed',    -- Đã xác nhận
                        'preparing',    -- Đang đóng gói
                        'shipping',     -- Đang giao
                        'delivered',    -- Đã nhận
                        'completed',    -- Hoàn thành (sau 7 ngày)
                        'cancelled',    -- Huỷ
                        'refunded'      -- Hoàn tiền
                    ) NOT NULL DEFAULT 'pending',
    cancel_reason   VARCHAR(255),
    note            TEXT,                                  -- Ghi chú của người mua
    paid_at         DATETIME,
    shipped_at      DATETIME,
    delivered_at    DATETIME,
    completed_at    DATETIME,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (buyer_id)   REFERENCES users(id)           ON DELETE RESTRICT,
    FOREIGN KEY (shop_id)    REFERENCES shops(id)           ON DELETE RESTRICT,
    FOREIGN KEY (address_id) REFERENCES user_addresses(id)  ON DELETE RESTRICT,
    FOREIGN KEY (coupon_id)  REFERENCES coupons(id)         ON DELETE SET NULL,
    INDEX idx_buyer      (buyer_id),
    INDEX idx_shop       (shop_id),
    INDEX idx_status     (status),
    INDEX idx_order_code (order_code)
) ENGINE=InnoDB;

-- ============================================================
-- 12. ORDER_ITEMS - Chi tiết đơn hàng
-- ============================================================
CREATE TABLE order_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    product_id      BIGINT UNSIGNED NOT NULL,
    variant_id      BIGINT UNSIGNED DEFAULT NULL,
    product_name    VARCHAR(255)    NOT NULL,              -- Snapshot tên SP lúc đặt
    variant_name    VARCHAR(100),
    unit_price      DECIMAL(12,0)   NOT NULL,              -- Giá tại thời điểm đặt
    quantity        SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    total_price     DECIMAL(12,0)   NOT NULL,

    FOREIGN KEY (order_id)   REFERENCES orders(id)           ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)         ON DELETE RESTRICT,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    INDEX idx_order (order_id)
) ENGINE=InnoDB;

-- ============================================================
-- 13. PAYMENTS - Thanh toán
-- ============================================================
CREATE TABLE payments (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT UNSIGNED NOT NULL,
    method          ENUM('cod','bank_transfer','momo','zalopay','vnpay','student_credit')
                        NOT NULL DEFAULT 'cod',
    amount          DECIMAL(12,0)   NOT NULL,
    status          ENUM('pending','processing','success','failed','refunded')
                        NOT NULL DEFAULT 'pending',
    transaction_id  VARCHAR(100),                          -- Mã giao dịch cổng TT
    gateway_resp    JSON,                                  -- Raw response từ cổng
    paid_at         DATETIME,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order         (order_id),
    INDEX idx_transaction   (transaction_id)
) ENGINE=InnoDB;

-- ============================================================
-- 14. REVIEWS - Đánh giá sản phẩm
-- ============================================================
CREATE TABLE reviews (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT UNSIGNED     NOT NULL,
    order_id    BIGINT UNSIGNED     NOT NULL,
    user_id     BIGINT UNSIGNED     NOT NULL,
    rating      TINYINT UNSIGNED    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(150),
    content     TEXT,
    images      JSON,                                      -- Mảng URL ảnh đánh giá
    is_verified TINYINT(1)          NOT NULL DEFAULT 1,   -- Đơn hàng đã hoàn thành
    seller_reply TEXT,
    replied_at  DATETIME,
    created_at  DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_order_product (order_id, product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_user    (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- 15. MESSAGES - Nhắn tin giữa người mua và người bán
-- ============================================================
CREATE TABLE conversations (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    buyer_id    BIGINT UNSIGNED NOT NULL,
    shop_id     BIGINT UNSIGNED NOT NULL,
    product_id  BIGINT UNSIGNED DEFAULT NULL,              -- Hội thoại về SP cụ thể
    last_msg_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_conv (buyer_id, shop_id),
    FOREIGN KEY (buyer_id)   REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (shop_id)    REFERENCES shops(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_buyer (buyer_id),
    INDEX idx_shop  (shop_id)
) ENGINE=InnoDB;

CREATE TABLE messages (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    sender_id       BIGINT UNSIGNED NOT NULL,
    content         TEXT            NOT NULL,
    image_url       VARCHAR(500),
    is_read         TINYINT(1)      NOT NULL DEFAULT 0,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id)       REFERENCES users(id)         ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_sender       (sender_id)
) ENGINE=InnoDB;

-- ============================================================
-- 16. NOTIFICATIONS - Thông báo
-- ============================================================
CREATE TABLE notifications (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    type        VARCHAR(50)     NOT NULL,                  -- order_update, promo, review...
    title       VARCHAR(200)    NOT NULL,
    body        TEXT,
    data        JSON,                                      -- Payload tuỳ loại
    is_read     TINYINT(1)      NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user   (user_id),
    INDEX idx_unread (user_id, is_read)
) ENGINE=InnoDB;

-- ============================================================
-- 17. BANNERS - Quảng cáo / Banner trang chủ
-- ============================================================
CREATE TABLE banners (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(150),
    image_url   VARCHAR(500)    NOT NULL,
    link_url    VARCHAR(500),
    position    TINYINT UNSIGNED NOT NULL DEFAULT 0,
    starts_at   DATETIME,
    expires_at  DATETIME,
    is_active   TINYINT(1)      NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- ============================================================
-- 18. SHIPPING_LOGS - Lịch sử vận chuyển
-- ============================================================
CREATE TABLE shipping_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT UNSIGNED NOT NULL,
    status      VARCHAR(80)     NOT NULL,
    location    VARCHAR(200),
    note        VARCHAR(500),
    logged_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
) ENGINE=InnoDB;

-- ============================================================
-- 19. REPORTS - Báo cáo vi phạm
-- ============================================================
CREATE TABLE reports (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reporter_id     BIGINT UNSIGNED NOT NULL,
    target_type     ENUM('product','shop','user','review') NOT NULL,
    target_id       BIGINT UNSIGNED NOT NULL,
    reason          VARCHAR(100)    NOT NULL,
    description     TEXT,
    status          ENUM('pending','reviewed','resolved','dismissed')
                        NOT NULL DEFAULT 'pending',
    admin_note      TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reporter (reporter_id),
    INDEX idx_target   (target_type, target_id)
) ENGINE=InnoDB;

-- ============================================================
-- 20. PRODUCT_TAGS - Tags tìm kiếm nhanh
-- ============================================================
CREATE TABLE tags (
    id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(60) NOT NULL UNIQUE,
    slug    VARCHAR(70) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE product_tags (
    product_id  BIGINT UNSIGNED NOT NULL,
    tag_id      INT UNSIGNED    NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)     REFERENCES tags(id)     ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- VIEWS hữu ích
-- ============================================================

-- Thống kê shop
CREATE OR REPLACE VIEW v_shop_stats AS
SELECT
    s.id                AS shop_id,
    s.shop_name,
    s.rating_avg,
    s.rating_count,
    s.total_sold,
    COUNT(DISTINCT p.id) AS product_count,
    SUM(CASE WHEN p.stock_qty > 0 THEN 1 ELSE 0 END) AS active_products
FROM shops s
LEFT JOIN products p ON p.shop_id = s.id AND p.is_active = 1
GROUP BY s.id;

-- Sản phẩm đầy đủ thông tin
CREATE OR REPLACE VIEW v_product_full AS
SELECT
    p.*,
    s.shop_name,
    s.is_verified  AS shop_verified,
    c.name         AS category_name,
    c.slug         AS category_slug,
    pi.image_url   AS cover_image
FROM products p
JOIN shops       s  ON s.id = p.shop_id
JOIN categories  c  ON c.id = p.category_id
LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_cover = 1
WHERE p.is_active = 1;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER $$

-- Tạo mã đơn hàng tự động
CREATE PROCEDURE sp_create_order_code(OUT p_code VARCHAR(20))
BEGIN
    DECLARE v_date VARCHAR(8);
    DECLARE v_seq  INT;
    SET v_date = DATE_FORMAT(NOW(), '%Y%m%d');
    SELECT COUNT(*) + 1 INTO v_seq
      FROM orders
     WHERE DATE(created_at) = CURDATE();
    SET p_code = CONCAT('MS-', v_date, '-', LPAD(v_seq, 4, '0'));
END$$

-- Cập nhật rating sản phẩm sau khi có review mới
CREATE PROCEDURE sp_refresh_product_rating(IN p_product_id BIGINT UNSIGNED)
BEGIN
    UPDATE products
    SET rating_avg   = (SELECT ROUND(AVG(rating),1) FROM reviews WHERE product_id = p_product_id),
        rating_count = (SELECT COUNT(*)              FROM reviews WHERE product_id = p_product_id)
    WHERE id = p_product_id;
END$$

DELIMITER ;

-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- Trừ tồn kho khi đặt hàng
CREATE TRIGGER trg_deduct_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products
    SET stock_qty = stock_qty - NEW.quantity,
        sold_qty  = sold_qty  + NEW.quantity
    WHERE id = NEW.product_id;
END$$

-- Cập nhật rating shop khi có review mới
CREATE TRIGGER trg_update_shop_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE shops s
    JOIN products p ON p.id = NEW.product_id
    SET s.rating_avg   = (
            SELECT ROUND(AVG(r.rating),1)
              FROM reviews r JOIN products pp ON pp.id = r.product_id
             WHERE pp.shop_id = s.id
        ),
        s.rating_count = (
            SELECT COUNT(*)
              FROM reviews r JOIN products pp ON pp.id = r.product_id
             WHERE pp.shop_id = s.id
        )
    WHERE s.id = p.shop_id;
END$$

DELIMITER ;

-- ============================================================
-- 21. CURRENCY_RATES - Lịch sử tỷ giá VND/JPY
-- ============================================================
CREATE TABLE IF NOT EXISTS currency_rates (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vnd_to_jpy  DECIMAL(10,6)   NOT NULL,   -- 1 VND = ? JPY
    jpy_to_vnd  DECIMAL(10,4)   NOT NULL,   -- 1 JPY = ? VND
    source      VARCHAR(50)     DEFAULT 'exchangerate-api',
    recorded_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_recorded (recorded_at)
) ENGINE=InnoDB;

-- Tự động xoá dữ liệu cũ hơn 7 ngày
CREATE EVENT IF NOT EXISTS evt_clean_currency
ON SCHEDULE EVERY 1 DAY
STARTS NOW()
DO
  DELETE FROM currency_rates
  WHERE recorded_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
  
SELECT * FROM currency_rates;