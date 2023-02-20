import { useState, useEffect } from "react";
import { dateMomentBeautify, getDateAgo } from "../../helpers";

import { RiEyeFill, RiEyeCloseFill } from "react-icons/ri";
import { MdAdminPanelSettings, MdOutlineClose } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { BsCloudUpload } from "react-icons/bs";

import getConfig from "next/config";
import { toast } from "react-toastify";
import axios from "axios";

import { storage } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const AccountComponent = ({ isNew, role, data, onUpdate, onDelete, close }) => {
  const { publicRuntimeConfig } = getConfig();
  const [loading, setLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  const [fileImg, setFileImg] = useState();
  const [imgUrl, setImgUrl] = useState(
    "https://cdn.discordapp.com/attachments/1040843356441423882/1076767514501058620/blank-profile-picture-973460_640.png"
  );

  const [_id, setId] = useState();
  const [userType, setUserType] = useState(0);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const [datej, setDateJ] = useState(new Date());

  const init = async () => {
    setFileImg(null);

    if (isNew) {
      setImgUrl(
        "https://cdn.discordapp.com/attachments/1040843356441423882/1076767514501058620/blank-profile-picture-973460_640.png"
      );
      setUserType(0);
      setUserName("");
      setContact("");
      setPassword("");
      setAddress("");
      return;
    }

    try {
      let ndata = await axios.post("/api/prd/userInfo", { _id: data._id });
      ndata = ndata.data;

      setLoading(true);
      setImgUrl(ndata.imgUrl);
      setUserType(ndata.userType);
      setUserName(ndata.userName);
      setContact(ndata.contact);
      setAddress(ndata.address);
      setDateJ(new Date(ndata.dateJoined));
      setEmail(ndata.email);
      setId(ndata._id);
    } catch (e) {
      toast.error(`Failed to load ${data.userName} info`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    setLoading(true);
    const storageRef = ref(storage, `/profiles/${data.email}`);
    const uploadTask = uploadBytesResumable(storageRef, fileImg);
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
          save(url);
        });
      }
    );
  };

  const validate = () => {
    if (userName.length === 0) {
      toast.warning("Username is required", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return false;
    }

    if (email.length === 0) {
      toast.warning("Email is required", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return false;
    }

    if (address.length === 0) {
      toast.warning("Address is required", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return false;
    }

    if (contact.length === 0) {
      toast.warning("Contact number is required", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return false;
    }

    if (isNew && password.length === 0) {
      toast.warning("Password is required", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return false;
    }

    return true;
  };

  const save = async (url) => {
    try {
      setLoading(true);

      if (!validate()) return;

      let content = {
        userName,
        email,
        address,
        contact,
        userType,
        imgUrl: !url ? imgUrl : url,
      };

      if (password.length > 0 || isNew) content.password = password;

      const req = await axios.post("/api/prd/updateUser", {
        mode: isNew ? 1 : 0,
        _id,
        filter: { email },
        hasPass: password.length > 0 || isNew,
        content,
      });

      toast.success("Changes saved", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      setFileImg(null);
      onUpdate();

      if(isNew) close();
    } catch (e) {
      console.log(e);
      if (e.response) {
        toast.error(e.response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        toast.error("Couldn't save changes", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="p-4 w-full">

      <div className="flex justify-between">
        <p>{isNew ? "New Account" : "Edit Profile"}</p>
        <MdOutlineClose
          onClick={() => close()}
          className="text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
        />{" "}
      </div>

      <div className="w-full flex justify-center">
        <div className="avatar">
          <div className="w-48 rounded-full smooth-shadow2">
            <img src={imgUrl} className="" />
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-600 mt-4">
        Joined on {dateMomentBeautify(datej, "MMMM Do YYYY")}
      </p>

      <div className="flex mt-6 items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="duration-200 ease-in-out flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50/80 hover:bg-gray-100 "
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <BsCloudUpload className="text-3xl text-gray-500" />
            <p className="mb-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Upload/Change</span> account photo
              by <span className="font-semibold">clicking here</span>
            </p>
            <p
              className={
                `${fileImg ? "animate-pulse" : ""} ` +
                " text-sm mt-4 font-medium text-gray-500 dark:text-gray-400"
              }
            >
              {fileImg
                ? `${fileImg.name} - ${(fileImg.size / 1000000).toFixed(2)} MB`
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
              if (e.target.files[0].size > publicRuntimeConfig.maxUploadImage) {
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
              setFileImg(e.target.files[0]);
              setImgUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>
      </div>

      <p className="label-text font-inter font-medium mt-4">User Type</p>
      <div className="inline-flex rounded-md shadow-sm mt-2" role="group">
        <button
          type="button"
          onClick={() => setUserType(1)}
          className={
            "inline-flex items-center px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-yellow-500 focus:z-10 " +
            `${userType === 1 ? "text-yellow-500" : " text-gray-500"}`
          }
        >
          <MdAdminPanelSettings className="h-6 w-6 mr-2" />
          Admin
        </button>
        <button
          type="button"
          onClick={() => setUserType(0)}
          className={
            "inline-flex items-center px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-yellow-500 focus:z-10 " +
            `${userType === 0 ? "text-yellow-500" : " text-gray-500"}`
          }
        >
          <FaHandshake className="h-6 w-6 mr-2" />
          Partner
        </button>
      </div>

      <div className="mt-3 form-control w-full">
        <label className="label">
          <span className="label-text font-inter font-medium ">
            Email Address
          </span>
        </label>
        <input
          readOnly={loading}
          type="text"
          tabIndex={1}
          required
          onChange={(e) => {
            var val = e.target.value;
            setEmail(val);
          }}
          disabled={!data || loading}
          value={email}
          className="input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ring-yellow-50"
        />
        <label className="label">
          <span className="text-sm opacity-70">
            Enter a valid & unique email address
          </span>
        </label>
      </div>

      <div className="mt-3 form-control w-full">
        <label className="label">
          <span className="label-text font-inter font-medium ">Username</span>
        </label>
        <input
          readOnly={loading}
          type="text"
          tabIndex={1}
          required
          onChange={(e) => {
            var val = e.target.value;
            setUserName(val);
          }}
          disabled={!data || loading}
          value={userName}
          className="input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ring-yellow-50"
        />
        <label className="label">
          <span className="text-sm opacity-70">
            Set a username to uniquely identify user.
          </span>
        </label>
      </div>

      <div className="mt-3 form-control w-full">
        <label className="label">
          <span className="label-text font-inter font-medium ">address</span>
        </label>

        {/* <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300  input-sm bg-base-200/50 hover:bg-base-100 focus:ring-4 hover:ring-4 ring-yellow-50" placeholder="Write your thoughts here..." /> */}
        <textarea
          readOnly={loading}
          tabIndex={1}
          rows="3"
          placeholder="address"
          required
          onChange={(e) => {
            var val = e.target.value;
            setAddress(val);
          }}
          disabled={!data || loading}
          value={address}
          className="textarea px-4 py-5 bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ring-yellow-50"
        />
        <label className="label">
          <span className="text-sm opacity-70">Address of the user/admin</span>
        </label>
      </div>

      <div className="mt-3 form-control w-full">
        <label className="label">
          <span className="label-text font-inter font-medium ">
            Contact Number
          </span>
        </label>
        <input
          readOnly={loading}
          type="number"
          tabIndex={1}
          required
          onChange={(e) => {
            var val = e.target.value;
            setContact(val);
          }}
          disabled={!data || loading}
          value={contact}
          className="input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ring-yellow-50"
        />
        <label className="label">
          <span className="text-sm opacity-70">
            Leave a contact number for this account
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
          disabled={!data || loading}
          type={hidePass ? "password" : "text"}
          onChange={(e) => {
            var val = e.target.value;
            setPassword(val);
          }}
          placeholder="change password"
          value={password}
          className="input px-4 py-5 input-sm bg-base-200/50 w-full hover:bg-base-100 focus:ring-4 hover:ring-4 ring-yellow-50"
        />
        <label className="label">
          <span className="text-sm opacity-70">
            Secure account using passphrase
          </span>

          <span></span>
        </label>
      </div>

      <div className={loading ? "opacity-50 animate-pulse" : ""}>
        <p className="block mt-6 text-sm font-medium text-gray-900 ">Actions</p>
        <div className="mt-2 flex justify-between">
          <button
            disabled={loading}
            type="button"
            onClick={() => {
              init();
              toast.success("Changes Discarded", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }}
            className="duration-200 ease-in-out py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-red-400 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-900 hover:text-red-100 focus:z-10 focus:ring-4 focus:ring-gray-200"
          >
            Undo Changes
          </button>
          <button
            type="button"
            onClick={() => {
              if (fileImg) handleUpload();
              else save();
            }}
            disabled={loading}
            className="duration-200 ease-in-out focus:outline-none text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
          >
            {isNew ? "Create & Save" : "Save Changes"}
          </button>
        </div>

        {!isNew && (
          <>
            <p className="block mt-6 text-sm font-medium text-gray-900 ">
              Destructive Action
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={() => onDelete()}
              className="duration-200 ease-in-out py-1 w-full mt-2 px-5 mr-2 mb-2 text-sm font-medium text-red-400 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Delete Account
            </button>
            <p className="text-sm mt-4 font-medium text-gray-900 ">
              Other Info
            </p>
            <p className="mt-6 text-sm font-medium">
              User ID : <span className="font-normal">{data._id}</span>
            </p>
            <p className="mt-2 text-sm font-medium">
              Joined :{" "}
              <span className="font-normal">
                {dateMomentBeautify(
                  new Date(data.dateJoined),
                  "MMM Do YYYY, h:mm a"
                )}
              </span>{" "}
              - {getDateAgo(new Date(), new Date(data.dateJoined))}{" "}
              <span className="font-normal"> days ago</span>
            </p>
          </>
        )}
      </div>

      <p className="h-8"></p>
    </div>
  );
};

export default AccountComponent;
