import express from 'express'
import {googleAuth ,logOut } from "../controller/auth.controller.js"
const router=express.Router()

router.post("/googleAuth",googleAuth)
router.post("/logout",logOut)
export default router