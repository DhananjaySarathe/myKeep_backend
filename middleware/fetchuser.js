var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Dhananjayisgood$boy';
// imp commit id: ba0a0517a5730fb3ff8888037f17f6f796496a17

const fetchuser = (req,res,next)=>{
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user=data.user;  //user id ko req.user mai append kia hai 
        next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
}

module.exports = fetchuser;