const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const socket = require('socket.io');
const jwt=require('jsonwebtoken');
const e = require('express');
const config=require('./config');
const port = process.env.PORT || 3000 ;
let users;
let count;
let chatRooms;
let messagesArray = [];
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const MongoClient = mongodb.MongoClient;
const cors=require('cors');
app.use(cors());

const dbURL = '--mongo connect url--'
MongoClient.connect(dbURL, { useNewUrlParser: true,useUnifiedTopology: true } ,(err, Database) => {
  if(err)
  {
    console.log(err);
    return false;
  }

  console.log("Connected to MongoDB");
  const db = Database.db("Chat_System");
  chatRooms = db.collection("chatRooms");
  userChat = db.collection("userChat");

  const server = app.listen(port, () => {
    console.log("Server started on port " + port);
  });

  const io = socket.listen(server);

  io.sockets.on('connection', (socket) => {

    socket.on('join', (data) => {
      socket.join(data.room);
      chatRooms.findOne({name: data.room}, (err, foundRoom) => {
        if(!foundRoom)
        {
          chatRooms.insertOne({name: data.room, messages: []});
          let chatRoomName = data.room;
          let buyerUsername = chatRoomName.substr(0, chatRoomName.indexOf('-'));
          let sellerUsername = chatRoomName.split('-').pop();
          userChat.updateOne({username: buyerUsername},
            { $push: {chatRoomsTimestamp: {chatroom: chatRoomName, otherUser: sellerUsername, timestamp:'no'}}},
             (err, res) => {
              if(err)
              {
                console.log(err);
                return false;
              }
            }
           );

           userChat.updateOne({username: sellerUsername},
             { $push: {chatRoomsTimestamp: {chatroom: chatRoomName, otherUser: buyerUsername,timestamp: 'no' }}},
              (err, res) => {
               if(err)
               {
                 console.log(err);
                 return false;
               }
             }
            );
        }
      });
    });

    socket.on('message', (data) => {
      io.in(data.room).emit('new message', {user: data.user, message: data.message});
      chatRooms.updateOne({name: data.room}, { $push: { messages: { user: data.user, message: data.message, timestamp: new Date() } } }, (err, res) => {
        if(err){
          console.log(err);
          return false;
        }
        console.log("added");
        let chatRoomName = data.room;
        let buyerUsername = chatRoomName.substr(0, chatRoomName.indexOf('-'));
        let sellerUsername = chatRoomName.split('-').pop();
        userChat.updateOne({username: buyerUsername, "chatRoomsTimestamp.chatroom" : chatRoomName},
        {$set : {"chatRoomsTimestamp.$.timestamp" : new Date()}});
        userChat.updateOne({username: sellerUsername, "chatRoomsTimestamp.chatroom" : chatRoomName},
        {$set : {"chatRoomsTimestamp.$.timestamp" : new Date()}});
      });
    });

    socket.on('typing', (data) => {
      socket.broadcast.in(data.room).emit('typing', {data: data, isTyping: true});
    } );
  });
});

app.post('/chat/register', (req, res) => {
    let user1 = {
    username: req.body.name,
    password: req.body.password,
    chatRoomsTimestamp: []
  };
  userChat.findOne({username:req.body.name},(err,user)=>{
    if(err){
        res.json({success: false,message:err.message})
    }  
    else if(!user){
        userChat.insertOne(user1, (err, User) =>{
            if(err)
            {
              res.json({success: false,message:err.message})
            }else{
                var token = jwt.sign({
                    user: user1
                  }, config.secret, {
                    expiresIn: '7d'
                  });
                  res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                  });
            }
          });
    }else if(user){
        res.json({success: false,message:'User already exists'})
    }
  })
});

app.post('/chat/login', (req, res) => {
    var password= req.body.password,
    name= req.body.name;
    userChat.findOne({username:name},(err,user)=>{
        if(err){
            res.json({success: false,message:err.message})
        }  
        else if(!user){
            res.json({success: false,message:'User does not exists'})            
        }else if(user){
            if(user.password==password){
                var token = jwt.sign({
                    user: user
                  }, config.secret, {
                    expiresIn: '7d'
                  });
                  res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                  });
            }else{
                res.json({success: false,message:'Invalid password'})            
            }
        }
      })
});


app.get('/chatroom/:room', (req, res, next) => {
    let room = req.params.room;
    chatRooms.find({name: room}).toArray((err, chatroom) => {
      if(err) {
            console.log(err);
            return false;
        }
        else if(chatroom.length==0)
        {
          res.json([{message:'No Messages Yet'}])
        }
        else
        {
        res.json(chatroom[0].messages);
        }
    });
});

app.get('/allusers',(req, res, next) => {
    userChat.find().toArray((err, userlist) => {
        if(err){
            res.json({success:false,message:err.message})
        }
        else if(userlist.length==0)
        {
            res.json({success:false,message:'No users found'})
        }
        else
        {
            if(userlist[0].chatRoomsTimestamp==undefined){
                res.json({success:false,message:'No Chats Yet'})
            }
            else
            {
                res.json({success:true,message:userlist})
            }
        }
    })
})