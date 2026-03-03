import express from 'express'
import { getAllCourse, getCourseId } from '../controllers/courseController.js'

const courseRounter = express.Router()

courseRounter.get('/all', getAllCourse)
courseRounter.get('/:id', getCourseId)

export default courseRounter;