import React, { useState, useEffect } from "react";
import axios from "axios";

import { statusToWord } from "../../../helpers";
import { useRouter } from "next/router";

import Loading from "../../Loading";

const OrderSummary = ({ trigger, className }) => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(1);

  const init = async () => {
    try {
      setLoading(true)
      const res = await axios.post("/api/prd/transaction", {
        mode: 11,
        project: {
          _id: 1,
          totalPrice: 1,
          "ownerInfo.userName": 1,
          "ownerInfo.imgUrl": 1,
          status: 1,
        },
        filter: {
          status: tab,
          isDeleted : false
        },
      });
      setOrders(res.data);
      setLoading(false)
    } catch (e) {setLoading(false)}
  };

  useEffect(() => {
    init();
  }, [tab]);

  return (
    <div
      className={`bg-white rounded-lg smooth-shadow-fade smooth-shadow-fine ${className}`}
    >
      <div className="px-4 pt-4 flex justify-between items-center">
        <p className="">
            Order Summary <br/>
          <span className="text-gray-500 text-xs">{orders.length} {statusToWord(tab)}</span>
        </p>
        <div
          onClick={() => router.push("/admin/orders")}
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
              <rect x="0" y="0" width="24" height="24" />
              <rect
                className="animateonchange group-hover:-translate-x-1 group-hover:text-blue-300"
                fill="currentColor"
                x="4"
                y="4"
                width="7"
                height="7"
                rx="1.5"
              />
              <path
                className="animateonchange group-hover:rotate-12 group-hover:translate-x-1 group-hover:text-blue-300"
                d="M5.5,13 L9.5,13 C10.3284271,13 11,13.6715729 11,14.5 L11,18.5 C11,19.3284271 10.3284271,20 9.5,20 L5.5,20 C4.67157288,20 4,19.3284271 4,18.5 L4,14.5 C4,13.6715729 4.67157288,13 5.5,13 Z M14.5,4 L18.5,4 C19.3284271,4 20,4.67157288 20,5.5 L20,9.5 C20,10.3284271 19.3284271,11 18.5,11 L14.5,11 C13.6715729,11 13,10.3284271 13,9.5 L13,5.5 C13,4.67157288 13.6715729,4 14.5,4 Z M14.5,13 L18.5,13 C19.3284271,13 20,13.6715729 20,14.5 L20,18.5 C20,19.3284271 19.3284271,20 18.5,20 L14.5,20 C13.6715729,20 13,19.3284271 13,18.5 L13,14.5 C13,13.6715729 13.6715729,13 14.5,13 Z"
                fill="currentColor"
                opacity="0.3"
              />
            </g>
          </svg>
        </div>
      </div>
      <div className="mt-1 border-b flex justify-start items-center">
        <p
          onClick={() => setTab(1)}
          className={`animateonchange cursor-pointer p-4 text-xs font-medium ${
            tab === 1 ? "border-b border-blue-500" : ""
          }`}
        >
          Pending
        </p>
        <p
          onClick={() => setTab(2)}
          className={`animateonchange cursor-pointer p-4 text-xs font-medium ${
            tab === 2 ? "border-b border-blue-500" : ""
          }`}
        >
          In Progress
        </p>
        <p
          onClick={() => setTab(3)}
          className={`animateonchange cursor-pointer p-4 text-xs font-medium ${
            tab === 3 ? "border-b border-blue-500" : ""
          }`}
        >
          Shipped
        </p>
        <p
          onClick={() => setTab(4)}
          className={`animateonchange cursor-pointer p-4 text-xs font-medium ${
            tab === 4 ? "border-b border-blue-500" : ""
          }`}
        >
          Completed
        </p>
      </div>
      <div className="p-4 h-48 overflow-y-scroll">
        {!loading && orders.map((ords) => (
          <div
            className="text-sm flex justify-between items-center py-2 border-t border-dashed border-gray-300"
            key={ords._id}
          >
            <div className="flex justify-start items-center space-x-2">
              <div className="avatar cursor-pointer">
                <div className="w-8 rounded-full">
                  <img src={ords.ownerInfo[0].imgUrl} />
                </div>
              </div>
              <p className="text-xs font-medium">
                <span className="text-xs text-gray-500">By</span>{" "}
                {ords.ownerInfo[0].userName}
              </p>
            </div>
            <p className="text-sm font-medium">
              {ords.totalPrice.toLocaleString()}
            </p>
          </div>
        ))}
        {orders.length === 0 && !loading && (
          <p className="text-xs text-center text-gray-400">
            No {statusToWord(tab)} found
          </p>
        )}
        { loading && <div className="flex justify-center"><Loading loading={loading}/></div>}
      </div>
    </div>
  );
};

export default OrderSummary;
