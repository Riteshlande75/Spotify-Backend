const express = require('express');
const multer = require('multer');
const authMiddleware = require("../middlewares/auth.middleware");
const musicController = require("../controller/music.controller");


const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });


router.post("/upload", authMiddleware.authArtist, upload.single('file'), musicController.createMusic);
router.post("/album", authMiddleware.authArtist, musicController.createAlbum);


router.get("/", authMiddleware.authUser,musicController.getAllMusics);
router.get("/album",authMiddleware.authUser,musicController.getAllAlbums);
router.get("/album/:albumdId", authMiddleware.authUser,musicController.getAlbumsId)

module.exports = router;


