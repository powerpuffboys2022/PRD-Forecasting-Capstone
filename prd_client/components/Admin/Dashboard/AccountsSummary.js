import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import axios from "axios";
import Loading from "../../Loading";

const AccountsSummary = ({ trigger, className }) => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    try {
      setLoading(true);
      const accs = await axios.post("/api/prd/updateUser", {
        mode: 3,
        filter: { userType: tab, isDeleted: false },
      });
      setAccounts(accs.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [tab]);

  return (
    <div
      className={`bg-white rounded-lg smooth-shadow-fade smooth-shadow-fine ${className}`}
    >
      <div className="px-4 pt-4 flex justify-between items-center">
        <p className="text-3xl">
          {accounts.length}
          <span className={`text-sm font-medium pt-4 text-gray-500 ml-2`}>
            {tab === 1 ? "partners" : "admins"}
          </span>
        </p>
        <div
          onClick={() => router.push("/admin/accounts")}
          className="group p-1 mr-2 hover:bg-gray-100 bg-transparent ease-in-out duration-200 rounded-md cursor-pointer"
        >
          <svg
            className="h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <polygon points="0 0 24 0 24 24 0 24" />
              <path
                className="animateonchange group-hover:text-blue-300"
                d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z"
                fill="currentColor"
                fillRule="nonzero"
                opacity="0.3"
              />
              <path
                className="animateonchange group-hover:text-blue-300"
                d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z"
                fill="currentColor"
                fillRule="nonzero"
              />
            </g>
          </svg>
        </div>
      </div>
      <div className="mt-1 flex justify-start items-center">
        <p
          onClick={() => setTab(0)}
          className={`animateonchange cursor-pointer p-4 text-xs font-medium ${
            tab === 0 ? "border-b border-blue-500" : ""
          }`}
        >
          Partners
        </p>
        <p
          onClick={() => setTab(1)}
          className={`animateonchange cursor-pointer p-4 text-xs font-medium ${
            tab === 1 ? "border-b border-blue-500" : ""
          }`}
        >
          Admins
        </p>
      </div>
      <div className="p-4 min-h-8 overflow-y-scroll">
        <div className="flex -space-x-4">
          {!loading &&
            accounts.filter((accs,i) => (i + 1) <= 10 ).map((accs, i) => (
              <div
                key={i}
                className="tooltip tooltip-right z-10 hover:z-50"
                data-tip={accs.userName}
              >
                <div
                  className="w-12 h-12 animateonchange hover:scale-110 border-2 border-white rounded-full dark:border-gray-800 bg-cover"
                  style={{ backgroundImage: `url(${accs.imgUrl})` }}
                  alt={accs.userName}
                />
              </div>
            ))}
          {
            accounts.length > 10 && <p className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800">{accounts.length - 10}+</p>
          }
          
        </div>
        {accounts.length === 0 && !loading && (
          <p className="text-xs text-center text-gray-400">No accounts found</p>
        )}
        {loading && (
          <div className="flex justify-center">
            <Loading loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsSummary;
