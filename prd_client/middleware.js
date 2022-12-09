import { NextResponse } from "next/server";
console.log("IMPORTED NEXT RESPONSE")
const jose = require("jose")
console.log("IMPORTED JOSE")
const secret = process.env.SECRET;
console.log("SECRET ENV")

const middleware = async (req) => {
    console.log("WORKING!")
    const { cookies } = req;
    console.log("COOKIE")

    const jwt = cookies.get("authorization_token")
    const url = req.url;
    console.log("JWT",url)

    // if(url.substr(url.length - 1) === "/"){
    //     if(!jwt){
    //         return NextResponse.redirect(new URL("/login", req.url))
    //     }

    //     try{
    //         const { payload, protectedHeader} = await jose.jwtVerify(jwt.value, new TextEncoder().encode(process.env.SECRET), {
    //             issuer: 'prd',
    //             audience: 'prd',
    //           })
              
    //         // return NextResponse.next();
    //         return payload.userType === 1 ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.redirect(new URL("/shop", req.url))
    //     }catch(e){ 
    //         return NextResponse.redirect(new URL("/login", req.url)) 
    //     }
    // }


    return NextResponse.next();
}

export default middleware;