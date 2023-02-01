import Head from "next/head";
import { useState, useEffect } from "react";
import HomeLayout from "../../layouts/HomeLayout";
import axios from "axios";

import { toast } from "react-toastify";
import { Pagination } from "react-headless-pagination";

import { MdPendingActions, MdLocalShipping } from "react-icons/md";
import { TbTruckLoading } from "react-icons/tb";
import { CiReceipt } from "react-icons/ci";
import { IoMdCheckmark } from "react-icons/io";
import { HiTrash } from "react-icons/hi";
import { AiOutlineFileDone, AiOutlineStop, AiFillDelete } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { VscLoading, VscError } from "react-icons/vsc";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import {
  scanVals,
  statusToWord,
  statusToComponentWord,
  dateMomentBeautify,
  getDateAgo,
} from "../../helpers";

import OrderComponent from "../../components/Admin/OrderComponent";
import CustomConfirm from "../../components/modals/CustomConfirm";

const Orders = () => {
  const [tab, setTab] = useState(-2);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(-1);
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageMax, setPageMax] = useState(10);

  const [orders, setOrders] = useState([]);
  const [cOrders, setCOrders] = useState([]);
  const [editorData, setEditorData] = useState();

  const [focused, setFocused] = useState();

  const [selected, setSelected] = useState();
  const [marked, setMarked] = useState([]);

  const loadEditorData = async () => {
    try {
      const request = await axios.post("/api/prd/userInfo", {});
      setEditorData(request.data);
    } catch (e) {}
  };

  const init = async () => {
    try {
      setOrders([]);
      setCOrders([]);
      setLoading(true);
      let orders = await axios.post("/api/prd/transaction", { mode: 0 });
      setSearch("");
      setSelected(null);
      setReason("");
      orders = orders.data.map((obj) => {
        return {
          ...obj,
          datew: dateMomentBeautify(new Date(obj.placedDate), "MM-DD-YYYY, "),
          w_status: statusToWord(obj.status),
        };
      });
      setOrders(orders);
      setCOrders(orders);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const filterOrder = () => {
    let candidates = cOrders.filter((data) =>
      scanVals(data, search, ["datew", "userId", "processedBy"])
    );
    if (tab !== -2)
      candidates = candidates.filter((data) => data.status === tab);
    setCurrentPage(0);
    setOrders(candidates);
  };

  const batchDelete = async () => {
    try {
      const request = await axios.post("/api/prd/transaction", {
        mode: -2,
        batch: [
          ...marked.map((id) => {
            return { _id: id };
          }),
        ],
      });
      toast.success("Successfuly deleted", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <HiTrash className="text-2xl text-green-500" />,
      });
      setMarked([]);
      init();
    } catch (e) {
      toast.error("Failed to delete", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <VscError className="text-2xl text-red-500" />,
      });
    } finally {
    }
  };

  const accept = async (order) => {
    try {
      let content = { ...order, status: 2 };
      content.trackingDates.processed = new Date();
      if (editorData) {
        content.processedBy = editorData._id;
        content.updatedBy = editorData._id;
      }
      const request = await axios.post("/api/prd/transaction", {
        mode: 2,
        _id: content._id,
        content,
        updateProduct: true,
        incr: false,
      });
      init();
      toast.success("Successfuly Accepted", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <IoMdCheckmark className="text-2xl text-green-500" />,
      });
    } catch (e) {
      toast.success("Failed to accept", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <VscError className="text-2xl text-red-500" />,
      });
    } finally {
    }
  };

  const decline = async (order) => {
    try {
      let content = { ...order, status: -1, reason };
      content.trackingDates.canceledDate = new Date();
      if (editorData) {
        content.processedBy = editorData._id;
        content.updatedBy = editorData._id;
      }
      const request = await axios.post("/api/prd/transaction", {
        mode: 2,
        _id: content._id,
        content,
        updateProduct: order.status > 1,
        incr: order.status >= 2,
      });
      init();
      toast.success("Successfuly declined", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (e) {
      toast.success("Failed to decline", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <VscError className="text-2xl text-red-500" />,
      });
    } finally {
    }
  };

  const ship = async (order) => {
    try {
      let content = { ...order, status: 3 };
      content.trackingDates.shipped = new Date();
      if (editorData) {
        content.processedBy = editorData._id;
      }
      const request = await axios.post("/api/prd/transaction", {
        mode: 2,
        _id: content._id,
        content,
      });
      init();
      toast.success("Set status to Shipped", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (e) {
      toast.success("Failed to update status", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <VscError className="text-2xl text-red-500" />,
      });
    } finally {
    }
  };

  const completed = async (order) => {
    try {
      let content = { ...order, status: 4 };
      let completedw = dateMomentBeautify(
        content.trackingDates.completed,
        "YYYY-MM-DD"
      );
      console.log(completedw);
      content.trackingDates.completed = new Date();
      if (editorData) {
        content.processedBy = editorData._id;
        content.updatedBy = editorData._id;
        content.completedDateWord = completedw;
      }
      const request = await axios.post("/api/prd/transaction", {
        mode: 2,
        _id: content._id,
        content,
        pushToForeCast: true,
      });
      init();
      toast.success("Order Completed", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (e) {
      toast.error("Failed to update", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <VscError className="text-2xl text-red-500" />,
      });
    } finally {
    }
  };

  const getQty = (ords) => {
    let qty = 0;
    ords.rice.forEach((r) => (qty += r.qty));
    return `${qty}`;
  };

  const statusToIcon = (status) => {
    if (status === -1)
      return <AiOutlineStop className="text-rose-400 text-sm" />;
    if (status === 1)
      return <MdPendingActions className="text-yellow-500 text-sm" />;
    if (status === 2)
      return <TbTruckLoading className="text-blue-700 text-sm" />;
    if (status === 3)
      return <MdLocalShipping className="text-indigo-700 text-sm" />;
    if (status === 4)
      return <AiOutlineFileDone className="text-green-700 text-sm" />;
    return "untracked";
  };

  const statusToBadge = (status) => {
    if (status === -1)
      return (
        <a className="bg-red-50 text-rose-400 text-xs font-medium mr-2 inline-flex items-center px-2 py-1 rounded-full space-x-2">
          {statusToIcon(status)}
          {statusToComponentWord(status)}
        </a>
      );
    if (status === 1)
      return (
        <a className="bg-yellow-50 animate-pulse text-yellow-500 text-xs font-medium mr-2 inline-flex items-center px-2 py-1 rounded-full space-x-2">
          {statusToIcon(status)}
          {statusToComponentWord(status)}
        </a>
      );
    if (status === 2)
      return (
        <a className="bg-blue-50 text-blue-700 text-xs font-medium mr-2 inline-flex items-center px-2 py-1 rounded-full space-x-2">
          {statusToIcon(status)}
          {statusToComponentWord(status)}
        </a>
      );
    if (status === 3)
      return (
        <a className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 inline-flex items-center px-2 py-1 rounded-full space-x-2">
          {statusToIcon(status)}
          {statusToComponentWord(status)}
        </a>
      );
    if (status === 4)
      return (
        <a className="bg-green-100 text-green-700 text-xs font-medium mr-2 inline-flex items-center px-2 py-1 rounded-full space-x-2">
          {statusToIcon(status)}
          {statusToComponentWord(status)}
        </a>
      );
    return "untracked";
  };

  useEffect(() => {
    init();
    loadEditorData();
    setCurrentPage(0);
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    setMarked([]);
    filterOrder();
  }, [tab, cOrders]);

  return (
    <div className="font-poppins overflow-hidden h-screen flex flex-col flex-grow bg-[#f5f8fa]">
      <Head>
        <title>Orders</title>
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
        shown={modal === 1}
        title={"Delete Order Record"}
        content={
          <div className="mt-6">
            <p>
              You are about to delete{" "}
              <span className="font-medium">{marked.length}</span> record from
              orders record.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setModal(-1);
                  batchDelete();
                }}
                type="button"
                className="hover:text-white  hover:bg-red-800 focus:ring-4 focus:ring-red-300 border outline-red-600 duration-200 ease-in-out w-full cursor-pointer focus:outline-none text-red-500 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                I understand the consequence of deleting this Order
              </button>
            </div>
            <p
              onClick={() => setModal(-1)}
              className="mt-4 text-center text-sm link"
            >
              Cancel
            </p>
          </div>
        }
      />

      {focused && (
        <CustomConfirm
          shown={modal === 2}
          title={"Decline Order"}
          content={
            <div className="mt-6">
              <p>
                You are about to decline order{" "}
                <span className="font-mono text-sm">{focused._id}</span> from
                orders record. Please provide a reason for declining the order.
              </p>
              <textarea
                id="message"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-4 block p-2.5 w-full text-sm text-gray-900 outline-none bg-gray-50 rounded-lg border border-gray-300 ring ring-transparent ease-in-out duration-150 focus:ring-red-100"
                placeholder="Write your reason..."
              ></textarea>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setModal(-1);
                    decline(focused);
                  }}
                  type="button"
                  disabled={reason.length === 0}
                  className={
                    `${
                      reason.length === 0
                        ? "opacity-50"
                        : "hover:text-white  hover:bg-red-800 focus:ring-4 focus:ring-red-300 border outline-red-600"
                    }` +
                    " duration-200 ease-in-out w-full cursor-pointer focus:outline-none text-red-500 font-medium rounded-lg text-sm px-5 py-2.5"
                  }
                >
                  I understand the consequence of declining this Order
                </button>
              </div>
              <p
                onClick={() => setModal(-1)}
                className="mt-4 text-center text-sm link"
              >
                Cancel
              </p>
            </div>
          }
        />
      )}

      <main className="p-4 h-full relative">
        <div
          onClick={() => setSelected(null)}
          className=" h-1/6 flex mt-2 items-center rounded-lg justify-between text-sm smooth-shadow-thin bg-white p-2 font-medium text-center text-gray-500"
        >
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <a
                href="#"
                onClick={() => {
                  init();
                  setTab(-2);
                }}
                className={
                  "inline-flex p-4 rounded-t-lg ease-in-out duration-300 " +
                  `${
                    tab === -2
                      ? "active border-b-2 border-gray-600 text-gray-600 "
                      : ""
                  }`
                }
              >
                All
              </a>
            </li>

            <li className="mr-2">
              <a
                href="#"
                onClick={() => setTab(1)}
                className={
                  "inline-flex p-4 rounded-t-lg ease-in-out duration-300 " +
                  `${
                    tab === 1
                      ? "active border-b-2 border-yellow-600 text-yellow-600 "
                      : ""
                  }`
                }
              >
                <MdPendingActions className="h-6 w-6 mr-2" />
                Pending
                <span className="ml-1 flex items-center justify-center text-xs font-semibold bg-gray-100 h-6 px-2 rounded-full">
                  {cOrders.filter((o) => o.status === 1).length}
                </span>
              </a>
            </li>

            <li className="mr-2">
              <a
                href="#"
                onClick={() => setTab(2)}
                className={
                  "inline-flex p-4 rounded-t-lg ease-in-out duration-300  border-transparent " +
                  `${
                    tab === 2
                      ? "active border-b-2 border-blue-600 text-blue-600 "
                      : ""
                  }`
                }
              >
                <TbTruckLoading className="h-6 w-6 mr-2" />
                Processing
                <span className="ml-1 flex items-center justify-center text-xs font-semibold bg-gray-100 h-6 px-2 rounded-full">
                  {cOrders.filter((o) => o.status === 2).length}
                </span>
              </a>
            </li>

            <li className="mr-2">
              <a
                href="#"
                onClick={() => setTab(3)}
                className={
                  "inline-flex p-4 rounded-t-lg ease-in-out duration-300  border-transparent " +
                  `${
                    tab === 3
                      ? "active border-b-2 border-indigo-600 text-indigo-600 "
                      : ""
                  }`
                }
              >
                <MdLocalShipping className="h-6 w-6 mr-2" />
                Shipped
                <span className="ml-1 flex items-center justify-center text-xs font-semibold bg-gray-100 h-6 px-2 rounded-full">
                  {cOrders.filter((o) => o.status === 3).length}
                </span>
              </a>
            </li>

            <li className="mr-2">
              <a
                href="#"
                onClick={() => setTab(4)}
                className={
                  "inline-flex p-4 rounded-t-lg ease-in-out duration-300  border-transparent " +
                  `${
                    tab === 4
                      ? "active border-b-2 border-green-600 text-green-600 "
                      : ""
                  }`
                }
              >
                <AiOutlineFileDone className="h-6 w-6 mr-2" />
                Completed
                <span className="ml-1 flex items-center justify-center text-xs font-semibold bg-gray-100 h-6 px-2 rounded-full">
                  {cOrders.filter((o) => o.status === 4).length}
                </span>
              </a>
            </li>

            <li className="mr-2">
              <a
                href="#"
                onClick={() => setTab(-1)}
                className={
                  "inline-flex p-4 rounded-t-lg ease-in-out duration-300  " +
                  `${
                    tab === -1
                      ? "active border-b-2 border-red-600 text-red-600 "
                      : ""
                  }`
                }
              >
                <AiOutlineStop className="h-6 w-6 mr-2" />
                canceled
                <span className="ml-1 flex items-center justify-center text-xs font-semibold bg-gray-100 h-6 px-2 rounded-full">
                  {cOrders.filter((o) => o.status === -1).length}
                </span>
              </a>
            </li>
          </ul>

          <form onSubmit={(e) => e.preventDefault()} className="grow mr-2">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-stone-800 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative  mx-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BsSearch className="text-xl" />
              </div>
              <input
                onChange={(e) => {
                  if (e.target.value === "") {
                    filterOrder();
                  }
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    filterOrder();
                  }
                }}
                type="search"
                id="default-search"
                className="block w-60 outline-none p-3 pl-10 text-sm text-stone-800 border border-gray-300 rounded-lg bg-gray-50 "
                placeholder="search by Order ID, Customer ID, Status"
                required
              />
              {/* <button
                  type="submit"
                  onClick={(e)=>{ }}
                  className="text-gray-700 border hover:text-white absolute right-3 bottom-2.5 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 "
                >
                  Search
                </button> */}
            </div>
          </form>
        </div>

        <div className="pt-3 h-5/6 overflow-y-scroll">
          {(tab === -1 || tab === 4) && (
            <div className="mt-4 rounded-md bg-white space-x-1 w-full p-2 text-xs ">
              <button
                onClick={() => setModal(1)}
                className={
                  "border rounded-lg border-transparent hover:border-red-700 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex gap-2 duration-150 ease-in-out " +
                  `${marked.length === 0 ? "btn-disabled" : ""}`
                }
              >
                <AiFillDelete className="text-xl" />
                Delete Selected
              </button>
            </div>
          )}

          {loading ? (
            <>
              {loading && (
                <div className="w-full mt-16 flex justify-center items-center h-16">
                  <VscLoading className="animate-spin text-2xl" />
                </div>
              )}
            </>
          ) : (
            <>
              {orders.length === 0 ? (
                <div className="w-full flex justify-center items-center h-16">
                  <p className="text-center text-gray-400 text-sm">
                    no orders yet
                  </p>
                </div>
              ) : (
                <div className="relative mb-4 bg-white overflow-x-auto overflow-y-scroll shadow-md sm:rounded-lg" >
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        {(tab === 1 || tab===4 || tab === -1) && (
                          <th scope="col" className="p-4">
                            <div className="flex items-center">
                              <input
                                id="checkbox-all-search"
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setMarked(orders.map((ids) => ids._id));
                                  } else {
                                    setMarked([]);
                                  }
                                }}
                                checked={orders.length === marked.length}
                                className="checkbox"
                              />
                            </div>
                          </th>
                        )}
                        <th scope="col" className="px-6 py-3">
                          Order Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Order Cost
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total Items
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          ...
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...orders].map((ords, idx) => (
                        <>
                          {idx >= currentPage * pageMax &&
                          idx + 1 <= currentPage * pageMax + pageMax ? (
                            <tr
                              key={idx}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              {(tab === 1 || tab===4 || tab === -1) && (
                                <td className="w-4 p-4">
                                  <div className="flex items-center">
                                    <input
                                      id="checkbox-table-search-2"
                                      type="checkbox"
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setMarked([...marked, ords._id]);
                                        } else {
                                          setMarked(
                                            marked.filter(
                                              (ids) => ids !== ords._id
                                            )
                                          );
                                        }
                                      }}
                                      checked={
                                        marked.filter((ids) => ids === ords._id)
                                          .length > 0
                                      }
                                      className="checkbox"
                                    />
                                  </div>
                                </td>
                              )}
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {ords.datew}
                                <span className="text-xs text-gray-500">
                                  (
                                  {getDateAgo(
                                    new Date(),
                                    new Date(ords.placedDate)
                                  )}{" "}
                                  days ago)
                                </span>
                              </th>
                              <td className="px-6 py-4">
                                {ords.totalPrice.toLocaleString("en-Us")}
                              </td>
                              <td className="px-6 py-4">{getQty(ords)}x</td>
                              <td className="px-6 py-4 flex items-center justify-between">
                                {statusToBadge(ords.status)}
                                {(ords.status === 1 ||
                                  ords.status === 3 ||
                                  ords.status === 2) ? 
                                  <div className="flex justify-between items-center">
                                    {ords.status === 1 && (
                                      <button
                                        onClick={() => accept(ords)}
                                        type="button"
                                        className="text-xs text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center mr-2 mb-2"
                                      >
                                        Accept{" "}
                                        <IoMdCheckmark className="ml-2 text-sm" />
                                      </button>
                                    )}
                                    {ords.status === 2 && (
                                      <button
                                        onClick={() => ship(ords)}
                                        type="button"
                                        className="text-xs text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center mr-2 mb-2"
                                      >
                                        Ship{" "}
                                        <MdLocalShipping className="ml-2 text-sm" />
                                      </button>
                                    )}
                                    {ords.status === 3 && (
                                      <button
                                        onClick={() => completed(ords)}
                                        type="button"
                                        className="text-xs text-green-800 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center mr-2 mb-2"
                                      >
                                        Complete{" "}
                                        <AiOutlineFileDone className="ml-2 text-sm" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setModal(2);
                                        setFocused(ords);
                                      }}
                                      type="button"
                                      className="text-xs text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center mr-2 mb-2"
                                    >
                                      Decline{" "}
                                      <AiOutlineStop className="ml-2 text-sm" />
                                    </button>
                                  </div> : <div className="w-16"></div>
                                }
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className="tooltip tooltip-left"
                                  data-tip="View Order Details"
                                >
                                  <CiReceipt
                                    onClick={() => setSelected(ords)}
                                    className="text-2xl ease-in-out duration-200 drop-shadow-md text-gray-500 cursor-pointer hover:text-gray-900"
                                  />
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center mt-1 px-4 py-2 justify-between">
                    {/* <p className="text-xs text-gray-500">
                        Showing <span className="font-medium text-gray-700">{currentPage * pageMax}</span>-
                        <span className="font-medium text-gray-700">{currentPage * pageMax + pageMax}</span> of <span className="font-medium text-gray-700">{orders.length}{" "}</span>
                      </p>   */}
                    <select
                      id="countries"
                      onChange={(e) => {
                        setPageMax(parseInt(e.target.value));
                      }}
                      value={pageMax}
                      className="bg-gray-50 hover:bg-gray-100 ease-in-out cursor-pointer text-gray-600 text-xs rounded-lg w-16 outline-none block p-2.5 px-3 "
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={20}>25</option>
                      <option value={20}>50</option>
                    </select>
                    {orders.length >= pageMax ? (
                      <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={Math.ceil(orders.length / pageMax)}
                        edgePageCount={2}
                        middlePagesSiblingCount={2}
                        className="flex space-x-1 text-sm"
                        truncableText="..."
                        truncableClassName=""
                      >
                        <Pagination.PrevButton className="rounded-md cursor-pointer hover:bg-gray-100 px-2 py-1  ease-in text-gray-400 duration-200 hover:text-blue-700 hover:smooth-shadow-fade">
                          <ChevronLeftIcon className="h-5 w-5" />
                        </Pagination.PrevButton>

                        <div className="flex items-center justify-center flex-grow">
                          <Pagination.PageButton
                            activeClassName="bg-[#009ef7] smooth-shadow-fade text-white"
                            inactiveClassName=""
                            className="px-3 py-1 rounded-md cursor-pointer ease-in duration-200 hover:bg-[#0f96e4]"
                          />
                        </div>

                        <Pagination.NextButton className="rounded-md cursor-pointer hover:bg-gray-100 px-2 py-1 ease-in text-gray-400 duration-200 hover:text-blue-700  hover:smooth-shadow-fade">
                          <ChevronRightIcon className="h-5 w-5" />
                        </Pagination.NextButton>
                      </Pagination>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div
          className={
            "smooth-shadow2 p-4 flex duration-500 overflow-y-scroll ease-in-out w-1/2 h-full bg-white/80 absolute top-0 backdrop-blur-lg " +
            `${selected ? " right-0" : "  -right-full"}`
          }
        >
          {selected && (
            <OrderComponent
              close={() => setSelected(null)}
              _id={selected._id}
              onUpdate={() => init()}
              onDelete={() => init()}
              onAccept={(ords) => {
                accept(ords);
              }}
              onDecline={(ords) => {
                setModal(2);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

Orders.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Orders;
