import { useRouter } from "next/router";
import { useState } from "react";
import { Validator } from "../helpers";

import Head from "next/head";

const Forgot = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [isSent, setIsSent] = useState(false);
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
        authMode: -2,
        recoverData: {
          email,
        },
      }),
    })
      .then((res) => {
        if (res.status === 404) throw Error("User not found");
        return res;
      })
      .then((data) => {
        setIsSent(true);
      })
      .catch((err) => {
        setErr(err.message);
      })
      .finally((d) => {
        setLoading(false);
      });
  };

  return (
    <div className="bg-rice-pattern h-screen w-full flex justify-center items-center">
      <Head>
        <title>Forgot</title>
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

        <p className="text-sm animate-pulse text-center mt-8 font-inter text-error">
          {err}
        </p>

        <form>
          {isSent ? (
            <p className="font-inter text-sm break-all">
              We've sen't your temporary password to your email
            </p>
          ) : (
            <div className="mt-8 form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text font-inter font-medium ">
                  Email
                </span>
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
          )}

          <div className="w-full flex justify-center">
            <button
              tabIndex={3}
              disabled={!Validator(email, ["isEmail"]) || loading}
              onClick={(e) => {
                e.preventDefault();
                if (isSent) router.push("/login");
                else login(e);
              }}
              className={
                "btn mt-8 btn-sm btn-primary btn-wide" +
                `${loading ? "loading" : ""}`
              }
            >
              {loading
                ? "sending"
                : isSent
                ? "Go to login"
                : "Send Temporary Password"}
            </button>
          </div>
        </form>
        {!isSent && (
          <p className="mt-5 text-sm">
            Remembered your password?{" "}
            <a
              tabIndex={4}
              className="text-primary cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login Now
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Forgot;
