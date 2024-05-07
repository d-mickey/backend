import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const verifyjwt = asyncHandler( async(req, res, next) => {
    try {
        const token = req.cookie?.accessToken || req.header("Authentication")?.replace("Bearer", "")

        if (!token) {
            throw new apiError(401, "Unauthorized request.")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password")

        if (!user) {
            throw new apiError(401, "Invalid access token.")
        }

        req.user = user
        next()

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token.")
    }
})

export {verifyjwt}