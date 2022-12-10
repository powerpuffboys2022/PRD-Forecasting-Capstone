import { NextResponse } from "next/server";
const jose = require("jose");
const secret = process.env.SECRET;

const middleware = async (req) => {
  const { cookies } = req;

  const jwt = cookies.get("authorization_token");
  const url = req.url;

  if(url.includes("/shop")){
    if (!jwt) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const { payload, protectedHeader } = await jose.jwtVerify(
        jwt.value,
        new TextEncoder().encode(process.env.SECRET),
        {
          issuer: "prd",
          audience: "prd",
        }
      );
      return payload.userType === 0 ? NextResponse.next() : NextResponse.redirect(new URL("/notallowed", req.url));
    } catch (e) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if(url.includes("/admin")){
    if (!jwt) return NextResponse.redirect(new URL("/login", req.url));
    try {
      const { payload, protectedHeader } = await jose.jwtVerify(
        jwt.value,
        new TextEncoder().encode(process.env.SECRET),
        {
          issuer: "prd",
          audience: "prd",
        }
      );
      return payload.userType === 1 ? NextResponse.next() : NextResponse.redirect(new URL("/notallowed", req.url));
    } catch (e) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

//   if (url.includes("/shop") || url.includes("/admin")) {
//     if (!jwt) return NextResponse.redirect(new URL("/login", req.url));
//     try {
//       const { payload, protectedHeader } = await jose.jwtVerify(
//         jwt.value,
//         new TextEncoder().encode(process.env.SECRET),
//         {
//           issuer: "prd",
//           audience: "prd",
//         }
//       );
//       return payload.userType === 1 ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.redirect(new URL("/shop", req.url));
//     } catch (e) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

  return NextResponse.next();
};

export default middleware;
