import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import UserChat from "../Users/UserChat";

import { BsDot } from "react-icons/bs";

const UserNav = () => {
  const router = useRouter();
  const [modalState, setModalState] = useState(-1);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [trigger, setTrigger] = useState(0);
  const [requesting, setRequesting] = useState(false);

  const [minichatInfo, setMiniChatInfo] = useState({ userUnread: false });

  const loadUser = () => {
    const response = fetch("/api/prd/userInfo", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (res.status === 401) router.push("/login");
        return res;
      })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      });
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

  const loadChat = async () => {
    try {
      setRequesting(true);
      const chats = await axios.post("/api/prd/chat", {
        mode: 0,
        filter: { isDeleted: false, ownerId: userData._id },
        create_on_null: false,
        project: { userUnread: 1 },
      });
      setMiniChatInfo(chats.data);
      setLoading(false);
      setRequesting(false);
      setTrigger(Date.now());
    } catch (e) {
      console.log("cant", e);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadUser();
  }, []);

  useEffect(() => {
    if (!userData) return;
    const interval = setInterval(async () => {
      if (requesting) return;
      await loadChat();
    }, 5000);
    return () => clearInterval(interval);
  }, [userData]);

  return (
    <>
      <nav className="fixed smooth-shadow-fade z-10 backdrop-blur-md bg-white flex w-full justify-between px-5 md:px-20 font-inter font-medium">
        {/* Same as */}
        <div className="flex items-center w-1/3 md:w-1/4">
          {/* <a href="/">Philip Rice Dealer</a> */}
          <img className="h-6" src="/usernavlogo.png" />
        </div>
        <div className="hidden md:flex py-4 opacity-90 w-2/4 font-inter  justify-center space-x-1 items-center">
          {/* <a className="cursor-pointer" onClick={() => router.push("/shop")}>Home</a> */}
          <a
            className={
              "cursor-pointer text-sm duration-200 ease-out py-2 px-4 rounded-md " +
              `${
                router.pathname === "/shop"
                  ? "text-blue-400 bg-gray-100"
                  : "hover:text-blue-400 hover:bg-gray-100"
              }`
            }
            onClick={() => router.push("/shop")}
          >
            Home
          </a>
          <a
            className={
              "cursor-pointer text-sm duration-200 ease-out py-2 px-4 rounded-md " +
              `${
                router.pathname.includes("store")
                  ? "text-blue-400 bg-gray-100"
                  : "hover:text-blue-400 hover:bg-gray-100"
              }`
            }
            onClick={() => router.push("/shop/store")}
          >
            Store
          </a>
          {/* <a
            className={
              "cursor-pointer text-sm duration-200 ease-out py-2 px-4 rounded-md " +
              `${
                router.pathname.includes("cart")
                  ? "text-blue-400 bg-gray-100"
                  : "hover:text-blue-400 hover:bg-gray-100"
              }`
            }
            onClick={() => router.push("/shop/cart")}
          >
            Cart
          </a> */}
          <a
            className={
              "cursor-pointer text-sm duration-200 ease-out py-2 px-4 rounded-md " +
              `${
                router.pathname.includes("transaction")
                  ? "text-blue-400 bg-gray-100"
                  : "hover:text-blue-400 hover:bg-gray-100"
              }`
            }
            onClick={() => router.push("/shop/transaction")}
          >
            Transaction
          </a>
        </div>
        <div className="flex items-center w-1/4 space-x-4 justify-end">
          {!loading && userData && (
            <>
              <div
                onClick={() => router.push("/shop/cart")}
                className="relative p-2 group rounded-md cursor-pointer bg-transparent hover:bg-gray-100 duration-200 ease-in-out"
              >
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
                    <rect x="0" y="0" width="24" height="24"/>
                    <path
                      d="M18.1446364,11.84388 L17.4471627,16.0287218 C17.4463569,16.0335568 17.4455155,16.0383857 17.4446387,16.0432083 C17.345843,16.5865846 16.8252597,16.9469884 16.2818833,16.8481927 L4.91303792,14.7811299 C4.53842737,14.7130189 4.23500006,14.4380834 4.13039941,14.0719812 L2.30560137,7.68518803 C2.28007524,7.59584656 2.26712532,7.50338343 2.26712532,7.4104669 C2.26712532,6.85818215 2.71484057,6.4104669 3.26712532,6.4104669 L16.9929851,6.4104669 L17.606173,3.78251876 C17.7307772,3.24850086 18.2068633,2.87071314 18.7552257,2.87071314 L20.8200821,2.87071314 C21.4717328,2.87071314 22,3.39898039 22,4.05063106 C22,4.70228173 21.4717328,5.23054898 20.8200821,5.23054898 L19.6915238,5.23054898 L18.1446364,11.84388 Z"
                      fill="currentColor"
                      opacity="0.3"
                      className="group-hover:text-blue-500 duration-150 group-hover:-rotate-6"
                    />
                    <path
                      d="M6.5,21 C5.67157288,21 5,20.3284271 5,19.5 C5,18.6715729 5.67157288,18 6.5,18 C7.32842712,18 8,18.6715729 8,19.5 C8,20.3284271 7.32842712,21 6.5,21 Z M15.5,21 C14.6715729,21 14,20.3284271 14,19.5 C14,18.6715729 14.6715729,18 15.5,18 C16.3284271,18 17,18.6715729 17,19.5 C17,20.3284271 16.3284271,21 15.5,21 Z"
                      fill="currentColor"
                      className="group-hover:text-blue-500 duration-150 group-hover:translate-x-1"
                    />
                  </g>
                </svg>
              </div>
              <div
                onClick={() => setShowChat(true)}
                className="relative p-2 group rounded-md cursor-pointer bg-transparent hover:bg-gray-100 duration-200 ease-in-out"
              >
                {minichatInfo && minichatInfo.userUnread && (
                  <BsDot className="text-blue-400 absolute text-2xl top-0 -right-1 animate-ping" />
                )}
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    className="group-hover:text-[#abb5e2] text-[#ced1dd] duration-150 group-hover:rotate-6"
                    d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"
                  />
                  <path
                    className="group-hover:text-blue-400 text-[#e3e4ea] duration-150 group-hover:-rotate-6"
                    d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"
                  />
                </svg>
              </div>
              <p className="">{userData.userName}</p>
              <div
                className="avatar cursor-pointer"
                onClick={() => router.push("/general/profile")}
              >
                <div className="w-10 rounded-md">
                  <img src={userData.imgUrl} />
                </div>
              </div>
            </>
          )}
          {loading && <Loading loading={loading} />}
        </div>
        <UserChat visible={showChat} trigger={trigger} onClose={setShowChat} />
      </nav>
    </>
  );
};

export default UserNav;
