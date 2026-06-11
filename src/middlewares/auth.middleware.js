const jwt = require("jsonwebtoken");


async function authArtist(req ,res,next) {
    

    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({message:"Unauhtorized"})
    }

    try {
        
        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        if(decoded.role !== "artist"){
            return res.status(403).json({message :"tou dont have access"})
        }
    } catch (err) 
    {
        console.log(err);
        return res.status(401).json({message :"Unauhtorized"})
        
    }
}

module.exports = {authArtist}