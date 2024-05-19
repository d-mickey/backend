import { Router } from "express";
import { loginUser, registerUser, logOutUser, updateAvatar, getWatchHistory, getUserChannelProfile, changeCurrentPassword, updateUserDetails, updateCoverImage } from "../controllers/user.controllers.js";
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
router.route("/change-password").post(verifyjwt, changeCurrentPassword)
router.route("/update-details").patch(verifyjwt, updateUserDetails)
router.route("/update-avatar").patch(verifyjwt, upload.single("avatar"), updateAvatar)
router.route("/update-cover-image").patch(verifyjwt, upload.single("coverImage"), updateCoverImage)
router.route("/c/:username").get(verifyjwt, getUserChannelProfile)
router.route("/watch-history").get(verifyjwt, getWatchHistory)


export default router;