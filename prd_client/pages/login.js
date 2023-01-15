import { useRouter } from "next/router";
import { useState } from "react";
import { Validator } from "../helpers";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import Head from "next/head";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = (e) => {
    setLoading(true);
    const response = fetch("/api/auth", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authMode: 0,
        loginData: {
          email,
          password,
        },
      }),
    })
      .then((res) => {
        if (res.status === 404) {
            toast.warning("User not found", { position : toast.POSITION.TOP_RIGHT })
            throw Error("User not found");
        }
        if (res.status === 403) {
            toast.warning("Invalid Credential", { position : toast.POSITION.TOP_RIGHT })
            throw Error("Invalid Credential");
        }
        return res;
      })
      .then((data) => {
        data.json().then((data) => {
            toast.success("Signed In", { position : toast.POSITION.TOP_RIGHT })
            router.push(data.toUrl)
        })
      })
      .catch((err) => {
        setErr(err.message);
      })
      .finally((d) => {
        setLoading(false);
      });
    e.preventDefault();
  };

  return (
    <div className="bg-rice-pattern h-screen w-full flex justify-center items-center">
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
        <title>Login</title>
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
      <div className="flex flex-col justify-center card glass p-8 shadow-md">
        <img
          className="w-4/12 m-auto"
          src="https://cdn.discordapp.com/attachments/955281529481883729/1036886425045577758/prd.png"
        ></img>

        <p className="text-sm animate-pulse text-center mt-8 font-inter text-error">
          {err}
        </p>

        <form>
          <div className="mt-8 form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text font-inter font-medium ">Email</span>
            </label>
            <input
              type="text"
              tabIndex={1}
              required
              onChange={(e) => {
                setErr("");
                var val = e.target.value;
                setEmail(val);
              }}
              value={email}
              className={`input input-sm bg-base-200/50 w-full hover:bg-base-100 max-w-xs focus:ring-4 hover:ring-4 ${
                !err.includes("not found") &&
                Validator(email, ["isEmpty", "isEmail"])
                  ? "ring-fuchsia-100"
                  : "ring-rose-300"
              }`}
            />
          </div>
          <div className="mt-3 form-control w-full max-w-xs relative">
            <label className="label">
              <span className="text-sm font-inter font-medium">Password</span>
            </label>
            <div className="label absolute top-0 right-0">
              <div
                className="tooltip tooltip-left font-inter"
                data-tip={`${hidePass ? "show" : "hide"} password`}
              >
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
              tabIndex={2}
              type={hidePass ? "password" : "text"}
              onChange={(e) => {
                var val = e.target.value;
                setErr("");
                setPassword(val);
              }}
              value={password}
              className={`input input-sm bg-base-200/50 w-full hover:bg-base-100 max-w-xs focus:ring-4 hover:ring-4 ${
                err.includes("Invalid") ||
                Validator(password, ["isEmpty", "min"], 8)
                  ? "ring-fuchsia-100"
                  : "ring-rose-300"
              }`}
            />
            <label className="label">
                <span></span>
                <a
                tabIndex={4}
                className="text-primary cursor-pointer text-sm"
                onClick={() => router.push(`/forgot?email=${email}`)}
              >
                forgot password
              </a>
            </label>
              
          </div>

          <button
            tabIndex={3}
            disabled={
              !Validator(email, ["isEmail"]) || !Validator(password, ["min"], 8)
            }
            onClick={(e) => {
              login(e);
            }}
            className={
              "btn mt-8 btn-sm btn-primary btn-wide " +
              `${loading ? "loading" : ""}`
            }
          >
            Login{" "}
          </button>
        </form>
        {/* <p className="mt-5 text-sm">
          Don&apos;t have an account?{" "}
          <a
            tabIndex={4}
            className="text-primary cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register Now
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
