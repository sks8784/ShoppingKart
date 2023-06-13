const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//Create Product--Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") { //if there is only single image then its type will be string , so this condition works at that time
        images.push(req.body.images);
    } else { // if there are multiple images then it will be an array of images , so this condition will work at that time
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {

        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }// this uploads the images which where initially on our local system to cloudinary and creates a link for the images

    req.body.images = imagesLinks; // here actually we replace the link of images which was initially link of our local system by cloudinary link which we have created for each image using above for loop
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();
    // const products=await Product.find();
    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });


});


//Get all products -- Admin
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,

    });

});


//Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    // if(!product){
    //     return res.status(500).json({
    //         success:false,
    //         message:"Product not found"
    //     })
    // }

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});


//Update product--Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Updating images start here
    let images = [];

    if (typeof req.body.images === "string") { //if there is only single image then its type will be string , so this condition works at that time
        
        images.push(req.body.images);
    } else { // if there are multiple images then it will be an array of images , so this condition will work at that time
        images = req.body.images;
    }
    //

    if (images !== undefined) {//means atleast one image is there then execute this

        //Deleting Images from Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
       
        
        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {

        
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }
        


        req.body.images=imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
});

//Delete a Product--Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    //Deleting Images from Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })

});


//Create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());//checking if user id already exists in reviews array. If it exists, then it means no new reviews has to be created for the user otherwise we have to create new review for the new user

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) { //if reviewed previously then we will change that particular user's rating and comment
                rev.rating = rating,
                    rev.comment = comment
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;

    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg = avg + rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});


//Get all reviews of a product 
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })

})


//Delete a review-- Admin
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId); //here we are getting product id using req.query.productId

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString() // here we are getting review id using req.query.id
    );

    let avg = 0;
    reviews.forEach(rev => {
        avg = avg + rev.rating;
    });

    
    let ratings = 0;
    if (reviews.length === 0) {
        ratings = 0;
    }
    else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;


    await Product.findByIdAndUpdate(req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            userFindAndModify: false
        }

    );

    res.status(200).json({
        success: true,
    });

})