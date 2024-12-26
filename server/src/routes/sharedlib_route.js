import express from 'express'
import { addCategory, addCourse, addFile, getCategory, getCourses, getFiles, removeCategory, removeCourse, removeFile } from '../controllers/sharedlib_controller.js'
import multer from 'multer'


const router = express.Router()

router.get('/course_codes', getCategory)
router.get('/course_codes/:categoryId/courses', getCourses)
router.get('/course_codes/:categoryId/courses/:courseId/files', getFiles)
router.post('/course_codes/add', addCategory)
router.post('/course_codes/:categoryId/courses/add', addCourse)

router.post('/course_codes/:categoryId/courses/:courseId/files/add', addFile)
router.post('/course_codes/:categoryId/remove', removeCategory)
router.post('/course_codes/:categoryId/courses/:courseId/remove', removeCourse)
router.post('/course_codes/:categoryId/courses/:courseId/files/:fileId/remove', removeFile)

export default router;