import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import { dateMomentBeautify, getago } from "../helpers";

import Loading from "./Loading";

import CustomConfirm from "../components/modals/CustomConfirm";

const ChatContent = ({ onClose, resellerId, chatWith, trigger }) => {
  const [requesting, setRequesting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const msgRef = useRef();
  const [chat, setChat] = useState();
  const [contentMode, setContentMode] = useState(0); // 0 - text, 1 - link
  const [write, setWrite] = useState("");

  const [deleting, setDeleting] = useState(false);

  const loadMe = async () => {
    try {
      const res = await axios.post("/api/prd/userInfo");
      setCurrentUser(res.data);
    } catch (e) {}
  };

  const loadChats = async () => {
    try {
      setRequesting(true);
      if (!currentUser) return;
      const chats = await axios.post("/api/prd/chat", {
        mode: 0,
        filter: {
          ownerId: resellerId ? resellerId : currentUser._id,
          isDeleted: false,
        },
        create_on_null : currentUser.userType >= 1 ? false : true
      });
      setChat(chats.data);
      setLoading(false);
      setRequesting(false);
    } catch (e) {
      console.log("Wont ", e);
      if (e.response && e.response.status === 500) setChat(null);
    }
  };

  const send = async (message) => {
    if (message.length === 0) return;
    try {
        var stmp = new Date();
      const snd = await axios.post("/api/prd/chat", {
        mode: 2,
        filter: {
          _id: chat._id,
          isDeleted: false,
        },
        content: {
          $set: {
            ...(currentUser.userType > 0
              ? { adminUnread: false, userUnread: true }
              : { userUnread: false, adminUnread: true }),
              lastChat : stmp
          },
          $push: {
            chats: {
              _id: currentUser._id,
              userName: currentUser.userName,
              imgUrl: currentUser.imgUrl,
              email: currentUser.email,
              userType: currentUser.userType,
              type: contentMode, // 0 - text, 1 - url/link
              message: write,
              date: stmp
            },
          },
        },
      });
      setWrite("");
      loadChats();
    } catch (e) {}
  };

  const deleteCht = async () => {
    try {
      const snd = await axios.post("/api/prd/chat", {
        mode: -1,
        filter: {
          _id: chat._id,
          isDeleted: false,
        },
        content: { $set: { isDeleted: true,  adminUnread : false, userUnread : false } },
      });
      setWrite("");
      onClose();
    } catch (e) {
      console.log("Wont ", e);
    }
  };

  const parseIfUrl = (str) => {
    var inputElement = document.createElement("input");

    const isValidUrl = (urlString) => {
      inputElement.type = "url";
      inputElement.value = urlString;

      if (!inputElement.checkValidity()) {
        return false;
      } else {
        return true;
      }
    };
    let toTest = str.split(" ");
    return (
      <>
        {toTest.map((msg, i) => (
          <span key={i}>
            {isValidUrl(msg) ? (
              <a
                key={i}
                className="hover:text-blue-500 duration-200 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                href={msg}
              >
                {msg}
              </a>
            ) : (
              msg
            )}
            {i < toTest.length - 1 ? " " : ""}
          </span>
        ))}
      </>
    );
  };

  const renderMsg = (strs) => {
    let str = strs.replaceAll("\n", "<~>").split("<~>");
    return (
      <>
        {str.map((msg, i) => (
          <span key={i}>
            {parseIfUrl(msg)}
            {i <= str.length && <br />}
          </span>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [chat]);

  useEffect(() => {
    if (!currentUser) return;
    loadChats();
  }, [currentUser]);

  useEffect(() => {
    loadMe();
  }, [ resellerId]);

  useEffect(() => {
    if (!currentUser) return;
    loadChats();
  }, [trigger]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full relative"
    >
      <div className="w-full max-h-fit py-4 px-4 border-b border-gray-100 bg-white">
        <div className="flex font-inter justify-between items-center ">
          <div>
            <p>
              {currentUser
                ? currentUser.userType < 1
                  ? "Chat PRD Admins"
                  : chatWith
                  ? chatWith
                  : "Chat User"
                : "Chat PRD Admins"}
            </p>
          </div>
          <div className="flex justify-end">
            <div className="dropdown dropdown-left">
              <label tabIndex={0} className="">
                <div
                  onClick={() => {}}
                  className="group p-1 mr-2 hover:bg-gray-100 bg-transparent ease-in-out duration-200 rounded-md cursor-pointer"
                >
                  <svg
                    className="h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      className="group-hover:text-[#5d6068] text-[#c2c4cb]"
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                    />
                  </svg>
                </div>
              </label>
              <div
                tabIndex={0}
                className="dropdown-content menu p-5 w-56 bg-white smooth-shadow-fade rounded-md"
              >
                <p className="text-sm font-medium text-gray-400">
                  Chat Options
                </p>
                {chat && (
                  <button
                    onClick={() => setDeleting(true)}
                    className="rounded-md hover:bg-gray-100 hover:text-rose-400 text-gray-400 bg-gray-50 px-4 py-2 text-sm mt-4"
                  >
                    Delete Conversation
                  </button>
                )}
                {chat && deleting && (
                  <>
                    <p className="text-center text-xs mt-4">
                      {" "}
                      Are you sure you want to delete this conversation?
                      <span
                        className="underline cursor-pointer text-gray-400 hover:text-gray-800"
                        onClick={() => deleteCht()}
                      >
                        Yes
                      </span>
                      <span
                        className="underline cursor-pointer text-gray-400 hover:text-gray-800 ml-2"
                        onClick={() => setDeleting(false)}
                      >
                        No
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div
              onClick={() => onClose(false)}
              className="group p-1 hover:bg-gray-100 bg-transparent ease-in-out duration-200 rounded-md cursor-pointer"
            >
              <svg
                fill="currentColor"
                className="h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  className="group-hover:text-[#5d6068] text-[#c2c4cb]"
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={msgRef}
        className="h-4/6 w-full px-2 min-h-max overflow-y-scroll"
      >
        {loading && (
          <div className="mx-auto mountedanimater flex w-full mt-16 justify-center">
            <Loading loading={loading} />
          </div>
        )}
        {chat && !loading ? (
          <>
            {chat && (
              <div className="my-24">
                <svg
                  fill="currentColor"
                  className="h-8 text-blue-400 mx-auto"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z"
                  />
                </svg>
                <p className="text-gray-400 mt-8 text-center text-xs">
                  Chat created on{" "}
                  {dateMomentBeautify(
                    new Date(chat.cat),
                    "MMMM DD YYYY h:mm a"
                  )}
                </p>
              </div>
            )}
            {chat.chats.map((cht, idx) => (
              <div key={idx} className="my-5 flex justify-between w-full">
                <div></div>
                <div
                  className={
                    "" +
                    `${
                      cht._id === currentUser._id ||
                      cht.userType === currentUser.userType
                        ? "order-last"
                        : "order-first"
                    }`
                  }
                >
                  <div
                    className={
                      "flex items-center " +
                      `${
                        cht._id === currentUser._id ||
                        cht.userType === currentUser.userType
                          ? "justify-end"
                          : "justify-start"
                      }`
                    }
                  >
                    <p
                      className={`text-xs text-gray-400 ${
                        cht._id === currentUser._id ||
                        cht.userType === currentUser.userType
                          ? "mr-2"
                          : "order-last ml-2"
                      }`}
                    >
                      {getago(new Date(cht.date)).finalResult}
                    </p>
                    <p
                      className={`text-sm font-semibold text-gray-900 mx-2 ${
                        cht._id === currentUser._id ||
                        cht.userType === currentUser.userType
                          ? ""
                          : "order-2 ml-2"
                      }`}
                    >
                      {cht._id === currentUser._id ? "You" : cht.userName}
                    </p>
                    <div
                      className={`avatar cursor-pointer ${
                        cht._id === currentUser._id ||
                        cht.userType === currentUser.userType
                          ? ""
                          : "order-1 ml-2"
                      }`}
                    >
                      <div className="w-8 rounded-full">
                        <img className="h-8" src={cht.imgUrl} />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 text-sm bg-gray-50 rounded-md mt-2">
                    <p
                      className={
                        "text-sm " +
                        `${
                          cht._id === currentUser._id ||
                          cht.userType === currentUser.userType
                            ? "text-right"
                            : "text-left"
                        }`
                      }
                    >
                      {renderMsg(cht.message)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-400 mt-8 text-center text-xs">
            couldn&apos;t load chat
          </p>
        )}
      </div>
      <div className="h-1/6 border-t px-4 border-gray-100">
        <textarea
          value={write}
          onChange={(e) => {
            setWrite(e.target.value);
          }}
          onKeyDown={(evt) => {
            if (evt.key === "Enter" && evt.shiftKey) {
              send(write);
              return;
            }
          }}
          placeholder={
            contentMode === 0 ? "Type your message here.." : "Paste link here.."
          }
          className="resize-none mt-2 py-2 px-0 font-inter text-sm text-gray-600 background-transparent outline-none w-full"
        />
        <div className="flex justify-between items-center w-full mt-4">
          <div className="flex justify-start items-center space-x-2">
            <span
              onClick={() => setContentMode(0)}
              className={
                "duration-200 ease-in-out text-xs text-gray-400 hover:text-gray-800 cursor-pointer " +
                `${contentMode === 0 ? "text-gray-800" : ""}`
              }
            >
              Abc
            </span>
            <svg
              onClick={() => setContentMode(1)}
              fill="currentColor"
              className={
                "duration-200 ease-in-out text-xs h-4 text-gray-400 hover:text-gray-800 cursor-pointer " +
                `${contentMode === 1 ? "text-gray-800" : ""}`
              }
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 105.304 5.304l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z"
              />
            </svg>
          </div>
          <div
            onClick={() => {
              if (!chat) return;
              send(write);
            }}
            className="smooth-shadow-fine w-max inline-flex items-center text-white text-sm gap-2 rounded-md group cursor-pointer py-2 px-3 bg-blue-400"
          >
            <span>Send</span>
            <svg
              fill="currentColor"
              className="h-4"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                className="text-gray-300 group-hover:text-blue-100 ease-in-out duration-200"
                d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatContent;
