import db from '../../config/db.js';

// ── Thuật toán dự đoán đơn giản (Linear Regression) ──
const predictNext = (data, stepsAhead = 1) => {
  const n = data.length;
  if (n < 2) return null;

  // Tính Linear Regression
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  data.forEach((val, i) => {
    sumX  += i;
    sumY  += val;
    sumXY += i * val;
    sumX2 += i * i;
  });

  const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Dự đoán giá trị tiếp theo
  const predictions = [];
  for (let s = 1; s <= stepsAhead; s++) {
    const predicted = slope * (n - 1 + s) + intercept;
    const trend = slope > 0 ? 'increase' : slope < 0 ? 'decrease' : 'stable';
    const confidence = Math.min(95, Math.max(50,
      100 - Math.abs(slope / (sumY / n)) * 1000
    ));
    predictions.push({
      step: s,
      label: s === 1 ? 'Ngày mai' : 'Ngày kia',
      predicted_jpy_to_vnd: parseFloat(predicted.toFixed(4)),
      trend,
      confidence: parseFloat(confidence.toFixed(1)),
      change_pct: parseFloat(
        ((predicted - data[n - 1]) / data[n - 1] * 100).toFixed(2)
      ),
    });
  }
  return predictions;
};

// ── LẤY TỶ GIÁ HIỆN TẠI ─────────────────────────────
export const getCurrentRate = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT vnd_to_jpy, jpy_to_vnd, recorded_at
       FROM currency_rates
       ORDER BY recorded_at DESC LIMIT 1`
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Chưa có dữ liệu tỷ giá!' });
    }
    res.json({ rate: rows[0] });
  } catch (err) {
    console.error('getCurrentRate error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── LẤY LỊCH SỬ 7 NGÀY (gộp theo giờ để nhẹ) ────────
export const getRateHistory = async (req, res) => {
  try {
    // Gộp theo từng giờ — giảm số điểm dữ liệu trả về
    const [rows] = await db.query(`
      SELECT
        DATE_FORMAT(recorded_at, '%Y-%m-%d %H:00:00') AS time_slot,
        ROUND(AVG(jpy_to_vnd), 4) AS jpy_to_vnd,
        ROUND(AVG(vnd_to_jpy), 6) AS vnd_to_jpy,
        MIN(jpy_to_vnd) AS min_rate,
        MAX(jpy_to_vnd) AS max_rate
      FROM currency_rates
      WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY time_slot
      ORDER BY time_slot ASC
    `);
    res.json({ history: rows });
  } catch (err) {
    console.error('getRateHistory error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── DỰ ĐOÁN TỶ GIÁ 1-2 NGÀY TỚI ─────────────────────
export const predictRate = async (req, res) => {
  try {
    // Lấy dữ liệu trung bình mỗi ngày trong 7 ngày qua
    const [rows] = await db.query(`
      SELECT
        DATE(recorded_at)        AS date,
        ROUND(AVG(jpy_to_vnd), 4) AS avg_rate
      FROM currency_rates
      WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(recorded_at)
      ORDER BY date ASC
    `);

    if (rows.length < 3) {
      return res.status(400).json({
        message: 'Cần ít nhất 3 ngày dữ liệu để dự đoán!'
      });
    }

    const rateValues = rows.map(r => parseFloat(r.avg_rate));
    const predictions = predictNext(rateValues, 2);

    // Thống kê 7 ngày
    const max7d = Math.max(...rateValues);
    const min7d = Math.min(...rateValues);
    const avg7d = (rateValues.reduce((a, b) => a + b, 0) / rateValues.length).toFixed(4);
    const current = rateValues[rateValues.length - 1];
    const change7d = (((current - rateValues[0]) / rateValues[0]) * 100).toFixed(2);

    res.json({
      predictions,
      stats: {
        max_7d:    max7d,
        min_7d:    min7d,
        avg_7d:    parseFloat(avg7d),
        current,
        change_7d: parseFloat(change7d),
        data_points: rows.length,
      },
      daily_data: rows,
    });
  } catch (err) {
    console.error('predictRate error:', err);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

// ── ĐỔI TIỀN ─────────────────────────────────────────
export const convertCurrency = async (req, res) => {
  try {
    const { amount, from } = req.query;
    // from = 'VND' hoặc 'JPY'

    if (!amount || !from) {
      return res.status(400).json({ message: 'Thiếu amount hoặc from!' });
    }

    const [rows] = await db.query(
      `SELECT vnd_to_jpy, jpy_to_vnd FROM currency_rates
       ORDER BY recorded_at DESC LIMIT 1`
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Chưa có tỷ giá!' });
    }

    const { vnd_to_jpy, jpy_to_vnd } = rows[0];
    const amt = parseFloat(amount);
    let result;

    if (from === 'VND') {
      result = { from: 'VND', to: 'JPY', amount: amt, converted: parseFloat((amt * vnd_to_jpy).toFixed(2)) };
    } else {
      result = { from: 'JPY', to: 'VND', amount: amt, converted: parseFloat((amt * jpy_to_vnd).toFixed(0)) };
    }

    res.json({ result, rate: { vnd_to_jpy, jpy_to_vnd } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!' });
  }
};