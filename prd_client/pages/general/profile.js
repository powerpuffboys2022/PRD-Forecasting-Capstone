import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import { HiArrowSmRight } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

import { storage } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Validator, dateToBeutify } from "../../helpers";

import Head from "next/head";
import LogoutConfirm from "../../components/modals/Confirm";
import Loading from "../../components/Loading";

import { roleToWord, getago, dateMomentBeautify } from "../../helpers";
import { MdEmail } from "react-icons/md";
import { HiPhone } from "react-icons/hi";
import { BsCloudUpload } from "react-icons/bs";
import getConfig from "next/config";

const UserProfile = () => {
  const { publicRuntimeConfig } = getConfig();
  const router = useRouter();

  const [newImg, setNewImg] = useState();

  const [loading, setLoading] = useState();
  const [hidePass, setHidePass] = useState(true);
  const [err, setErr] = useState("");

  const [imgUrl, setImgUrl] = useState(
    "https://cdn.discordapp.com/attachments/1040843356441423882/1076767514501058620/blank-profile-picture-973460_640.png"
  );
  const [userData, setUserData] = useState();
  const [userName, setUserName] = useState("-");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("-");
  const [address, setAddress] = useState("-");
  const [modalState, setModalState] = useState(-1);
  const [role, setRole] = useState(-1);
  const [email, setEmail] = useState("-");
  const [joined, setJoined] = useState(new Date());

  const [edit, setEdit] = useState(false);

  const handleUpload = () => {
    const storageRef = ref(storage, `/profiles/${uuidv4()}_${newImg.name}`);
    const uploadTask = uploadBytesResumable(storageRef, newImg);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        toast.error("Failed Uploading Photo", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
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
    let newUserData = { userName, address, contact };
    if (password.length > 0) newUserData.password = password;

    let bodyreq = {
      mode: 0,
      filter: { _id: userData._id },
      content: newUserData,
    };
    if (password.length > 0) bodyreq.hasPass = true;

    const response = fetch("/api/prd/updateUser", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyreq),
    })
      .then((data) => {
        setLoading(false);
        loadUser();
        setPassword("");
        toast.success("Successfully Saved", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setEdit(false);
      })
      .catch((err) => {
        setErr(err.message);
        toast.error("Failed Saving", { position: toast.POSITION.BOTTOM_RIGHT });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveWithImg = async (imgUrl) => {
    setLoading(true);

    let newUserData = { userName, address, contact, imgUrl };
    if (password.length > 0) newUserData.password = password;
    let bodyreq = {
      mode: 0,
      filter: { _id: userData._id },
      content: newUserData,
    };
    if (password.length > 0) bodyreq.hasPass = true;

    const response = fetch("/api/prd/updateUser", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyreq),
    })
      .then((data) => {
        setLoading(false);
        loadUser();
        setPassword("");
        toast.success("Successfully Saved", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setEdit(false);
      })
      .catch((err) => {
        setErr(err.message);
        toast.error("Failed Saving", { position: toast.POSITION.BOTTOM_RIGHT });
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
            setUserData(data);
            setUserName(data.userName);
            setContact(data.contact);
            setAddress(data.address);
            setImgUrl(data.imgUrl);
            setEmail(data.email);
            setRole(data.userType);
            setJoined(data.dateJoined);
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

  const roleToSvg = (role) => {
    if (role === 3)
      return (
        <svg
          className="h-5 text-blue-400 group-hover:text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
          />
        </svg>
      );

    if (role === 1)
      return (
        <svg
          className="h-5 text-blue-400 group-hover:text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          />
        </svg>
      );

    if (role === 0)
      return (
        <svg
          className="h-5 text-blue-400 group-hover:text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          />
        </svg>
      );

    return (
      <svg
        className="h-5 text-blue-400 group-hover:text-blue-500"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          clipRule="evenodd"
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
        />
      </svg>
    );
  };

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
      <div className="w-screen h-screen globalBg py-8 px-16 overflow-y-scroll">
        <Head>
          <title>Profile</title>
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
          <meta itemProp="image" content="cover.png" />

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
          <meta property="og:image" content="cover.png" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Philip Rice Dealer" />
          <meta
            name="twitter:description"
            content="Philip Rice Dealer Online store & forecasting"
          />
          <meta name="twitter:image" content="cover.png" />

          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="mx-auto w-10/12 font-inter">
          {!loading && !userData && (
            <p className="text-xs text-center my-4 text-error">
              Failed to load your account info...
            </p>
          )}

          <div className="bg-white rounded-lg p-8 flex items-center justify-evenly">
            <div className="avatar cursor-pointer">
              <div className="w-36 rounded-md">
                <img src={imgUrl} />
              </div>
            </div>
            <div className="w-full px-8 h-full self-start">
              <div className="flex items-center justify-between">
                <div className="">
                  <p className="text-sm text-gray-500 ease-in-out inline-flex gap-1 mt-2 group duration-150 hover:text-blue-500 items-center">
                    {" "}
                    <span className="text-gray-900 text-2xl font-medium">
                      {userName}
                    </span>{" "}
                    {roleToSvg(role)} {roleToWord(role)}{" "}
                  </p>
                  <div className="flex items-center space-x-2 justify-start text-sm text-gray-500 ease-in-out mt-2 group duration-150 hover:text-blue-500">
                    <MdEmail className="text-lg" />
                    <p className="text-gray-400">{email}</p>
                    <HiPhone className="text-lg" />
                    <p className="text-gray-400">{contact}</p>
                  </div>
                  <p className=" text-xs text-gray-500 mt-2"> Joined on {dateMomentBeautify(new Date(joined), "MMMM DD, YYYY")} <span className="text-gray-400 text-xs">{getago(new Date(joined)).finalResult}</span></p>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <div
                    onClick={() => setEdit(!edit)}
                    className="relative p-2 group rounded-md cursor-pointer bg-transparent hover:bg-gray-100 duration-200 ease-in-out"
                  >
                    {!edit ? (
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <g
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x="0" y="0" width="24" height="24" />
                          <path
                            className="duration-150 text-gray-400 group-hover:text-blue-400"
                            d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z"
                            fill="currentColor"
                            fillRule="nonzero"
                            transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "
                          />
                          <path
                            className=" group-hover:text-blue-400"
                            d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z"
                            fill="currentColor"
                            fillRule="nonzero"
                            opacity="0.3"
                          />
                        </g>
                      </svg>
                    ) : (
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <rect
                          opacity="0.5"
                          x="6"
                          y="17.3137"
                          width="16"
                          height="2"
                          rx="1"
                          transform="rotate(-45 6 17.3137)"
                          fill="currentColor"
                        ></rect>
                        <rect
                          x="7.41422"
                          y="6"
                          width="16"
                          height="2"
                          rx="1"
                          transform="rotate(45 7.41422 6)"
                          fill="currentColor"
                        ></rect>
                      </svg>
                    )}
                  </div>
                  <button
                    onClick={() => setModalState(1)}
                    className="font-medium bg-blue-300 text-sm hover:bg-blue-400 text-white outline-none px-2 rounded-md py-2"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                    className="smooth-shadow-fine font-medium bg-gray-100 text-sm hover:bg-gray-200 text-gray-800 outline-none px-2 rounded-md py-2"
                  >Go Back</button>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="w-full mt-4 flex justify-center">
              <Loading loading={loading} />
            </div>
          )}

          {edit && (
            <form className="mountedanimater bg-white py-8 px-8 rounded-lg smooth-shadow-fine mt-8">
              <p className="text-lg">Edit Profile</p>

              <hr className="mt-4" />

              <div className="flex mt-6 items-center justify-center w-full md:w-4/6 md:mx-auto">
                <label
                  htmlFor="dropzone-file"
                  className="duration-200 ease-in-out flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50/80 hover:bg-gray-100 "
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <BsCloudUpload className="text-3xl text-gray-500" />
                    <p className="mb-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Upload/Change</span>{" "}
                      account photo by{" "}
                      <span className="font-semibold">clicking here</span>
                    </p>
                    <p
                      className={
                        `${newImg ? "animate-pulse" : ""} ` +
                        " text-sm mt-4 font-medium text-gray-500 dark:text-gray-400"
                      }
                    >
                      {newImg
                        ? `${newImg.name} - ${(newImg.size / 1000000).toFixed(
                            2
                          )} MB`
                        : "PNG, JPG or GIF - max size " +
                          publicRuntimeConfig.maxUploadImage / 1000000 +
                          " MB"}
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e) => {
                      if (e.target.files.length === 0) return;
                      if (
                        e.target.files[0].size >
                        publicRuntimeConfig.maxUploadImage
                      ) {
                        toast.warning(
                          "Too large, Image size limit is " +
                            publicRuntimeConfig.maxUploadImage / 1000000 +
                            " MB",
                          {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 3000,
                          }
                        );
                        return;
                      }
                      if (
                        !"image/png, image/gif, image/jpeg".includes(
                          e.target.files[0].type
                        )
                      ) {
                        toast.warning("Ooops, only image is allowed", {
                          position: toast.POSITION.BOTTOM_RIGHT,
                          autoClose: 3000,
                        });
                        return;
                      }
                      setNewImg(e.target.files[0]);
                      setImgUrl(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
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
                    !err.includes("not found") &&
                    Validator(userName, ["isEmpty"])
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
                    Contact
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
                    setContact(val);
                  }}
                  disabled={!userData || loading}
                  value={contact}
                  className={`input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ${
                    !err.includes("not found") &&
                    Validator(contact, ["isEmpty"])
                      ? "ring-fuchsia-100"
                      : "ring-rose-300"
                  }`}
                />
                <label className="label">
                  <span className="text-sm opacity-70">
                    Contact number can help us reach you aside from your email.
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
                    !err.includes("not found") &&
                    Validator(address, ["isEmpty"])
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
                  <span className="text-sm font-inter font-medium">
                    Password
                  </span>
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
              
              <hr className="mt-4" />
                
              <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (!newImg) saveNoImg();
                        else handleUpload();
                      }}
                      disabled={
                        !Validator(userName, ["min"], 4) ||
                        !Validator(address, ["isEmpty"]) || err.includes("Invalid") ||
                        Validator(password, ["isEmpty", "min"], 8)
                      }
                      className={`mt-6 smooth-shadow-fine duration-200 font-medium bg-blue-300 text-sm hover:bg-blue-400 text-white outline-none px-2 rounded-md py-2 ${
                        loading || (!Validator(userName, ["min"], 4) ||
                        !Validator(address, ["isEmpty"])
                        ) ? "cursor-not-allowed" : ""
                      }`}
                  >Save Changes</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
