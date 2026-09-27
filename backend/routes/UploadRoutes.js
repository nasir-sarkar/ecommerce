import express from 'express'
import upload from '../middleware/upload.js'
import { uploadSingle, uploadMultiple } from '../controllers/UploadController.js'

const router = express.Router()

router.post('/',          upload.single('image'),          uploadSingle)
router.post('/multiple',  upload.array('images', 3),       uploadMultiple)

export default router