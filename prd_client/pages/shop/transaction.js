import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";
import { useState, useEffect } from "react";
import moment from "moment";

import { beautifyMoney, getStatusColor, statusToWord } from "../../helpers"

import { toast } from "react-toastify";

import CustomConfirm from "../../components/modals/CustomConfirm"
import CancelConfirm from "../../components/modals/modalCustomContent/CancelConfirm"

import { BsSearch } from "react-icons/bs";
import Loading from "../../components/Loading";

const transactions = () => {
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
        content: { _id }
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

  const getDateAgo = (current, given) => {
    let a = moment(current);
    let b = moment(given);

    return a.diff(b, "days");
  };

  useEffect(() => {
    if (userData) loadTransactions();
  }, [userData]);

  useEffect(() => {
    loadUserData();
  }, []);

  const cancelOrder = (reason) => {
    let content = { status : -1 , reason};
    const response = fetch("/api/prd/transaction", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: 2,
          _id : focusedOrderId,
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
  }

  return (
    <div className="h-screen w-full flex justify-center">
      <Head>
        <title>Transaction</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CustomConfirm title={"Cancel Order"} shown={modalState === 1} content={
        <CancelConfirm acceptText="Proceed" declineText="No" onAccept={cancelOrder} onDecline={()=>setModalState(-1)} />
      } />
      <div className="mt-14 w-full md:w-5/6 p-2 md:p-8 ">
        <div className="mt-8 w-full">
          <p className="text-xl mt-8 mx-auto text-center md:text-4xl font-medium font-inter">
            Your Transactions
          </p>
          <p className="mx-auto text-center mt-6">
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
                onChange={(e)=>{
                    set_id(e.target.value)
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter")
                      if (_id.length > 0) {
                        loadTransactionsWithFilter()
                      } else loadTransactions();
                  }}
                className="block focus:drop-shadow-xl drop-shadow-md duration-200 ease-out w-full p-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-yellow-400 border-gray-300 rounded-lg bg-gray-50"
                placeholder="Search Transaction ID"
                required
              />
              <button
                type="submit"
                onClick={()=>loadTransactionsWithFilter()}
                className="text-black absolute right-2.5 bottom-2.5 bg-yellow-400 hover:bg-yellow-500 duration-200 ease-in-out focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 "
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="h-4/6 group mt-8 overflow-scroll fade">
          <div className="overflow-x-auto w-full relative">
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
                    <tr key={i} className="hover:bg-gray-500 duration-150 ease-in-out">
                      <td>
                        <p className="font-medium text-xs">{trans._id}</p>
                      </td>
                      <td>
                        <div>
                          <p className="">
                            {moment(new Date(trans.placedDate)).format(
                              "MMMM Do YYYY, h:mm:ss a"
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
                              <p className="">
                                {moment(
                                  new Date(trans.trackingDates.processed)
                                ).format("MMMM Do YYYY, h:mm:ss a")}
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
                              <p className="">
                                {moment(
                                  new Date(trans.trackingDates.shipped)
                                ).format("MMMM Do YYYY, h:mm:ss a")}
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
                              <p className="">
                                {moment(
                                  new Date(trans.trackingDates.completed)
                                ).format("MMMM Do YYYY, h:mm:ss a")}
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
                      <td><p className={"font-medium "+`${getStatusColor(trans.status)}`}>
                        {statusToWord(trans.status)}
                        </p><p className="text-rose-600 text-gray-700 text-green-400 animate-pulse duration-700 text-yellow-500 text-teal-700"></p></td>
                      <td><p className="font-inter font-medium">{beautifyMoney(trans.totalPrice, 2)}</p></td>
                      <td>
                        {trans.status === 1  && <button onClick={()=>{
                            setFocusedOrderId(trans._id)
                            setModalState(1)
                        }} className="btn btn-sm btn-ghost hover:bg-rose-600 hover:text-white">Cancel</button>}
                        {trans.status !== 1 && <button className="btn btn-sm btn-ghost hover:bg-yellow-500 hover:text-white">View</button>}
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
            <div className="absolute top-8 left-auto">
              <Loading loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

transactions.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default transactions;
