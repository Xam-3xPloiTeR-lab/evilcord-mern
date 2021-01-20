import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors'
import mongoData from './mongoData.js'
import Pusher from 'pusher'

// app config
const app = express()
const port = process.env.PORT || 1337

const pusher = new Pusher({
    appId: "1141206",
    key: "a92e0921af39228a0668",
    secret: "7460e369a4ac96011bf9",
    cluster: "ap2",
    useTLS: true
  });

//middleware
app.use(express.json())
app.use(cors())
// db config
const mongoURI = 'mongodb+srv://admin:112233aA@cluster0.mj86f.mongodb.net/discordDB?retryWrites=true&w=majority';

mongoose.connect(process.env.MONGODB_URI ||mongoURI, {
    useCreateIndex: true,
    useNewUrlParser:  true,
    useUnifiedTopology: true
})

mongoose.connection.once('open',()=>{

    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) =>{
        if (change.operationType === 'insert'){
            pusher.trigger('channels','newChannel',{
                'change': change
            })
        } else if (change.operationType === 'update'){
            pusher.trigger('conversation','newMessage',{
                'change': change
            })
        } else {
            console.log('error while triggering pusher')
        }
    })
})
//api routes
app.get('/',(req, res) => res.status(200).send('Xam 3xPloiTeR'))

app.post('/new/channel', (req,res) => {
    const dbData = req.body
    
    mongoData.create(dbData, (err,data) => {
        if (err) {
            res.status(500).send(err)
        } else{
            res.status(201).send(data)
        }
        
    })
})

app.get('/get/channelList',(req,res)=>{
    mongoData.find((err, data)=>{
        if (err) {
            res.status(500).send(err)
        } else{
            let channels = []

            data.map((channelData)=>{
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo)
            })
            res.status(200).send(channels)
        }
    })
})

app.post('/new/message',(req,res)=>{
    const newMessage = req.body
    mongoData.updateOne(
        { _id: req.query.id},
        { $push: {conversation: newMessage}},
        (err, data)=>{
            if(err){
                res.status(500).send(err)
            } else {
                res.status(201).send(data)
            }
        }
    )
})

app.get('/get/data', (req,res) => {
 mongoData.find((err,data) => {
     if(err){
         res.status(500).send(err)
     } else{
         res.status(200).send(data)
     }
 })
})

app.get('/get/conversation', (req,res) => {
    mongoData.find({_id:req.query.id},(err,data) => {
        if(err){
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
   })

if(process.env.Node_ENV==="production"){
    app.use(express.static('discord-clone/build'))
}

//listning
app.listen(port, () => console.log(`listning on localhost:${port}`))