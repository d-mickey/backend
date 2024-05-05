import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";



const registerUser = asyncHandler( async (req, res) => {
    // get user details form frontend / postman
    const {username, email, fullname, password} = req.body
    
    // validation - fields not empty
    if ([username, email, fullname, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required.")
    }

    // check if user already exist
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User already exist.")
    }

    // check for files
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 1) {
        req.files.coverImage.path = coverImageLocalPath;
    }

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required.")
    }

    // upload files to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new apiError(400, "Avatar is required.")
    }
    
    // create user object - create entry in db
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
    })

    // check for user creation and remove password and refresh token form response
    const newUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!newUser) {
        throw new apiError(500, "User creation failed.")
    }

    // return response
    return res.status(201).json(
        new apiResponse(201, newUser, "User Registered Successfully.")
    )

} )

export {registerUser}