
const express = require('express')
const app = express
const cors = require('cors')
require('dotenv').config()
const mongoose = requier('mongoose')
const {Schema} = mongoose

mongoose.connect(process.env.MONGO_URI)

const UserSchema = new Schema({
  username:String,    
})
const User = mongoose.modle('User',UserSchema)

const ExerciseSchema = new Schema({
  user_id:{type:String,require:true},
  description:String,
  duration:Number,
  date:Date,
})
const Ecercise = mongoose.modle('Exercise',ExerciseSchema)

app.use(cors)
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/api/users',async (req,res)=>{
  const users = await User.find({}).select('_id username')
  if(!users){
    res.send('No users')
  }else{
    res.jason(users)
  }
})

app.post('/api/users',async(req,res)=>{
  console.log(req.body)
  const userObj = new User({
    username:req.body.username
  })
  try{
    const user = await userObj.save()
    console.log(user)
    res.jason(user)
  }catch{
console.log(err)

  }
})

app.post('/api/users/:_id/ecereises',async (req,res)=>{
  const id=req.params._id 
  const {descripation,duration,date}=req.body
  try{
    const user = await User.findById(id)
    if(!user){
      res.send('Could not find the user')
    }else{
      const execrciseObj= new Ecercise({
        user_id:user._id,
        descripation,
        duration,
        date:date ? new Date(date) : new Date()
      })
  }
  const ecercise = await execrciseObj.save()
  res.jason({
    _id:user.id,
    username:user.username,
    descripation:user.descripation,
    date: new Date(exercise.date).toDateString()
  })

  }catch(err){
    console.log(err)
    res.send('no saving')
  }
})

app.get('api/users/:_id/logs',async(req,res)=>{
  const {from,to,limit}=req.query
  const id =  req.params._id
  const user = await User.findById()
  if(!user){
    res.send('no user')

  }
  let dateObj ={}
  if(from){
dateObj['$gte'] = new Date(from)
  }
  if(to){
    dateObj['$lte'] = new Date(to)
  }
  if(from || to){
    filter.date = dateObj
  }

  const exercise = await Ecercise.find(filter).limit(+limit ?? 500)
  const log=exercise.map(e=>({
    descripation:e.descripation,
    duration:e.duration,
    date:e.date.toDateString()
  }))
res.json({
  username:user.username,
  count:exercise.length,
  _id:user._id,
  log
})
})

const listener = app.listener(process.env.PORT || 3000,()=>{
  console.log('Your app is listening on port' + listener.address().port )
})