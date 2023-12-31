const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    
   
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

     //creating a token
    sendToken(user, 201, res);
    
});

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email: email }).select("+password");//we have to find using both email and password....becoz we have done select:false in userSchema thats why here we have to write select like this

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    //if password matches then create a token
    sendToken(user, 200, res);


});



//Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {

    // res.cookie("token", null, {
    //     expire: new Date(Date.now()),
    //     httpOnly: true
    // });
    

    // res.status(200).json({
    //     sucess: true,
    //     message: "Logged Out"
    // });


    // const options={
    //     expires:new Date(0),
    //     httpOnly:true
    // };
    // const val = null;
    // res.status(200).cookie('token', val, options).json({
    //     success:true,
    //     message:"Logged Out"
    // });

    res.status(200).clearCookie('token');
    res.redirect('/');
});


//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {


    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Get Reset Password Token
    const resetToken = user.getResetPasswordToken();


    await user.save({ validateBeforeSave: false });//saving the resetPasswordToken

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const resetPasswordUrl = `https://shoppingkartecommerce.netlify.app/password/reset/${resetToken}`;

    const message = `Your reset password token is : \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it.`;

    try {

        await sendEmail({
            email: user.email,
            subject: `ShoppingKart Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

})


//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }, //expire time should be greater than current time then only password can be reset
    })

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

});


//Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});


//Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});


//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };

    }

    
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });


    res.status(200).json({
        success: true,
    });
});



//Get all users (admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});


//Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }


    res.status(200).json({
        success: true,
        user,
    });
});



//Update user role (admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });


    res.status(200).json({
        success: true,
    });
});



//Delete user (admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {



    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});