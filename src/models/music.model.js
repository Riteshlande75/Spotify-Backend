const mongoose = require('mongoose');



const musicSchema = new mongoose.Schema({

    uri:{
        type: String,
        require: true,

    },

    title:{
        type: String,
        require: true,


    },
     
    artist:{

        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true,
    }
})
const musicModel = mongoose.model("music",musicSchema)

module.exports = musicModel;