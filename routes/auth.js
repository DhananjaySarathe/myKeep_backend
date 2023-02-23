const express = require('express');
const router = express.Router();      //We created an const named Router to create various routes
const User = require('../models/User')
const {body,validationResult} =require('express-validator');  //email and names pr validation lagane ke lia hai ye
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser')

const JWT_SECRET = 'Dhananjayisgood$boy';

// Route 1:  Create a User using POST "/api/auth/". Doesn't require Auth
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be atleast 5 characters').isLength({ min: 5}),
], async (req,res)=>{         //Agar ham is function ko async mark nahi krenge toh aage await bhi use nhi krr skte
    //if there are errors return bad requrets and error
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array() });
    }

    try {
        //Check if user with this email already exists
        let user = await User.findOne({email:req.body.email})
        if(user)
        {
            return res.status(400).json({success,error:"Given email already exists:"})
        }
        //await jab krte jab koi promise return krta ho mtlb jab tkk bo le naa aae ruko ..
        const salt = await bcrypt.genSalt(10);        
        const secPass = await bcrypt.hash(req.body.password, salt);                  
    
    
        User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        }).then(user=>{
            const data={
                user:{
                    id:user.id
                }
            }
            const authtoken = jwt.sign(data,JWT_SECRET);
            console.log(authtoken);
            success=true;
            res.json({success,authtoken})
            })
        .catch(err=> {console.log(err)
        res.json({success,error: 'Internal Server Error',message: err.message})})   //Agr email phele se hogi toh bo ye message throw krr dega...
        // console.log(req.body);
        // const user = User(req.body);
        // user.save()
        // res.json(req.body)
    } catch (error) {
        
    }


})

// Route 2: Authenticate a user using: POST "/api/auth/createUser". No Login Required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be black').exists(),
],async (req,res)=>{
    let success=false;
    // if there are errors return bad requres with error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
     }

    const {email,password} =  req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success=false;
            return res.status(400).json({error: "Please try login with correct Credentials"})
        }
        
        const passwordCompare =await bcrypt.compare(password, user.password); //It will compare password (String ) with user.password (hash) .. hash ko automatic convert krr lega
        if(!passwordCompare){
            success=false
            return res.status(400).json({success,error: "Please try login with correct Credentials"})
        }

        const data={
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET);
        console.log(authtoken);
        success=true;
        res.json({success,authtoken})  

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");      
    }
});

//ROUTE 3: Get loggedin User Details using POST "/api/auth/getuser" Login Required
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
      const userId = req.user.id;  //as hamn fetchuser mai user id ko user.id mai append kia tha
        const user = await User.findById(userId).select("-password")
        console.log(user)
        res.send(user);
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");      
    }
})

module.exports = router











