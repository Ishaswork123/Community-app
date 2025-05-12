// Required modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
// const Community=require('./Model/community')
// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/fyp_1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Community Schema




const communitySchema = new mongoose.Schema({
    communityName: String,
    Bio: String,
    creator: String,
    participants: [String],
    messages: [{
        senderId: String,
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});
const Community = mongoose.model('Community', communitySchema);

// Middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
    const communities = await Community.find();
    res.render('login', { communities, username: 'Guest' });
});

app.post('/std/join-community', async (req, res) => {
    const { communityId, username } = req.body;
    await Community.findByIdAndUpdate(communityId, { $addToSet: { participants: username } });
    res.redirect(`/chat/${communityId}`);
});
app.get('/std/dashboard',(req,res)=>{
                           return res.render("login_1");
});
app.post('/std/dashboard', async (req, res) => {
    try {
      const { communityName, createUserName, Bio } = req.body;
  
      if (!communityName || !createUserName) {
        return res.status(400).send("All fields are required");
      }
  
      const newCommunity = new Community({
        communityName,
        Bio,
        creator: createUserName,
        participants: [createUserName]
      });
  
      await newCommunity.save();
      res.render('screen', { community: newCommunity, username: createUserName });
    } catch (error) {
      console.error("Error saving community:", error);
      res.status(500).send("Server Error");
    }
  });
  

app.get('/chat/:communityId', async (req, res) => {
    const community = await Community.findById(req.params.communityId);
    res.render('screen', { community, username: 'Guest' });
});

app.post('/send-message', async (req, res) => {
    const { communityId, username, message } = req.body;
    const newMessage = { senderId: username, content: message, timestamp: new Date() };
    await Community.findByIdAndUpdate(communityId, { $push: { messages: newMessage } });
    io.to(communityId).emit('newMessage', newMessage);
    res.redirect(`/chat/${communityId}`);
});

// Socket.IO Handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinCommunity', (communityId) => {
        socket.join(communityId);
    });

    socket.on('sendMessage', async ({ communityId, message, userId }) => {
        const newMessage = { senderId: userId, content: message, timestamp: new Date() };
        await Community.findByIdAndUpdate(communityId, { $push: { messages: newMessage } });
        io.to(communityId).emit('newMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5012;
server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
