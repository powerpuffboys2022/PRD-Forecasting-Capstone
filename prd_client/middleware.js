import { NextResponse } from "next/server";
const jose = require("jose")
const secret = process.env.SECRET;

const middleware = async (req) => {
    const { cookies } = req;

    const jwt = cookies.get("authorization_token")
    const url = req.url;

    if(url.substr(url.length - 1) === "/"){
        if(!jwt){
            return NextResponse.redirect(new URL("/login", req.url))
        }

        try{
            const { payload, protectedHeader} = await jose.jwtVerify(jwt.value, new TextEncoder().encode(process.env.SECRET), {
                issuer: 'prd',
                audience: 'prd',
              })

            return NextResponse.next();
        }catch(e){ 
            return NextResponse.redirect(new URL("/login", req.url)) 
        }
    }


    return NextResponse.next();
}

export default middleware;