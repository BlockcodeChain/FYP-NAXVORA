import express from 'express'
import isAuth from "../middleware/isAuth.js"
import {getCurrentUser } from "../controller/user.controller.js"
const userrouter=express.Router()

userrouter.post("/current-user",isAuth,getCurrentUser)

export default userrouter