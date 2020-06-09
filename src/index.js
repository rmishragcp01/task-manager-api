/*Standard express.js work required*/
const express = require('express') //standar import
const app = express() //instantiate express object, could be the modules.export object rendered by express.js
require('./db/mongoose')
const userRouter = require('./routers/userrouter')
const taskRouter = require('./routers/taskrouter')
const port = process.env.PORT

/*demo code only, remove/comment later*/
// const multer = require('multer')
// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000
//   },
//   fileFilter(req,file,cb){
//     if(!file.originalname.match(/\.(doc|docx)$/)){
//       return cb(new Error('file must be a microsoft word document'))
//     }
//     cb(undefined, true)
//   }
// })
// app.post('/upload', upload.single('upload'), (req,res)=>{
//     res.send()
// }, (error, req, res, next)=>{
//      res.status(400).send({error: error.message})
// })  
/*json() being a standard middleware function exported by express, will parse the json from request body
this function recognizes the POST request body as a JSON object and make it available for direct use where
a JSON object is needed such as while instatiating the mongoose User model before saving to the database.
*/
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
// const Task = require('./models/task')
// const User = require('./models/user')
// const mainUser = async()=>{
//     const user = await User.findById('5ec9fddb1ae1774a78a205ce')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// const main = async ()=>{
//  const task = await Task.findById('5ec9fe091ae1774a78a205d0')
//  await task.populate('owner').execPopulate()
//  console.log(task.owner)
// }
//mainUser()
/*Start the node server at a given port.
  Default port is 3000 else passed via an
  environment variable*/
app.listen(port,()=>{
    console.log('index.js::node server is up and running at port '+port)
})