const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const userSchema = mongoose.Schema({
    name: {
         type: String,
         required: true
    },
    email: {
         type: String,
         unique: true,
         required: true,
         lowercase: true,
         trim: true,
         validate(value){
             if(!validator.isEmail(value)){
                 throw new Error('Invalid Email')
             }
         }
    },
    password: {
         type: String,
         required: true,
         trim: true,
         minlength: 7,
         validate(value){
             if(value.toLowerCase().includes('password') || value.toLowerCase().includes('passwords')){
                 throw new Error('Password may not contain word password')
             }
         }
    },
    age: {
         type: Number,
         default: 0,
         validate(value){
              if(value < 0){
                  throw new Error('Age must be a +ve number')
              }
         }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'randomstringsignature')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to find the user')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

userSchema.pre('save', async function(next){
   const user = this
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password,8)
   }
   next()
})

/*Delete user task middleware when user is deleted */
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
const User = mongoose.model('User',userSchema)
module.exports = User