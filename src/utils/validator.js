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

const validateProfileEditData = (req) => {

   const data =req.body;

   const ALLOWED_FIELDS=["firstName","lastName","password","age","skills","about"];

   const fields=Object.keys(data);

  
  
   const isValid=fields.every((fields)=>ALLOWED_FIELDS.includes(fields));  

    return isValid;
}

// const  connectionRequestValidation=(status)=>{
//    // const status=req.body.status;
//    // console.log("status-->",status);
//    // const Nstatus="Interested";
//    if(status!=="Ingored" || status!=="Interested")
//    {
//          throw Error(`Invalid status--> ${status} !!`);
//    }
//    else{
//          return true;
//    }

// }

const connectionRequestValidation = (status) => {
  console.log("status-->",status);
   const ALLOWED_FIELDS = ["Ignored", "Interested"];

   
   const isValid=ALLOWED_FIELDS.includes(status);
   console.log("isValid--->",isValid);
   return isValid;


   
};

module.exports = { validateSignup, validateProfileEditData, connectionRequestValidation };
module.exports =  {validateSignup ,validateProfileEditData,connectionRequestValidation}