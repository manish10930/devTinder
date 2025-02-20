const validator=require('validator');

const validateSignup = (req) => {

    const { firstName,lastName, email, password,age,gender,dateOfBirth,photoUrl,about,skills } = req.body;


    // if (!firstName || !lastName || !email || !password || !age
    //     || gender || !dateOfBirth ) {

    //         throw Error("All fields are mandatory !");
    //     }
      if(firstName.length<3 || firstName.length>20){
        throw Error("First Name should be between 3 to 20 characters");
     }
     else if(validator.isStrongPassword(password)===false){
        throw Error("Password should be strong");
     }

     else if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
     }

}

module.exports = { validateSignup }