const express = require('express')
//const app = express()
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

/*Configure multer with validation option */
const uploadAvatar = multer({
    limits:{
        fileSize: 4000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('file must be a jpeg, jpg or png'))
          }
          cb(undefined, true)
    }
})
/*Upload images for users as their avatar after authentication, use
  sharp npm module for cropping and resizing and then saving as png*/
router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req,res)=>{
      const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
      req.user.avatar = buffer
      await req.user.save()
      res.send(req.user)
} , (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})
/*Delete the avatar for a user after authenticating them*/
router.delete('/users/me/avatar', auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})
/*Return the associated avart of the authenticted user, img tag need to resolve from binary data*/
router.get('/users/avatar/me', auth,async (req,res) =>{
    try{
        const user = req.user
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send({error: 'No profile picture found associated to the profile'})
    }
})
/*Create a new user */
router.post('/users',async (req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(500).send(e)
    }
 })
 /*Get user profile*/
 router.get('/users/me', auth, async (req,res)=>{
     res.send(req.user)
 })
 /*Get user by user id*/
//  router.get('/users/:id', async (req,res)=>{
//      try{
//          const _id = req.params.id
//          const user = await User.findById(_id)
//          if(!user){
//              return res.status(400).send()
//          }
//          res.send(user)
//      }catch(e){
//          res.status(500).send()
//      }
//  })
 /*Update the user by authentication*/
 router.patch('/users/me', auth, async (req,res)=>{
     const updates = Object.keys(req.body)
     const _id = req.params.id
     const allowUpdates = ['name','email','password','age']
     const isValidOperation = updates.every((udpate)=>allowUpdates.includes(udpate))
     if(!isValidOperation){
         return res.status(400).send('error: invalid update request')
     }
     try{
        //  const user = await User.findById(_id)
        //  if(!user){
        //     return res.status(404).send()
        //  }
        //  updates.forEach((update)=>user[update] = req.body[update])
         updates.forEach((update)=>req.user[update] = req.body[update])
         await req.user.save()
         /*Commenting this as findByUdAndUpdate will bypass mongoose middleware
         const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})*/
         res.send(req.user)
     }catch(e){
         res.status(500).send()
     }
 })
 /*Delete a user by it's id (not by passing in req uri but fetching upon auth)*/
 router.delete('/users/me', auth, async(req,res)=>{
     try{
        //   const _id = req.params.id
        //   const user = await User.findByIdAndDelete(req.user._id)
        //   if(!user){
        //       return res.status(404).send()
        //   }
          await req.user.remove()
          res.send(req.user)
     }catch(e){
          res.status(401).send()
     }
 })
/*Find a user by email and password*/
 router.post('/users/login', async(req,res)=>{
     try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
     }catch(e){
        res.status(400).send('Error occurred while logging into the system, please check your credentials and try again')
     }
 })
 /*Log out a logged in user*/
 router.post('/users/logout', auth, async(req,res) => {
     try{
         req.user.tokens = req.user.tokens.filter((token)=>{
             return token.token != req.token
         })
         await req.user.save()
         res.send('message: logged out successfully')
     }catch(e){
        res.status(500).send()
     }
 })

 router.post('/users/logoutAll',auth, async (req,res)=>{
     try{
         req.user.tokens = []
         await req.user.save()
         res.send('message: all sessions are logged out')
     }catch(e){
         res.status(500).send(e)
     }
 })

 module.exports = router