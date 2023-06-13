module.exports=theFunc=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
};
//it is basically try catch ...instead of writing try catch again and again in productControllers, we made a separate file for it