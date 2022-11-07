import { useRouter } from "next/router";
import { useState } from "react";
import { Validator } from "../helpers";

import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import Head from "next/head";

const Register = () => {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [err, setErr] = useState("");

  const register = async () => {
    const router = useRouter()
    // TODO
    // insert & acquire cookie/session token
    setErr("");
    const response = fetch("/api/auth", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            authMode: 1,
            registerData : {
                email,
                userName,
                password
            }
        }),
      }).then((res)=>{
        if(res.status === 409) throw Error("email already used")
        return res;
      }).then((data) => {
        router.push("/");
      })
      .catch((err)=>{
        setErr(err.message)
      })

    // if register success then go to index
  };

  return (
    <div className="bg-rice-pattern h-screen w-full flex justify-center items-center">
        <Head>
        <title>Register</title>
        <meta
          name="description"
          content="A admin web app for Philip Rice Dealer that focuses on Sales Forecasting."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-center">
        <img
          className="w-4/12 m-auto"
          src="https://cdn.discordapp.com/attachments/955281529481883729/1036886425045577758/prd.png"
        ></img>

        <p className="text-sm animate-pulse text-center mt-8 font-inter text-error">{err}</p>

        <div className="mt-4 form-control w-full max-w-xs">
          <label className="label">
            <span className="text-sm font-inter font-medium ">Email</span>
          </label>
          <input
            type="email"
            onChange={(e) => {
                setErr("")
              var val = e.target.value;
              setEmail(val);
            }}
            value={email}
            className={`input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 ${
              !err.includes("email") && Validator(email, ["isEmpty", "isEmail"])
                ? "focus:ring-fuchsia-100"
                : "ring-2 ring-rose-300"
            }`}
          />
        </div>
        <div className="mt-3 form-control w-full max-w-xs">
          <label className="label">
            <span className="text-sm font-inter font-medium ">
              User Name
            </span>
          </label>
          <input
            type="text"
            onChange={(e) => {
              var val = e.target.value;
              setUserName(val);
            }}
            value={userName}
            className={`input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 ${
              Validator(userName, ["isEmpty"])
                ? "focus:ring-fuchsia-100"
                : "ring-2 ring-rose-300"
            }`}
          />
        </div>
        <div className="mt-3 form-control w-full max-w-xs relative">
          <label className="label">
            <span className="text-sm font-inter font-medium">Password</span>
          </label>
          <div className="label absolute top-0 right-0">
            <div className="tooltip tooltip-left sm:tooltip-right font-inter" data-tip="show / hide password">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                checked={hidePass}
                onChange={(e) => {
                  setHidePass(e.target.checked);
                }}
              />
              <RiEyeFill className="swap-off fill-current w-4 h-4" />
              <RiEyeCloseFill className="swap-on fill-current w-4 h-4" />
            </label>
            </div>
          </div>
          <input
            type={hidePass ? "password" : "text"}
            onChange={(e) => {
              var val = e.target.value;
              setPassword(val);
            }}
            value={password}
            className={`input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 ${
              Validator(password, ["isEmpty", "min"], 8)
                ? "focus:ring-fuchsia-100"
                : "ring-2 ring-rose-300"
            }`}
          />
        </div>
        <button
          disabled={
            !Validator(email, ['isEmail']) ||
            !Validator(userName, ['isEmpty']) ||
            !Validator(password, ['min'], 8)
          }
          onClick={() => register()}
          className="btn mt-8 btn-sm btn-primary btn-wide "
        >
          Register
        </button>
        <p className="mt-5 text-sm">
          Already have an account?{" "}
          <a className="text-primary cursor-pointer" onClick={()=>router.push('/login')}>
            Login instead.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
