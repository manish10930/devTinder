
const express=require("express")

const appRouter=express.Router();



appRouter.post("/signup", async (req, res) => {
    const user = new User(req.body);

    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    user.password = hashedPassword;
    console.log(hashedPassword);
    try {
        validateSignup(req);
        await user.save();
        res.send("user is added successfully !!");
    }
    catch (error) {

        if (error.code === 11000) {
            res.status(400).send("Email is already registered");
        } else {
            res.status(500).send(error.message);
        }
    }



});


module.exports={appRouter}
