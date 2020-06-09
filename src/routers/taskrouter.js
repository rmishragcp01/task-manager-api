const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
/*Create a new task with the owner*/
router.post('/tasks', auth, async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id})
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(500).send()
    }
})
/*Get all the tasks post authentication, it has two approaches and both are valid, prefer the virtual view approach*/
/*/tasks?completed=true&limit=10&skip=0&sortBy=createdAt:desc */
router.get('/tasks',auth, async (req,res)=>{
   try{
      //const tasks = await Task.find({owner: req.user._id})
      const match = {}
      const sort = {}
      if(req.query.completed){
          match.completed = req.query.completed === 'true'
      }
      if(req.query.sortBy){
          const parts = req.query.sortBy.split(':')
          sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
      }
      await req.user.populate({
          path: 'tasks',
          //using short hand syntax
          match,
          options: {
              //Will be ignored by Mongoose if not provided or NaN
              //Limit and skip are native options to Mongoose
              limit: parseInt(req.query.limit),
              skip: parseInt(req.query.skip),
              sort
          }
      }).execPopulate()
      res.send(req.user.tasks)
    //   if(!tasks){
    //       res.status(404).send()
    //   }
    //   res.send(tasks)
   }catch(e){
      console.log(e)
      res.status(404).send()
   }
})
/*Get task by id post authentication*/
router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
       const task = await Task.findOne({_id: _id, owner: req.owner._id})
       if(!task){
           return res.status(404).send()
       }
       res.send(task)
    }catch(e){
       res.status(500).send()
    }
})
/*Update task by id post authentication*/
router.patch('/tasks/:id', auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const _id = req.params.id
    const allowUpdates = ['description','completed']
    const isValidOperation = updates.every((udpate)=>allowUpdates.includes(udpate))
    if(!isValidOperation){
        return res.status(400).send('error: invalid update request')
    }
    try{
         const task = await Task.findOne({_id: _id, owner: req.user._id})
         if(!task){
            return res.status(404).send()
         }
         updates.forEach((update)=>task[update] = req.body[update])
         await task.save()
        /*Commenting this, as findByUdAndUpdate would not invoke the middleware
        const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})*/
        res.send(task)
    }catch(e){
        res.status(500).send()
    }

})
/*Delete a task by it's id */
router.delete('/tasks/:id', auth, async (req,res)=>{
    try{
         const _id = req.params.id
         const task = await Task.findOneAndDelete({_id: _id, owner: req.user._id})
         if(!task){
             return res.status(404).send()
         }
         res.send(task)
    }catch(e){
         res.status(500).send()
    }
})

module.exports = router