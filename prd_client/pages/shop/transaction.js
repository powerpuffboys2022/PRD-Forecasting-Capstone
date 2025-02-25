import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";
import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";

import { AiFillCloseCircle, AiFillEye } from "react-icons/ai";
import { CiReceipt } from "react-icons/ci";

import {
  getDateAgo,
  beautifyMoney,
  getStatusColor,
  statusToWord,
} from "../../helpers";

import CustomConfirm from "../../components/modals/CustomConfirm";
import CancelConfirm from "../../components/modals/modalCustomContent/CancelConfirm";
import Confirm from "../../components/modals/Confirm";

import { BsSearch } from "react-icons/bs";
import Loading from "../../components/Loading";
import { useRouter } from "next/router";

const Transactions = () => {
  const router = useRouter();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [modalState, setModalState] = useState(-1);
  const [_id, set_id] = useState("");

  const [focusedOrderId, setFocusedOrderId] = useState(-1);

  const loadTransactionsWithFilter = () => {
    setLoading(true);
    const response = fetch("/api/prd/transaction", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content: { _id },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadTransactions = () => {
    setLoading(true);
    if (!userData._id) {
      setLoading(false);
      return;
    }
    let content = { userId: userData._id, isDeleted: false };

    const response = fetch("/api/prd/transaction", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadUserData = () => {
    setLoading(true);
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
      })
      .finally(() => {
        //   setLoading(false);
      });
  };

  useEffect(() => {
    if (userData) loadTransactions();
  }, [userData]);

  useEffect(() => {
    loadUserData();
  }, []);

  const sendMailNotice = async (orderId, reason) => {
    try {
      const resp = await axios.post("/api/prd/mail", {
        email: userData.email,
        content: {
          userName: userData.userName,
          subject: "Order Cancelled",
          template_name: "orderCancelled",
          orderId,
          reason,
          invoiceUrl : `https://prd-forecasting-capstone.vercel.app/general/invoice?invoiceId=${orderId}`,
        },
      });
    } catch (e) {}
  };

  const cancelOrder = (reason) => {
    let content = { status: -1, reason, "trackingDates.canceledDate" : new Date() };
    const response = fetch("/api/prd/transaction", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 2,
        _id: focusedOrderId,
        content,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        sendMailNotice(focusedOrderId, reason)
        loadTransactions();
      })
      .finally(() => {
        setLoading(false);
        setFocusedOrderId(-1);
        setModalState(-1);
      });
  };

  const softDelete = () => {
    let content = { isDeleted: true };
    const response = fetch("/api/prd/transaction", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 2,
        _id: focusedOrderId,
        content,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        loadTransactions();
      })
      .finally(() => {
        setLoading(false);
        setFocusedOrderId(-1);
        setModalState(-1);
      });
  };

  return (
    <div className="h-screen w-full flex justify-center">
      <Head>
        <title>Transaction</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <link itemProp="image" href="cover.png" />
        <meta itemProp="name" content="Philip Rice Dealer" />
        <meta
          itemProp="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta itemProp="image" content="cover.png" />

        <meta
          property="og:url"
          content="https://prd-forecasting-capstone.vercel.app"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Philip Rice Dealer" />
        <meta
          property="og:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta property="og:image" content="cover.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Philip Rice Dealer" />
        <meta
          name="twitter:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta name="twitter:image" content="cover.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CustomConfirm
        title={"Cancel Order"}
        shown={modalState === 1}
        content={
          <CancelConfirm
            acceptText="Proceed"
            declineText="No"
            onAccept={cancelOrder}
            onDecline={() => setModalState(-1)}
          />
        }
      />

      <Confirm
        acceptText={"Proceed"}
        declineText={"No"}
        description={"Are you sure to delete this order record?"}
        onAccept={() => softDelete()}
        onDecline={() => setModalState(0)}
        title={"Delete Record"}
        shown={modalState === 2}
      />

      <div className="mt-14 w-full md:w-5/6 p-2 md:p-8 ">
        <div className="mt-8 w-full">
          <p className="text-lg mt-4 md:mt-8 mx-auto text-center md:text-4xl font-medium font-inter">
            Your Transactions
          </p>
          <p className="mx-auto text-center mt-4 md:mt-6">
            {transactions.length} transaction(s)
          </p>
          <div className="mt-8">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 z-10 left-0 flex items-center pl-3 pointer-events-none">
                <BsSearch className="text-xl" />
              </div>
              <input
                type="search"
                id="default-search"
                value={_id}
                onChange={(e) => {
                  set_id(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    if (_id.length > 0) {
                      loadTransactionsWithFilter();
                    } else loadTransactions();
                }}
                className="block focus:drop-shadow-xl drop-shadow-md duration-200 ease-out w-full p-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-yellow-400 border-gray-300 rounded-lg bg-gray-50"
                placeholder="Search Transaction ID"
                required
              />
              <button
                type="submit"
                onClick={() => {
                  if (_id.length === 0) {
                    loadTransactions();
                  } else {
                    loadTransactionsWithFilter();
                  }
                }}
                className="text-black absolute right-2.5 bottom-2.5 bg-yellow-400 hover:bg-yellow-500 duration-200 ease-in-out focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 "
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="h-4/6 group mt-8 overflow-scroll fade relative">
          <div className="absolute mx-auto left-[50%]">
            <Loading loading={loading} />
          </div>
          <div className="overflow-x-auto w-full">
            {!loading && transactions.length > 0 && (
              <table className="table w-full mx-0 shadow-xl">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Placed</th>
                    <th>Processed</th>
                    <th>Shipped</th>
                    <th>Completed</th>
                    <th>Status</th>
                    <th>Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trans, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-500 duration-150 ease-in-out"
                    >
                      <td>
                        <p className="font-medium text-xs">{trans._id}</p>
                      </td>
                      <td>
                        <div>
                          <p className="text-xs">
                            {moment(new Date(trans.placedDate)).format(
                              "MMM Do YYYY, h:mm:ss a"
                            )}
                          </p>
                          <p className="text-sm opacity-90">
                            {getDateAgo(new Date(), new Date(trans.placedDate))}{" "}
                            days ago
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          {!trans.trackingDates.processed ? (
                            <p className="text-lg font-bold">-</p>
                          ) : (
                            <>
                              <p className="text-xs">
                                {moment(
                                  new Date(trans.trackingDates.processed)
                                ).format("MMM Do YYYY, h:mm:ss a")}
                              </p>
                              <p className="text-sm opacity-90">
                                {getDateAgo(
                                  new Date(),
                                  new Date(trans.trackingDates.processed)
                                )}{" "}
                                days ago
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {!trans.trackingDates.shipped ? (
                            <p className="text-lg font-bold">-</p>
                          ) : (
                            <>
                              <p className="text-xs">
                                {moment(
                                  new Date(trans.trackingDates.shipped)
                                ).format("MMM Do YYYY, h:mm:ss a")}
                              </p>
                              <p className="text-sm opacity-90">
                                {getDateAgo(
                                  new Date(),
                                  new Date(trans.trackingDates.shipped)
                                )}{" "}
                                days ago
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          {!trans.trackingDates.completed ? (
                            <p className="text-lg font-bold">-</p>
                          ) : (
                            <>
                              <p className="text-xs">
                                {moment(
                                  new Date(trans.trackingDates.completed)
                                ).format("MMM Do YYYY, h:mm:ss a")}
                              </p>
                              <p className="text-sm opacity-90">
                                {getDateAgo(
                                  new Date(),
                                  new Date(trans.trackingDates.completed)
                                )}{" "}
                                days ago
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <p
                          className={
                            "font-medium text-sm " +
                            `${getStatusColor(trans.status)}`
                          }
                        >
                          {statusToWord(trans.status)}
                        </p>
                      </td>
                      <td>
                        <p className="font-inter font-medium text-sm">
                          {trans.totalPrice.toLocaleString("en-Us")}
                        </p>
                      </td>
                      <td>
                        <div className="flex items-center justify-center space-x-2">
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Cancel Order"
                          >
                            <button
                              onClick={() => {
                                console.log(trans.status);
                                setFocusedOrderId(trans._id);
                                setModalState(1);
                              }}
                              disabled={trans.status > 2 || trans.status === -1}
                              className={
                                "text-xs text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center mr-2 mb-2 " +
                                `${
                                  trans.status < 2 && trans.status !== -1
                                    ? "cursor-pointer "
                                    : "opacity-50 cursor-not-allowed"
                                }`
                              }
                            >
                              Cancel
                            </button>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip="View Invoice"
                          >
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`/general/invoice?invoiceId=${trans._id}`}
                            >
                              <CiReceipt className="text-xl ease-in-out duration-200 drop-shadow-md text-gray-500 cursor-pointer hover:text-gray-900" />
                            </a>
                          </div>
                          <div
                            className="tooltip tooltip-left"
                            data-tip="Delete"
                            onClick={() => {
                              setFocusedOrderId(trans._id);
                              setModalState(2);
                            }}
                            disabled={trans.status > -1 && trans.status < 4}
                          >
                            <AiFillCloseCircle className="text-xl ease-in-out duration-200 drop-shadow-md text-gray-500 cursor-pointer hover:text-gray-900" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && transactions.length === 0 && (
              <div className="mx-auto">
                <img
                  src="/transaction.png"
                  className="mx-auto w-28 h-28 group-hover:rotate-12 duration-200"
                />
                <p className="text-center font-inter tracking-wider">
                  You have no transactions yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Transactions.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default Transactions;
