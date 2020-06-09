const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req,res,next) =>{
   try{
       const token = req.header('Authorization').replace('Bearer ','')
       const verified = jwt.verify(token, process.env.TOKEN_SIGNING_STRING)
       const user = await User.findOne({_id:verified._id,'tokens.token':token})
       if(!user){
           throw new Error()
       }
       req.token = token
       req.user = user
       next()
   }catch(e){
       res.status(401).send({error:'Please Authenticate'})
   }    
}

module.exports = auth