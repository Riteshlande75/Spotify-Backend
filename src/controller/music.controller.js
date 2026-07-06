const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const {uploadFile} = require("../services/storage.service");
const albumModel = require("../models/album.model")

async function createMusic(req , res) {
      
const { title } = req.body;
const file = req.file;

if (!file) {
  return res.status(400).json({ message: "Audio file is required (multipart field name: file)" });
}

const result = await uploadFile(file.buffer.toString('base64'))


const music = await musicModel.create({
    uri: result.url,
    title,
    artist : req.user.id,
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


async function createAlbum(req, res) {
        const { title, musicIds } = req.body;

        if (!title || !Array.isArray(musicIds)) {
            return res.status(400).json({ message: "title and musicIds[] are required" });
        }

        const album = await albumModel.create({
            title,
            artist: req.user.id,
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
   
}


async function getAllMusics(req ,res) 

{
    const musics =await musicModel.find()

    res.status(200).json({
        message : "music fetched successfully",
        music : musics,
    })
}

async function   getAllAlbums(req , res) {

    const albums = await albumModel.find().select("title artist").populate("artist" , "username email")
    
    res.status(200).json({
        message :"Album fetched succesfully",
        albums : albums,
    })
}


async function getAlbumsId(req ,res) {

    const albumId = req.params.albumId;

    const album = await albumModel.find(albumId).populate("artits","username email").populate("musics")

    return res.status(200).json({
        messagge : "album fetched successfully",
        album: album,
    })
    
}

module.exports = { createMusic, createAlbum ,getAllMusics , getAllAlbums ,getAlbumsId};


