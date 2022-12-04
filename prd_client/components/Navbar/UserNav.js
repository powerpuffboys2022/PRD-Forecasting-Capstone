import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Loading from "../Loading";

const UserNav = () => {
  const router = useRouter();
  const [modalState, setModalState] = useState(-1);
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);
    loadUser();
  }, []);

  return (
    <nav className="fixed z-10 backdrop-blur-md bg-base-100/40 flex w-full justify-between py-4 px-5 md:px-20 font-inter font-medium ">
      {/* Same as */}
      <div className="flex items-center w-1/3 md:w-1/4">
        {/* <a href="/">Philip Rice Dealer</a> */}
        <img className="h-6" src="/usernavlogo.png" />
      </div>
      <div className="hidden md:flex opacity-90 w-2/4 font-inter  justify-center space-x-12 md:space-x-8 items-center">
        {/* <a className="cursor-pointer" onClick={() => router.push("/shop")}>Home</a> */}
        <a
          className={
            "cursor-pointer hover:font-bold hover:text-lg duration-200 ease-out " +
            `${router.pathname === "/shop" ? "font-bold text-lg" : ""}`
          }
          onClick={() => router.push("/shop")}
        >
          Home
        </a>
        <a
          className={
            "cursor-pointer hover:font-bold hover:text-lg duration-200 ease-out " +
            `${router.pathname.includes("store") ? "font-bold text-lg" : ""}`
          }
          onClick={() => router.push("/shop/store")}
        >
          Store
        </a>
        <a
          className={
            "cursor-pointer hover:font-bold hover:text-lg duration-200 ease-out " +
            `${router.pathname.includes("cart") ? "font-bold text-lg" : ""}`
          }
          onClick={() => router.push("/shop/cart")}
        >
          Cart
        </a>
        <a
          className={
            "cursor-pointer hover:font-bold hover:text-lg duration-200 ease-out " +
            `${
              router.pathname.includes("transaction") ? "font-bold text-lg" : ""
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
            <p className="">{userData.userName}</p>

            <div
              className="avatar cursor-pointer"
              onClick={() => router.push("/general/profile")}
            >
              <div className="w-8 rounded-full">
                <img src={userData.imgUrl} />
              </div>
            </div>
          </>
        )}
        {loading && <Loading loading={loading} />}
      </div>
    </nav>
  );
};

export default UserNav;
