import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"



// generate token
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        console.log(user)
        console.log(userId);
        const accessToken = jwt.sign(
                {
                    _id: user._id,
                    email: user.email,
                    username: user.username
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
                }
            )
        console.log(accessToken);

        return accessToken

    } catch (error) {
        throw new apiError(500, " Something went wrong while generating access token.")
    }
}





// user registration
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
    // console.log(req.files)
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
        "-password"
    )

    if (!newUser) {
        throw new apiError(500, "User creation failed.")
    }

    // return response
    return res.status(201).json(
        new apiResponse(201, newUser, "User Registered Successfully.")
    )

} )





// user login
const loginUser = asyncHandler( async (req, res) => {

    // console.log(req.body)

    // get user details form frontend / postman
    const {username, email, password} = req.body
    // console.log(username, email);

    if (!(username || email)) {
        throw new apiError(400, "All fields are required.")
    }


    // find user with provided email or uasername
    // console.log(username, email)
    const user = await User.findOne({
        $or: [{username}, {email}]
            // username: username,
            // email: email
    })
    // console.log(user);

    if (!user) {
        throw new apiError(400, "User does not exist.")
    }

    // check password
    if (!password) {
        throw new apiError(400, "Password is required.")
    }


    const passwordCheck = await async function (password) {
        bcrypt.compare(password, this.password)
    }
    // console.log(password);

    if (!passwordCheck) {
        throw new apiError(400, "Incorrect password.")
    }

    console.log(user);
    // generate access token
    const accessToken = await generateToken(user._id)

    // information about user to be send to frontend
    const loggedInUser = await User.findById(user._id).select("-password")

    // cookies
    const options = {
        httpOnly : true,
        secure : true
    }

    // sending response 
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new apiResponse(
            200,{
                loggedInUser
            },
            "User logged In Successfully."
        )
    )

    
})





// log out user
const logOutUser = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                accessToken : undefined
            }
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(
        new apiResponse(
            200,
            {},
            "User logged out successfully."
        )
    )

})




export {registerUser, loginUser, logOutUser}