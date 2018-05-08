const User = require('../models/user').User;

exports.validator = async(decoded, request) => {
    return await User.findOne({phoneNumber:decoded.phoneNumber,isVerified:true}).
      then((user)=>{
         if(user){
             request.userId = user._id;
             return { isValid:true,artifacts:user};
         }
         else{
             return { isValid:false};
         }
      }).catch(error => {
        console.log(error);
        return { isValid:false};
      });
}