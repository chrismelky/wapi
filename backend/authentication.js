const User = require('./model/user').User;

exports.validator = async(decoded, request) => {
    return await User.findOne({mobileNumber:decoded.mobileNumber,isVerified:true}).
      then((user)=>{
         if(user){
             return { isValid:true,userId:user.userId};
         }
         else{
             return { isValid:false};
         }
      }).catch(error => {
        console.log(error);
        return { isValid:false};
      });
}