// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const cookie = require("cookie");
const jose = require("jose");
import crypto from "crypto";

export default async function handler(req, res) {
  res.status(200).json({ message : "Nothing Here Lol!" });
}
