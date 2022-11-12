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
    <nav className="flex w-full justify-between py-4 px-5 md:px-20 font-inter font-medium ">
      <div className="flex items-center w-1/4">
        <a href="/">Philip Rice Dealer</a>
      </div>
      <div className="opacity-90 w-2/4 flex justify-center space-x-12 md:space-x-16 items-center">
        {/* <a className="cursor-pointer" onClick={() => router.push("/shop")}>Home</a> */}
        <a className="cursor-pointer" onClick={() => router.push("/shop")}>Our Rice</a>
        <a className="cursor-pointer" onClick={() => router.push("/shop/about")}>About</a>
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
