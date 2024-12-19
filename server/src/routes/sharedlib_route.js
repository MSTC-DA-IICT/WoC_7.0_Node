import express from 'express'
import { addCategory, addCourse, addFile, getCategory, getCourses, getFiles, removeCategory, removeCourse, removeFile } from '../controllers/sharedlib_controller.js'

const router = express.Router()

router.get('/course_codes', getCategory)
router.get('/course_codes/:categoryId/courses', getCourses)
router.get('/course_codes/:categoryId/courses/:coursesId/files', getFiles)
router.post('/course_codes/add', addCategory)
router.post('/course_codes/:categoryId/courses/add', addCourse)
router.post('/course_codes/:categoryId/courses/:coursesId/files/add', addFile)
router.post('/course_codes/:categoryId/remove', removeCategory)
router.post('/course_codes/:categoryId/courses/:coursesId/remove', removeCourse)
router.post('/course_codes/:categoryId/courses/:coursesId/files/:fileId/remove', removeFile)

export default router