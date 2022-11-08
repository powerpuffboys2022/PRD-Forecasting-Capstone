import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";

import { storage } from "../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { Validator, dateToBeutify } from "../helpers";

import Head from "next/head";

const userProfile = () => {
  const router = useRouter();

  const [newImg, setNewImg] = useState();

  const [loading, setLoading] = useState();
  const [uploading, setUploading] = useState();
  const [hidePass, setHidePass] = useState(true);
  const [err, setErr] = useState("");

  const [imgUrl, setImgUrl] = useState();
  const [userData, setUserData] = useState();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleUpload = (image_file) => {
    const storageRef = ref(storage, `/profiles/${uuidv4()}_${image_file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image_file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const percent = Math.round(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // );
        // setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFireStoreURL(url);
        });
      }
    );
  };

  const loadUser = () => {
    setLoading(true)
    const response = fetch("/api/prd/userInfo", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setUserName(data.userName);
      }).finally((e)=>{
        setLoading(false);
      });
  };

  useEffect(() => { loadUser(); }, []);

  return (
    <div className="bg-rice-pattern w-full flex justify-center">
      <Head>
        <title>Profile</title>
        <meta
          name="description"
          content="A admin web app for Philip Rice Dealer that focuses on Sales Forecasting."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="font-inter w-full mx-4 md:mx-0 md:w-1/3 mt-12">
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img src="https://placeimg.com/192/192/people" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-medium">Jervx / Profile</p>
            <p className="text-xs">{!userData ? "?" : userData.email} | Joined {!userData ? "?" : dateToBeutify(new Date(userData.dateJoined))}</p>
          </div>
        </div>
        {
            loading && <progress className="progress w-full mt-2"></progress>
        }
        <form>
          <div className="mt-8 form-control w-full">
            <label className="label">
              <span className="label-text font-inter font-medium ">Username</span>
            </label>
            <input
              readOnly={loading}
              type="text"
              tabIndex={1}
              required
              onChange={(e) => {
                setErr("");
                var val = e.target.value;
                setUserName(val);
              }}
              value={userName}
              className={`input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                !err.includes("not found") && Validator(userName, ["isEmpty"])
                  ? "ring-fuchsia-100"
                  : "ring-rose-300"
              }`}
            />
            <label className="label">
              <span className="text-sm opacity-70">Who you are, & how do you want to be identified in this app</span>
            </label>
          </div>
          <div className="mt-3 form-control w-full relative">
            <label className="label">
              <span className="text-sm font-inter font-medium">Password</span>
            </label>
            <div className="label absolute top-0 right-0">
              <div
                className="tooltip tooltip-left sm:tooltip-right font-inter"
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
              readOnly={loading}
              tabIndex={2}
              type={hidePass ? "password" : "text"}
              onChange={(e) => {
                var val = e.target.value;
                setErr("");
                setPassword(val);
              }}
              value={password}
              className={`input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                err.includes("Invalid") ||
                Validator(password, ["isEmpty", "min"], 8)
                  ? "ring-fuchsia-100"
                  : "ring-rose-300"
              }`}
            />
            <label className="label">
              <span className="text-sm opacity-70">Secure your account using passphrase (min 8 chars)</span>

              <span></span>
            </label>
          </div>
          <button disabled={!Validator(userName, ["min"], 4)} className="font-inter btn btn-sm btn-primary mt-4">Save Changes</button>
        </form>
      </div>{" "}
    </div>
  );
};

export default userProfile;
