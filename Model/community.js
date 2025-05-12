
const mongoose=require('mongoose');



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