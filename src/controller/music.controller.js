const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const {uploadFile} = require("../services/storage.service");
const albumModel = require("../models/album.model")

async function createMusic(req , res) {
    

     const token = req.cookies.token;

     if(!token){

        return res.status(401).json({message:"Unauhtorized"})
     }
 try {

 
   const decoded = jwt.verify(token,process.env.JWT_SECRET)

   if (decoded.role !== "artist"){
    return res.status(403).json({message: "you dont have access to create a music"})
   }

  
const { title } = req.body;
const file = req.file;

if (!file) {
  return res.status(400).json({ message: "Audio file is required (multipart field name: file)" });
}

const result = await uploadFile(file.buffer.toString('base64'))


const music = await musicModel.create({
    uri: result.url,
    title,
    artist : decoded.id,
})
 

res.status(201).json({
    message:"Music created successfullly",
    music:{
        id:music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
    }

})

} 
 catch(err){

    console.log(err);

 return res.status(401).json({message:"Unauhtorized"})
 }
}


async function createAlbum(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "you dont have access to create an album" });
        }

        const { title, musicIds } = req.body;

        if (!title || !Array.isArray(musicIds)) {
            return res.status(400).json({ message: "title and musicIds[] are required" });
        }

        const album = await albumModel.create({
            title,
            artist: decoded.id,
            music: musicIds,
        });

        return res.status(201).json({
            message: "album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                music: album.music,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { createMusic, createAlbum };
