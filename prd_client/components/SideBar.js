import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { HiOutlineHome, HiOutlineLogout, HiUser } from "react-icons/hi";
import { BsTruck } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { GoPackage } from "react-icons/go";
import { ImStatsDots } from "react-icons/im";
import { AiOutlineLoading } from "react-icons/ai";
import { FaPen } from "react-icons/fa";

import LogoutConfirm from "./modals/Confirm";

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
      path: "/",
      styling: "text-[#730C8F]",
      iconStyling: "bg-white",
    },
    {
      routeName: "Orders",
      icon: BsTruck,
      path: "/orders",
      styling: "text-[#0A3977]",
      iconStyling: "bg-[#C5DCFA]",
    },
    {
      routeName: "Daily Sales",
      icon: MdAttachMoney,
      path: "/dailySales",
      styling: "text-[#155D18]",
      iconStyling: "bg-[#C5F2C7]",
    },
    {
      routeName: "Sales Forecasting",
      icon: ImStatsDots,
      path: "/salesForecasting",
      styling: "text-[#7F4C0A]",
      iconStyling: "bg-[#FBE5C9]",
    },
    {
      routeName: "Inventory",
      icon: GoPackage,
      path: "/inventory",
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
      <div className="card rounded-none fixed z-40 w-64 py-3 h-screen shadow-lg duration-300 ease-in-out top-0">
        <div className="mt-3  mx-4">
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
        </div>
      </div>
      <div className="w-64"></div>
    </>
  );
};

export default SideBar;
