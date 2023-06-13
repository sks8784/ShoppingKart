class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr
    }

    search(){
        const keyword=this.queryStr.keyword//keyword variable now has the value of keyword
        ? {
            name:{
                $regex:this.queryStr.keyword,// $regex is mongoDB operator
                $options:"i",// it means it is case insensitive
            },
        }
        : {};


        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy={...this.queryStr};//using this queryStr is not used as reference.i.e, any chnages made in queryCopy will not effect queryStr

        //Removing some query fields for category
        const removeFields=["keyword","page","limit"];
        removeFields.forEach((key)=> delete queryCopy[key]);

        //Filter for Price and Rating
    
        let queryStr=JSON.stringify(queryCopy);//converting to string
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

        this.query=this.query.find(JSON.parse(queryStr));//converted back to object and find method used
        
        
        return this;
    }

    //Pagination(No. of items we want to display per page)
    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page)||1;

        const skip=resultPerPage*(currentPage-1);//no. of products to skip in different pages

        this.query=this.query.limit(resultPerPage).skip(skip)

        return this;
    }
    
};

module.exports=ApiFeatures