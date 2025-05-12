const mongoose=require('mongoose');

async function connectToMongoBb(url){
    return mongoose.connect(url);
}

module.exports={
    connectToMongoBb,
}