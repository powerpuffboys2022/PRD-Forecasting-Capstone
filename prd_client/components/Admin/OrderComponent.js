import { useState, useEffect } from "react";
import { dateMomentBeautify, getDateAgo, statusToWord } from "../../helpers";

import { MdOutlineClose } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";

import getConfig from "next/config";
import { toast } from "react-toastify";
import axios from "axios";
import { itMatchesOne } from "daisyui/src/lib/postcss-prefixer/utils";

const OrderComponent = ({ _id, onUpdate, onDelete, close }) => {
  const { publicRuntimeConfig } = getConfig();
  const [loading, setLoading] = useState(false);

  const [partnerData, setPartnerData] = useState();
  const [editorData, setEditorData] = useState();
  const [orderData, setOrderData] = useState();
  const [you, setYou] = useState();

  const loadPartner = async () => {
    try {
      const request = await axios.post("/api/prd/userInfo", {
        _id: orderData.userId,
      });
      setPartnerData(request.data);
    } catch (e) {}
  };

  const loadEditorData = async () => {
    try {
      if (!orderData.processedBy) return;
      const request = await axios.post("/api/prd/userInfo", {
        _id: orderData.processedBy,
      });
      setEditorData(request.data);
    } catch (e) {}
  };

  const init = async () => {
    try {
      const request = await axios.post("/api/prd/transaction", {
        mode: 4,
        content: { _id },
      });
      setOrderData(request.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartner();
    loadEditorData();
  }, [orderData]);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-medium mt-4">Order Details</p>
        <MdOutlineClose
          onClick={() => close()}
          className="text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
        />{" "}
      </div>

      <div className="p-4 mt-4 w-full border rounded-md mx-auto">
        <div className="flex flex-col items-center">
          {loading ? (
            <></>
          ) : (
            <>
              {partnerData ? (
                <>
                  <div className="w-full flex justify-center">
                    <div className="avatar">
                      <div className="w-48 rounded-full smooth-shadow2">
                        <img src={partnerData.imgUrl} className="" />
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-lg font-medium inline-flex items-center text-gray-600 mt-4">
                    <span>{partnerData.userName}</span>
                  </p>
                  <p className="text-center inline-flex items-center text-gray-600 mt-4">
                    <FaHandshake className="text-2xl mr-2" />
                    <span>PRD Partner</span>
                  </p>
                  <p className="text-center text-xs text-gray-600 mt-4">
                    Joined on{" "}
                    {dateMomentBeautify(
                      new Date(partnerData.dateJoined),
                      "MMMM Do YYYY"
                    )}
                  </p>
                </>
              ) : (
                <p className="text-center text-sm text-red-700">
                  couldn&apos;t load partner data
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {orderData && orderData.status === -1 && (
        <div className="bg-red-50 p-4 w-full ">
          <div
            className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <AiOutlineStop className="text-xl mr-2 text-red-600" />
            <span className="sr-only">Cancelled</span>
            <div>
              <span className="font-medium">
                This order has been cancelled.
              </span>
            </div>
          </div>
          <p className="mt-4 text-rose-700 ">
            <span className="text-gray-700 font-medium">Reason : </span>
            {orderData.reason}
          </p>
        </div>
      )}

      {orderData && (
        <div className="p-4 border mt-6">
          <p className="text-lg font-medium">Tracking</p>
          <ol className="ml-4 mt-4 relative text-gray-500 border-l border-gray-200">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-green-500 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
              <h3 className="font-medium leading-tight">Placed</h3>
              <p className="text-sm"></p>
            </li>

            {orderData.status === -1 ? (
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path
                      fill-rule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </span>
                <h3 className="font-medium leading-tight">Completed</h3>
                <p className="text-sm">Step details here</p>
              </li>
            ) : (
              <>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <h3 className="font-medium leading-tight">Processed</h3>
                  <p className="text-sm"></p>
                </li>
                <li className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <h3 className="font-medium leading-tight">Shipped</h3>
                  <p className="text-sm">Step details here</p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <h3 className="font-medium leading-tight">Completed</h3>
                  <p className="text-sm">Step details here</p>
                </li>
              </>
            )}
          </ol>
        </div>
      )}
    </div>
  );
};

export default OrderComponent;
