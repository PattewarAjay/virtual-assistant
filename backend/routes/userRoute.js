import express from "express"
import { asktoassistant, getCurrentUser, updateUser } from "../controllers/usercontroller.js"
import { isAuth } from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"



const userRouter = express.Router()


userRouter.get('/current', isAuth, getCurrentUser)
userRouter.post('/update', isAuth,upload.single('assistantimage'), updateUser)
userRouter.post('/asktoassistant', isAuth, asktoassistant)
export default userRouter