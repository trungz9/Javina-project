import express from 'express'
import { trackView, getViewHistory } from '../controllers/interaction.controller.js'
import protect from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/view/:id',  protect, trackView)      // POST /api/interactions/view/:productId
router.get('/history',    protect, getViewHistory)  // GET  /api/interactions/history

export default router