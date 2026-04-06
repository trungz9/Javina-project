import express from 'express';
import {
  getCurrentRate, getRateHistory,
  predictRate, convertCurrency
} from '../controllers/currency.controller.js';

const router = express.Router();

router.get('/current',  getCurrentRate);   // Tỷ giá hiện tại
router.get('/history',  getRateHistory);   // Lịch sử 7 ngày
router.get('/predict',  predictRate);      // Dự đoán 1-2 ngày tới
router.get('/convert',  convertCurrency);  // Đổi tiền

export default router;