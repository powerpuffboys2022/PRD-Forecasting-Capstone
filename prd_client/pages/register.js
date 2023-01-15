import { useRouter } from "next/router";
import { useState } from "react";
import { Validator } from "../helpers";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import Head from "next/head";

const Register = () => {
  const router = useRouter();

  const REGISTER_ADMIN_SECRET = process.env.REGISTER_ADMIN_SECRET

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(0);
  const [secret, setSecret] = useState("");

  const register = async () => {
    setLoading(true);
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
        registerData: {
          email,
          userName,
          password,
          userType,
          contact,
          address
        },
      }),
    })
      .then((res) => {
        if (res.status === 409) throw Error("email already used");
        return res;
      })
      .then((data) => {
        router.push(userType === 1 ? "/admin" : "/shop");
      })
      .catch((err) => {
        setErr(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-rice-pattern min-h-screen py-8 w-full flex justify-center items-center">
        <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        limit={1}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Head>
        <title>Register</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <link itemProp="image" href="cover.png" />
        <meta itemProp="name" content="Philip Rice Dealer" />
        <meta
          itemProp="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta
          itemProp="image"
          content="cover.png"
        />

        <meta
          property="og:url"
          content="https://prd-forecasting-capstone.vercel.app"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Philip Rice Dealer" />
        <meta
          property="og:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta
          property="og:image"
          content="cover.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Philip Rice Dealer" />
        <meta
          name="twitter:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta
          name="twitter:image"
          content="cover.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-center glass md:1/3 lg:w-1/4 card p-4 shadow-md">
        <img
          className="w-4/12 m-auto"
          src="https://cdn.discordapp.com/attachments/955281529481883729/1036886425045577758/prd.png"
        ></img>
        <p className="text-sm animate-pulse text-center mt-8 font-inter text-error">
          {err}
        </p>
        <form>
          <div className="mt-3 form-control w-full">
            <label className="label">
              <span className="text-sm font-inter font-medium ">Email</span>
            </label>
            <input
              type="email"
              onChange={(e) => {
                setErr("");
                var val = e.target.value;
                setEmail(val);
              }}
              value={email}
              className={`input input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                !err.includes("email") &&
                Validator(email, ["isEmpty", "isEmail"])
                  ? "focus:ring-fuchsia-100"
                  : "ring-2 ring-rose-300"
              }`}
            />
          </div>
          <div className="mt-3 form-control w-full">
            <label className="label">
              <span className="text-sm font-inter font-medium ">User Name</span>
            </label>
            <input
              type="text"
              onChange={(e) => {
                var val = e.target.value;
                setUserName(val);
              }}
              value={userName}
              className={`input input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                Validator(userName, ["isEmpty"])
                  ? "focus:ring-fuchsia-100"
                  : "ring-2 ring-rose-300"
              }`}
            />
          </div>

          <div className="mt-3 form-control w-full">
            <label className="label">
              <span className="text-sm font-inter font-medium ">Contact</span>
            </label>
            <input
              type="text"
              onChange={(e) => {
                var val = e.target.value;
                setContact(val);
              }}
              value={contact}
              className={`input input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                Validator(contact, ["isEmpty"])
                  ? "focus:ring-fuchsia-100"
                  : "ring-2 ring-rose-300"
              }`}
            />
          </div>
          <div className="mt-3 form-control w-full">
            <label className="label">
              <span className="text-sm font-inter font-medium ">Address</span>
            </label>
            <textarea
              rows="3"
              type="text"
              onChange={(e) => {
                var val = e.target.value;
                setAddress(val);
              }}
              value={address}
              className={`textarea bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                Validator(address, ["isEmpty"])
                  ? "focus:ring-fuchsia-100"
                  : "ring-2 ring-rose-300"
              }`}
            />
          </div>

          <div className="mt-3 form-control w-full relative">
            <label className="label">
              <span className="text-sm font-inter font-medium">Password</span>
            </label>
            <div className="label absolute top-0 right-0">
              <div
                className="tooltip tooltip-left font-inter"
                data-tip={`${hidePass ? "show" : "hide"} password`}
              >
                <label className="swap rounded-full swap-rotate">
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
              className={`input input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                Validator(password, ["isEmpty", "min"], 8)
                  ? "focus:ring-fuchsia-100"
                  : "ring-2 ring-rose-300"
              }`}
            />
          </div>
          <div className="form-control mt-3">
            <label className="label cursor-pointer">
              <span className="label-text">Register as Admin</span>
              <input onChange={(e) => { setUserType( e.target.checked ? 1 : 0) }} type="checkbox" className="toggle toggle-sm" checked={ userType === 1 } />
            </label>
          </div>
          {
            userType === 1 && <div className="mt-3 form-control w-full relative">
            <label className="label">
              <span className="text-sm font-inter font-medium">Secret</span>
            </label>
            <input
              type={"password"}
              onChange={(e) => {
                var val = e.target.value;
                setSecret(val);
              }}
              value={secret}
              placeholder="Enter Admin SECRET"
              className={`input input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                Validator(secret, ['equals'], 0, 0, REGISTER_ADMIN_SECRET)
                  ? "focus:ring-fuchsia-100"
                  : "ring-2 ring-rose-300"
              }`}
            />
            <label className="label">
              <span className="text-xs font-inter font-medium">{ Validator(secret, ['equals'], 0, 0, REGISTER_ADMIN_SECRET) ? "" : "Enter Admin secret code"}</span>
            </label>
          </div>
          }
          <button
            disabled={
              !Validator(email, ["isEmail"]) ||
              !Validator(userName, ["isEmpty"]) ||
              !Validator(password, ["min"], 8) || (userType === 1 ? !Validator(secret, ['equals'], 0, 0, REGISTER_ADMIN_SECRET) : false)
              
            }
            onClick={(e) => {
              e.preventDefault();
              register();
            }}
            className={
              "btn mt-4 btn-sm btn-primary btn-wide w-full" +
              `${loading ? "loading" : ""}`
            }
          >
            Register
          </button>
        </form>
        <p className="mt-5 text-sm">
          Already have an account?{" "}
          <a
            className="text-primary cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login instead.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
