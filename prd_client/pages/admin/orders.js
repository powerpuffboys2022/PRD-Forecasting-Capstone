import Head from "next/head";
import { useState, useEffect } from "react";
import HomeLayout from "../../layouts/HomeLayout";
import axios from "axios";

import { MdPendingActions, MdLocalShipping } from "react-icons/md";
import { TbTruckLoading, TbDotsVertical } from "react-icons/tb";
import {
  AiOutlineFileDone,
  AiOutlineStop,
  AiFillDelete,
  AiFillCheckCircle,
} from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { VscLoading } from "react-icons/vsc";

import {
  scanVals,
  statusToIcon,
  statusToWord,
  dateMomentBeautify,
  getDateAgo,
} from "../../helpers";

import OrderComponent from "../../components/Admin/OrderComponent";

const Orders = () => {
  const [tab, setTab] = useState(-2);
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [modal, setModal] = useState(-1);
  const [search, setSearch] = useState("");

  const [orders, setOrders] = useState([]);
  const [cOrders, setCOrders] = useState([]);

  const [selected, setSelected] = useState();

  const [marked, setMarked] = useState([]);

  const init = async () => {
    try {
      setLoading(true);
      let orders = await axios.post("/api/prd/transaction", { mode: 0 });
      setSearch("");
      setSelected(null);
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
    setOrders(candidates);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setMarked([])
    filterOrder();
  }, [tab]);

  return (
    <div className="font-poppins h-screen flex flex-col flex-grow bg-[#f2f5fa]">
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
      <main className="p-4 h-full bg-white relative">
        <div className=" h-1/6 flex mt-2 items-center justify-between text-sm shadow-md bg-white p-2 font-medium text-center text-gray-500">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <a
                href="#"
                onClick={() => setTab(-2)}
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
                Cancelled
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
          <div className="mt-4 space-x-1 w-full p-2 text-xs bg-white ">
            <button
              className={
                "border rounded-lg border-transparent hover:border-red-700 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex gap-2 duration-150 ease-in-out " +
                `${marked.length === 0 ? "btn-disabled" : ""}`
              }
            >
              <AiFillDelete className="text-xl" />
              Delete Selected
            </button>
            {(tab === 1 || tab === 2) && (
                <>
                  {tab === 1 && (
                    <button
                      className={"border rounded-lg border-transparent hover:border-yellow-700 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex gap-2 duration-150 ease-in-out "+`${marked.length === 0 ? "btn-disabled" : ""}`}
                    >
                      <AiFillCheckCircle className="text-xl" />
                      Accept Selected
                    </button>
                  )}
                  <button
                    className={"border rounded-lg border-transparent hover:border-red-700 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex gap-2 duration-150 ease-in-out "+`${marked.length === 0 ? "btn-disabled" : ""}`}
                  >
                    <AiOutlineStop className="text-xl" />
                    Decline Selected
                  </button>
                </>
              )}
              {
                tab === 2 && <button
                className={
                  "border rounded-lg border-transparent hover:border-indigo-700 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex gap-2 duration-150 ease-in-out " +
                  `${marked.length === 0 ? "btn-disabled" : ""}`
                }
              >
                <MdLocalShipping className="text-xl" />
                Set Selected as shipped
              </button>
              }
              {
                tab === 3 && <button
                className={
                  "border rounded-lg border-transparent hover:border-green-700 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex gap-2 duration-150 ease-in-out " +
                  `${marked.length === 0 ? "btn-disabled" : ""}`
                }
              >
                <AiFillCheckCircle className="text-xl" />
                Set Selected as Complete
              </button>
              }
          </div>

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
                <div className="relative overflow-x-auto overflow-y-scroll shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
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
                        <tr
                          key={idx}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
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
                                      marked.filter((ids) => ids !== ords._id)
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
                          <td className="px-6 py-4">{ords.totalPrice}</td>
                          <td className="px-6 py-4">{ords.rice.length}</td>
                          <td className="px-6 py-4">
                            <p className="inline-flex space-x-2">
                              <span>{statusToIcon(ords.status)}</span>
                              <span>{statusToWord(ords.status)}</span>
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <TbDotsVertical
                              onClick={() => setSelected(ords)}
                              className="text-xl cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {selected && (
          <div className="smooth-shadow2 p-4 flex duration-200 overflow-y-scroll ease-in-out w-1/2 h-full bg-white/80 absolute top-0 right-0 backdrop-blur-lg">
            <OrderComponent
              close={() => setSelected(null)}
              _id={selected._id}
              onUpdate={() => init()}
              onDelete={() => init()}
            />
          </div>
        )}
      </main>
    </div>
  );
};

Orders.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Orders;
