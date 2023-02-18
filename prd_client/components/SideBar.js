import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { HiOutlineHome, HiOutlineLogout, HiUser } from "react-icons/hi";
import { BsTruck } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { ImStatsDots } from "react-icons/im";

import { AiFillHome, AiFillWechat } from "react-icons/ai";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaUsers, FaUser } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoIosExit } from "react-icons/io";

import LogoutConfirm from "./modals/Confirm";
import Link from "next/link";

const SideBar = () => {
  const router = useRouter();
  const [modalState, setModalState] = useState(-1);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadUser();
  }, []);

  const routes = [
    {
      routeName: "Dashboard",
      icon: HiOutlineHome,
      path: "/admin/",
      styling: "text-[#730C8F]",
      iconStyling: "bg-white",
    },
    {
      routeName: "Orders",
      icon: BsTruck,
      path: "/admin/orders",
      styling: "text-[#0A3977]",
      iconStyling: "bg-[#C5DCFA]",
    },
    {
      routeName: "Daily Sales",
      icon: MdAttachMoney,
      path: "/admin/dailySales",
      styling: "text-[#155D18]",
      iconStyling: "bg-[#C5F2C7]",
    },
    {
      routeName: "Sales Forecasting",
      icon: ImStatsDots,
      path: "/admin/salesForecasting",
      styling: "text-[#7F4C0A]",
      iconStyling: "bg-[#FBE5C9]",
    },
    {
      routeName: "Inventory",
      icon: GoPackage,
      path: "/admin/inventory",
      styling: "text-[#4D085F]",
      iconStyling: "bg-[#ECB9F9]",
    },
  ];

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
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data);
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

  return (
    <>
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

      <div className="bg-[#1e1e2d] relative sidebar w-1/6 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in ">
        <img
          className="w-5/6 -z-10 mr-2 absolute bottom-0 left-0 opacity-10"
          src="/prd_logo.png"
        />

        <div className="sidebar-header flex items-center justify-center py-4 px-4">
          <div className="inline-flex">
            <Link href="/" className="inline-flex flex-row items-center">
              <img className="w-8 mr-2" src="/prd_logo.png" />
              <span className="leading-10 text-gray-100 text-lg font-medium ml-1 ">
                Philip Rice Dealer
              </span>
            </Link>
          </div>
        </div>
        <div className="sidebar-content px-4 z-10 py-6">
          <ul className="flex flex-col w-full text-sm">
            <li className="my-px">
              <a
                onClick={() => router.push("/admin/")}
                className={
                  "flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 " +
                  `${
                    router.route === "/admin"
                      ? "bg-[#2a2a3c] text-gray-300 "
                      : "text-gray-400 "
                  }`
                }
              >
                <span className="flex items-center justify-center text-sm">
                  <AiFillHome />
                </span>
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-300 px-4 my-4 ">
                Store Management
              </span>
            </li>
            <li className="my-px">
              <a
                onClick={() => router.push("/admin/orders")}
                className={
                  "flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 " +
                  `${
                    router.route === "/admin/orders"
                      ? "bg-[#2a2a3c] text-gray-300 "
                      : "text-gray-400 "
                  }`
                }
              >
                <span className="flex items-center justify-center text-sm">
                  <HiOutlineClipboardList />
                </span>
                <span className="ml-3">Orders</span>
              </a>
            </li>
            <li className="my-px">
              <a
                onClick={() => router.push("/admin/inventory")}
                className={
                  "flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 " +
                  `${
                    router.route === "/admin/inventory"
                      ? "bg-[#2a2a3c] text-gray-300 "
                      : "text-gray-400 "
                  }`
                }
              >
                <span className="flex items-center justify-center text-sm">
                  <MdInventory />
                </span>
                <span className="ml-3">Inventory</span>
              </a>
            </li>
            <li className="my-px">
              <a
                onClick={() => router.push("/admin/dailySales")}
                className={
                  "flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 " +
                  `${
                    router.route === "/admin/dailySales"
                      ? "bg-[#2a2a3c] text-gray-300 "
                      : "text-gray-400 "
                  }`
                }
              >
                <span className="flex items-center justify-center text-sm">
                  <BsCurrencyDollar />
                </span>
                <span className="ml-3">Daily Sales</span>
                {/* <span className="flex items-center justify-center text-xs text-red-500 font-semibold bg-red-100 h-6 px-2 rounded-full ml-auto">
                  1k
                </span> */}
              </a>
            </li>
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-300 px-4 my-4 ">
                Customer Support
              </span>
            </li>
            <li className="my-px">
              <a
                onClick={() => router.push("/admin/chat")}
                className={
                  "flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 " +
                  `${
                    router.route === "/admin/chat"
                      ? "bg-[#2a2a3c] text-gray-300 "
                      : "text-gray-400 "
                  }`
                }
              >
                <span className="flex items-center justify-center text-sm">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    className="group-hover:text-[#abb5e2] text-[#ced1dd] "
                    d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"
                  />
                  <path
                    className="group-hover:text-blue-400 text-[#e3e4ea] "
                    d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"
                  />
                </svg>
                </span>
                <span className="ml-3">Chat</span>
              </a>
            </li>
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-300 px-4 my-4 ">
                Account Management
              </span>
            </li>
            <li className="my-px">
              <a
                onClick={() => {
                  router.push("/general/profile");
                }}
                className="flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 "
              >
                <span className="flex items-center justify-center text-sm">
                  <FaUser />
                </span>
                <span className="ml-3">Profile</span>
              </a>
            </li>
            <li className="my-px">
              <a
                onClick={() => router.push("/admin/accounts")}
                className={
                  "flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 " +
                  `${
                    router.route === "/admin/accounts"
                      ? "bg-[#2a2a3c] text-gray-300 "
                      : "text-gray-400 "
                  }`
                }
              >
                <span className="flex items-center justify-center text-sm">
                  <FaUsers />
                </span>
                <span className="ml-3">Accounts</span>
                {/* <span className="flex items-center justify-center text-xs text-red-500 font-semibold bg-red-100 h-6 px-2 rounded-full ml-auto">
                  10
                </span> */}
              </a>
            </li>
            <li className="my-px">
              <button
                onClick={() => setModalState(1)}
                className="flex flex-row items-center cursor-pointer h-10 px-3 rounded-lg text-gray-400  hover:bg-[#2a2a3c] hover:text-gray-300 w-full"
              >
                <span className="flex items-center justify-center text-sm">
                  <IoIosExit />
                </span>
                <span className="ml-3">Logout</span>
              </button>
            </li>
          </ul>
        </div>
        {/* <div className="mt-3  mx-4">
          <div className="flex justify-start items-center">
            <img
              className="h-12"
              src="https://cdn.discordapp.com/attachments/955281529481883729/1036886425045577758/prd.png"
            ></img>
            <p className="ml-1 text-lg font-inter font-medium">
              Philip Rice Dealer
            </p>
          </div>

          <div className="mt-8 font-medium font-inter space-y-1">
            {routes.map((route, i) => (
              <div
                onClick={() => router.push(route.path)}
                key={i}
                className={
                  "duration-200 ease-out hover:bg-[#E0E0E0] rounded-lg cursor-pointer flex border-l-4 space-x-3 px-1 py-1 justify-start items-center " +
                  `${
                    route.path === router.pathname
                      ? "bg-[#C5DCFA] border-primary"
                      : "border-transparent"
                  } ${route.styling}`
                }
              >
                <div
                  className={
                    "p-2 text-sm rounded-full " + `${route.iconStyling}`
                  }
                >
                  <route.icon></route.icon>
                </div>
                <p className="text-sm">{route.routeName}</p>
              </div>
            ))}
          </div>

          <div className="flex mt-8 duration-200 items-center md:px-0 h-1/6 m-2 rounded-md">
            {loading && <AiOutlineLoading className="text-2xl animate-spin" />}
            {currentUser && (
              <>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img alt="User Profile Pic" src={currentUser.imgUrl} />
                  </div>
                </div>

                <div className="px-2  w-1/2">
                  <p className="text-sm truncate">{currentUser.userName}</p>
                </div>
                <div className="tooltip" data-tip="Edit">
                  <FaPen
                    className="cursor-pointer"
                    onClick={() => router.push("/profile")}
                  />
                </div>
                <div className="tooltip w-1/3" data-tip="Logout">
                  <button
                    onClick={() => setModalState(1)}
                    className="btn btn-sm btn-square btn-outline"
                  >
                    <HiOutlineLogout className="btntext-2xl" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div> */}
      </div>
      {/* <div className="w-64"></div> */}
    </>
  );
};

export default SideBar;
