import cron   from 'node-cron';
import axios  from 'axios';
import db     from '../../config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

// ── Gọi API và lưu vào DB ────────────────────────
const fetchAndSave = async () => {
  try {
    const KEY = process.env.EXCHANGE_RATE_API_KEY;
    if (!KEY) {
      console.error('❌ Thiếu EXCHANGE_RATE_API_KEY trong .env!');
      return;
    }

    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${KEY}/pair/JPY/VND`
    );

    if (res.data.result !== 'success') {
      console.error('❌ API trả về lỗi:', res.data['error-type']);
      return;
    }

    const jpy_to_vnd = parseFloat(res.data.conversion_rate.toFixed(4));
    const vnd_to_jpy = parseFloat((1 / jpy_to_vnd).toFixed(6));

    await db.query(
      `INSERT INTO currency_rates (vnd_to_jpy, jpy_to_vnd, source)
       VALUES (?, ?, 'exchangerate-api')`,
      [vnd_to_jpy, jpy_to_vnd]
    );

    // Xoá dữ liệu cũ hơn 7 ngày
    await db.query(
      `DELETE FROM currency_rates
       WHERE recorded_at < DATE_SUB(NOW(), INTERVAL 7 DAY)`
    );

    console.log(
      `✅ [${new Date().toLocaleTimeString('vi-VN')}] ` +
      `1 JPY = ${jpy_to_vnd} VND | ` +
      `1 VND = ${vnd_to_jpy} JPY`
    );

  } catch (err) {
    console.error('❌ Currency fetch error:', err.message);
  }
};

// ── Khởi động job ────────────────────────────────
export const startCurrencyJob = () => {
  const KEY = process.env.EXCHANGE_RATE_API_KEY;
  if (!KEY) {
    console.warn('⚠️  EXCHANGE_RATE_API_KEY chưa được cấu hình — bỏ qua currency job');
    return;
  }

  console.log('💱 Currency job started');
  console.log('📊 Lịch chạy: mỗi 30 phút (≈ 1,440 req/tháng — trong giới hạn 1,500)');

  // Chạy ngay lần đầu khi server khởi động
  fetchAndSave();

  // Sau đó chạy mỗi 30 phút: '*/30 * * * *'
  cron.schedule('*/30 * * * *', fetchAndSave);
};