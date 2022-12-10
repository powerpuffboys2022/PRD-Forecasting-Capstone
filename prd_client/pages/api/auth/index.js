import dbConnect from "../../../services/MongoDb_Service";
const bcrypt = require('bcrypt');
const cookie = require("cookie");
const User = require("../../../models/User")
const jose = require("jose");
const generator = require('generate-password');
import Mailer from "../../../services/Mailer"
import { dateMomentBeautify } from "../../../helpers"

dbConnect();

const secret = new TextEncoder().encode(process.env.SECRET);

const setAuthCookie = async (res, payload, expires) => {
    const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("prd")
    .setAudience("prd")
    .setExpirationTime("24h")
    .sign(secret);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authorization_token", jwt, {
      httpOnly: true,
      maxAge: expires,
      sameSite: "strict",
      path: "/",
    })
  );
}

const handler = async (req, res) => {
  try {
    let { authMode, loginData, registerData, recoverData } = req.body;
    // authMode 0 - SignIn
    // authMode 1 - Register
    // authMode -1 - Sign out
    // authMode -2 - sent & generate temporary password

    if(authMode === undefined) return res.status(400).json({ message : "missing authentication mode(authMode)"})
    
    if(authMode === 0 && loginData){
        
        const userData = await User.findOne({ email : loginData.email });
        if(!userData) return res.status(404).json({ message : `User (${loginData.email}) not found`});

        if(!await bcrypt.compare(loginData.password, userData.password)) return res.status(403).json({ message : "Invalid Password"})

        await setAuthCookie(res, userData.toObject(), Number.parseInt(process.env.AUTHORIZATION_EXPIRATION));

        return res.status(200).json({ message : "authorized", toUrl : userData.userType === 1 ? "/admin" : "/shop"})
    }

    if(authMode === 1 && registerData){
        const mustNotExist = await User.findOne({ email : registerData.email });
        if(mustNotExist) return res.status(409).json({message : "user with that email already exist"})

        const password = await bcrypt.hash(registerData.password, 10);

        const save = await User.create({
            ...registerData,
            password
        });

        await setAuthCookie(res, save.toObject(), Number.parseInt(process.env.AUTHORIZATION_EXPIRATION));

        return res.status(201).json(save)
    }

    if(authMode === -1){
        await setAuthCookie(res, {}, new Date(0));
        return res.status(200).json({ message : "signed out"})
    }

    if(authMode === -2 && recoverData){
        
        const userData = await User.findOne({ email : recoverData.email });
        if(!userData) return res.status(404).json({ message : `User (${recoverData.email}) not found`}); 

        var genPass = generator.generate({
            length: 10,
            numbers: true
        });

        const genPassHashed = await bcrypt.hash( genPass, 10 );

        const updateUser = await User.updateOne({ _id : userData._id }, { $set : { password : genPassHashed } });

        await Mailer( recoverData.email , {
                subject : "Temporary Password",
                template_name : "forgotPassword",
                userName : userData.userName,
                tempPass : genPass,
                time_string : dateMomentBeautify(new Date())
            } );

        return res.status(200).json({ message : "Password Changed"})
    }
    
    return res.status(400).json({ message : "Server did nothing lol."})
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Error 😥",
    });
  }
};

export default handler;