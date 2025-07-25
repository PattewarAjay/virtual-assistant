import express from "express"
import { logOut, signIn, signUp } from "../controllers/authcontroller.js"

const authRouter = express.Router()

authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.get('/logout', logOut)
export default authRouter