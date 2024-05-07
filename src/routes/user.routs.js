import { Router } from "express";
import { loginUser, registerUser, logOutUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js";
import { verifyjwt } from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),  
    registerUser
)

router.route("/login").post(
    loginUser
)

router.route("/logout").post( verifyjwt ,logOutUser)

export default router;