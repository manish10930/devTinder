// const jwt = require("jsonwebtoken");
// const User=require("../models/user");

// const {userAuth}= async(req,res,next)=>{
// const {token}=req.cookies;

// try{

//     if(!token){
//         return res.status(401).send("Please login first");
//     }
//     const decoded=jwt.verify(token,"DEVTINDER@123");
//     const {_id}=decoded;
//     const user=await User.findById(_id);

//     if(!user){
//         return res.status(401).send("User not found !");
//     }

//     req.user=user;
//     next();

// }
// catch(error){
//     res.status(500).send(error.message);

// }

// }
// module.exports={userAuth}

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    try {
        if (!token) {
            return res.status(401).send("Please login first");
        }

        const decoded = jwt.verify(token, "DEVTINDER@123");
        const { _id } = decoded;
        const user = await User.findById(_id);

        if (!user) {
            return res.status(401).send("User not found!");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = userAuth;