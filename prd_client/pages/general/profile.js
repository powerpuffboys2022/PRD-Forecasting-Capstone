import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import { HiArrowSmRight } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

import { storage } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { Validator, dateToBeutify } from "../../helpers";

import Head from "next/head";
import LogoutConfirm from "../../components/modals/Confirm";
import Loading from "../../components/Loading";

const userProfile = () => {
  const router = useRouter();

  const [newImg, setNewImg] = useState();

  const [loading, setLoading] = useState();
  const [hidePass, setHidePass] = useState(true);
  const [err, setErr] = useState("");

  const [imgUrl, setImgUrl] = useState("");
  const [userData, setUserData] = useState();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [modalState, setModalState] = useState(-1);

  const handleUpload = () => {
    const storageRef = ref(storage, `/profiles/${uuidv4()}_${newImg.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newImg);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err)
        toast.error("Failed Uploading Photo", { position : toast.POSITION.BOTTOM_RIGHT })
      },
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          saveWithImg(url);
        });
      }
    );
  };

  const onLogout = () => {
    const response = fetch("/api/auth", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authMode: -1 }),
    }).then((data) => {
      router.push("/login");
    });
  };

  const saveNoImg = () => {
    setLoading(true);
    let newUserData = { userName, address };

    if (password.length > 0) newUserData.password = password;

    const response = fetch("/api/prd/updateUser", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateMode: 0,
        _id: userData._id,
        userData: newUserData,
      }),
    })
      .then((data) => {
        setLoading(false);
        loadUser();
        setPassword("")
        toast.success("Successfully Saved", { position : toast.POSITION.BOTTOM_RIGHT })
      })
      .catch((err) => {
        setErr(err.message);
        toast.error("Failed Saving", { position : toast.POSITION.BOTTOM_RIGHT })
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveWithImg = async (imgUrl) => {
    setLoading(true);
    let newUserData = { userName, address, imgUrl };
    if (password.length > 0) newUserData.password = password;
    const response = fetch("/api/prd/updateUser", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateMode: 0,
        _id: userData._id,
        userData: newUserData,
      }),
    })
      .then((data) => {
        setLoading(false);
        loadUser();
        setPassword("")
        toast.success("Successfully Saved", { position : toast.POSITION.BOTTOM_RIGHT })
      })
      .catch((err) => {
        setErr(err.message);
        toast.error("Failed Saving", { position : toast.POSITION.BOTTOM_RIGHT })
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadUser = () => {
    setLoading(true);
    const response = fetch("/api/prd/userInfo", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data.imgUrl)
            setUserData(data);
            setUserName(data.userName);
            setAddress(data.address);
            setImgUrl(data.imgUrl);
          });
        }
      })
      .finally((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
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
      <LogoutConfirm
        title={"You are about to logout"}
        description={"Are you sure to logout now?"}
        shown={modalState === 1}
        onAccept={() => {
          setModalState(-1), onLogout();
        }}
        onDecline={() => setModalState(-1)}
        acceptText={"Yes"}
        declineText={"No"}
      />
      <div className="w-full flex justify-center">
        <Head>
          <title>Profile</title>
          <meta
            name="description"
            content="A admin web app for Philip Rice Dealer that focuses on Sales Forecasting."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="font-inter w-full mx-4 md:mx-0 md:w-1/3 mt-12 relative">
          <button
            className="btn btn-sm btn-ghost absolute top-0 right-0"
            onClick={() => setModalState(1)}
          >
            Log out <HiArrowSmRight className="text-lg" />
          </button>
          <div className="flex items-center space-x-3">
            {imgUrl === "" ? (
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                  <span>{ loading ? userName.substring(0 , 2) : <Loading loading={true} />}</span>
                </div>
              </div>
            ) : (
              <div className="avatar">
                <div className="w-16 rounded-full">
                  {
                    imgUrl === "" ? <Loading loading={true} /> : <img src={imgUrl} alt="User Profile Pic" />
                  }
                </div>
              </div>
            )}
            <div>
              <p className="text-2xl font-medium">{userName} / Profile</p>
              <p className="text-xs">
                {!userData ? "?" : userData.email} | Joined{" "}
                {!userData ? "?" : dateToBeutify(new Date(userData.dateJoined))}
              </p>
            </div>
          </div>
          {loading && <progress className="progress w-full mt-2"></progress>}
          {!loading && !userData && (
            <p className="text-xs mt-4 text-error">
              Failed to load your account info...
            </p>
          )}
          <form>
            <div className="mt-8 form-control w-full">
              <label className="label">
                <span className="label-text font-inter font-medium ">
                  Upload New Photo
                </span>
              </label>
              <input
                type="file"
                disabled={!userData || loading}
                className={
                  "file-input file-input-sm w-full focus:ring-4 hover:ring-4 " +
                  `${userData ? "ring-fuchsia-100" : "ring-rose-300"}`
                }
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => {
                  setNewImg(e.target.files[0]);
                  setImgUrl(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <label className="label">
                <span className="text-sm opacity-70"></span>
              </label>
            </div>

            <div className="mt-3 form-control w-full">
              <label className="label">
                <span className="label-text font-inter font-medium ">
                  Username
                </span>
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
                disabled={!userData || loading}
                value={userName}
                className={`input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                  !err.includes("not found") && Validator(userName, ["isEmpty"])
                    ? "ring-fuchsia-100"
                    : "ring-rose-300"
                }`}
              />
              <label className="label">
                <span className="text-sm opacity-70">
                  Who you are, & how do you want to be identified in this app
                </span>
              </label>
            </div>

            <div className="mt-3 form-control w-full">
              <label className="label">
                <span className="label-text font-inter font-medium ">
                  address
                </span>
              </label>
              <input
                readOnly={loading}
                type="text"
                tabIndex={1}
                required
                onChange={(e) => {
                  setErr("");
                  var val = e.target.value;
                  setAddress(val);
                }}
                disabled={!userData || loading}
                value={address}
                className={`input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                  !err.includes("not found") && Validator(address, ["isEmpty"])
                    ? "ring-fuchsia-100"
                    : "ring-rose-300"
                }`}
              />
              <label className="label">
                <span className="text-sm opacity-70">
                  Your address where you want your orders to be delivered
                </span>
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
                disabled={!userData || loading}
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
                <span className="text-sm opacity-70">
                  Secure your account using passphrase (min 8 chars)
                </span>

                <span></span>
              </label>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
              className="font-inter btn hover:bg-neutral btn-outline hover:text-white btn-ghost btn-sm mr-2"
            >
              <IoClose className="" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!newImg) saveNoImg();
                else handleUpload();
              }}
              disabled={!Validator(userName, ["min"], 4) || !Validator(address, ["isEmpty"])}
              className={`btn hover:bg-yellow-500 btn-outline hover:text-white btn-ghost btn-sm ${
                loading ? "btn-loading" : ""
              }`}
            >
              Save Changes
            </button>
          </form>
        </div>{" "}
      </div>
    </>
  );
};

export default userProfile;
