import Head from "next/head";
import { useState, useEffect } from "react";

var XLSX = require("xlsx");
import axios from "axios";
import { toast } from "react-toastify";

import { Pagination } from "react-headless-pagination";

import { AiOutlinePlus, AiOutlineReload, AiFillDelete } from "react-icons/ai";
import { VscClose, VscLoading } from "react-icons/vsc";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { FaWeightHanging } from "react-icons/fa";
import { RiFileExcel2Fill } from "react-icons/ri";

import HomeLayout from "../../layouts/HomeLayout";
import CustomConfirm from "../../components/modals/CustomConfirm";
import { scanVals, dateMomentBeautify, getDateAgo } from "../../helpers";
import { isDate } from "moment";

const Daily_sales = () => {
  const [tab, setTab] = useState(-2);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(-1);
  const [search, setSearch] = useState("");
  const [rices, setRices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageMax, setPageMax] = useState(5);
  const [create, setCreate] = useState(false);

  const [selected, setSelected] = useState();
  const [curDate, setCurDate] = useState(new Date());
  const [marked, setMarked] = useState([]);

  const [editorData, setEditorData] = useState();
  const [retail, setRetail] = useState([]);
  const [cRetail, setCRetail] = useState([]);
  const [entries, setEntries] = useState([]);

  const loadRices = async () => {
    try {
      let Rices = await axios.post("/api/prd/rice", { mode: 0 });
      setRices(Rices.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const loadRetails = async () => {
    try {
      setLoading(true);
      let retail = await axios.post("/api/prd/retail", {
        mode: 0,
        content: {},
      });
      setSearch("");
      setSelected(null);
      retail = retail.data.map((obj) => {
        return {
          ...obj,
          datew: dateMomentBeautify(new Date(obj.date), "MM-DD-YYYY, "),
        };
      });
      setRetail(retail);
      setCRetail(retail);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const loadEditorData = async () => {
    try {
      const request = await axios.post("/api/prd/userInfo", {});
      setEditorData(request.data);
    } catch (e) {}
  };

  const getRicePrice = (ricename) => {
    let found = rices.filter((rc) => rc.articleName === ricename);
    return found.length > 0 ? found[0].pricePerKg : 0;
  };

  const getRiceId = (ricename) => {
    let found = rices.filter((rc) => rc.articleName === ricename);
    return found.length > 0 ? found[0]._id : "-";
  };

  const getRiceNetWeight = (ricename) => {
    let found = rices.filter((rc) => rc.articleName === ricename);
    return found.length > 0 ? found[0].netWeight : 0;
  };

  const init = async () => {
    setLoading(true);
    await loadRices();
    await loadRetails();
    await loadEditorData();
    setLoading(false);
  };

  const batchCreate = async () => {
    try {
      let total = 0.0;
      entries.forEach((entr) => (total += entr.totalPrice));
      const request = await axios.post("/api/prd/retail", {
        mode: 2,
        content: entries,
        totalPrice: total,
      });
      toast.success("Successfuly Added", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setEntries([]);
      setCreate(false);
      init();
    } catch (e) {
      toast.error("Failed to Add", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: (
          <span className="text-rose-300">
            <svg
              width="24"
              height="24"
              className="ease-in opacity-40 group-hover:opacity-90 duration-200"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="24" height="24" />
                <rect
                  fill="currentColor"
                  opacity="0.3"
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="10"
                />
                <path
                  d="M6.16794971,14.5547002 C5.86159725,14.0951715 5.98577112,13.4743022 6.4452998,13.1679497 C6.90482849,12.8615972 7.52569784,12.9857711 7.83205029,13.4452998 C8.9890854,15.1808525 10.3543313,16 12,16 C13.6456687,16 15.0109146,15.1808525 16.1679497,13.4452998 C16.4743022,12.9857711 17.0951715,12.8615972 17.5547002,13.1679497 C18.0142289,13.4743022 18.1384028,14.0951715 17.8320503,14.5547002 C16.3224187,16.8191475 14.3543313,18 12,18 C9.64566871,18 7.67758127,16.8191475 6.16794971,14.5547002 Z"
                  fill="white"
                  transform="translate(12.000000, 15.499947) scale(1, -1) translate(-12.000000, -15.499947) "
                />
              </g>
            </svg>
          </span>
        ),
      });
    }
  };

  const batchDelete = async () => {
    try {
      let data = cRetail.filter((ret) => marked.includes(ret._id));
      const request = await axios.post("/api/prd/retail", {
        mode: -2,
        batch: marked,
      });
      toast.success("Successfuly Deleted", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setMarked([]);
      init();
    } catch (e) {
      toast.error("Failed to Delete", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: (
          <span className="text-rose-300">
            <svg
              width="24"
              height="24"
              className="ease-in opacity-40 group-hover:opacity-90 duration-200"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="24" height="24" />
                <rect
                  fill="currentColor"
                  opacity="0.3"
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="10"
                />
                <path
                  d="M6.16794971,14.5547002 C5.86159725,14.0951715 5.98577112,13.4743022 6.4452998,13.1679497 C6.90482849,12.8615972 7.52569784,12.9857711 7.83205029,13.4452998 C8.9890854,15.1808525 10.3543313,16 12,16 C13.6456687,16 15.0109146,15.1808525 16.1679497,13.4452998 C16.4743022,12.9857711 17.0951715,12.8615972 17.5547002,13.1679497 C18.0142289,13.4743022 18.1384028,14.0951715 17.8320503,14.5547002 C16.3224187,16.8191475 14.3543313,18 12,18 C9.64566871,18 7.67758127,16.8191475 6.16794971,14.5547002 Z"
                  fill="white"
                  transform="translate(12.000000, 15.499947) scale(1, -1) translate(-12.000000, -15.499947) "
                />
              </g>
            </svg>
          </span>
        ),
      });
    }
  };

  const exportData = (data) => {
    var parsed = [];

    data.forEach((ob, idx) => {
      let newObj = {
        "Rice Name": ob.riceName,
        "Rice Image": ob.imgUrl,
        Kg: ob.kg,
        "Base Price per (kg)": ob.pricePerKg,
        "Total Price": ob.totalPrice,
        "Retail Id": ob._id,
        "Rice Id": ob.riceId,
        "Created By": ob.createdBy,
        "Date Added": dateMomentBeautify(new Date(ob.date), "DD-MM-YYYY"),
      };
      parsed.push(newObj);
    });
    var workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(parsed);

    worksheet["!cols"] = [
      { width: 14 },
      { width: 14 },
      { width: 12 },
      { width: 12 },
      { width: 20 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 150 },
    ];

    workbook.SheetNames.push("Retails");
    workbook.Sheets["Retails"] = worksheet;
    XLSX.writeFile(workbook, "Retails.xlsx");
  };

  const filterRetail = () => {
    let candidates = cRetail.filter((data) =>
      scanVals(data, search, ["imgUrl", "dateW", "date", "time", "isDated"])
    );
    if (tab !== -2)
      candidates = candidates.filter((data) => data.status === tab);
    setCurrentPage(0);
    setRetail(candidates);
  };

  useEffect(() => {
    setCurrentPage(0);
    setMarked([]);
    filterRetail();
  }, [cRetail]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setEntries(
      entries.map((ent) => {
        return {
          ...ent,
          date: curDate,
          time: curDate,
          dateW: dateMomentBeautify(curDate, "YYYY-MM-DD"),
        };
      })
    );
  }, [curDate]);

  useEffect(() => {}, [selected]);

  return (
    <div className="font-poppins overflow-y-scroll h-screen bg-[#f5f8fa]">
      <Head>
        <title>Daily Sales</title>
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
        title={"Delete Retail Record"}
        content={
          <div className="mt-6">
            <p>
              You are about to delete{" "}
              <span className="font-medium">{marked.length}</span> record from
              retails record.
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
                I understand the consequence of deleting these records
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

      <div className="py-4 px-6 h-full">
        <div className="mountedanimater bg-white px-6 py-6 mt-6 rounded-md smooth-shadow-fine">
          <div className="flex justify-between">
            <p className="text-lg">
              Daily Sales{" "}
              <span className="text-gray-400 text-xs font-medium">
                (retail / tingi-tingi)
              </span>
            </p>
            <div className="flex items-center justify-end space-x-2">
              {!create ? (
                <button
                  onClick={() => setCreate(!create)}
                  type="button"
                  className="mountedanimater px-3 py-2 text-sm font-inter text-center text-white bg-[#009ef7] hover:bg-[#0093e8]  rounded-lg "
                >
                  Insert Sale
                </button>
              ) : (
                <svg
                  onClick={() => setCreate(false)}
                  width="24"
                  height="24"
                  className="cursor-pointer hoveropacityfader duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.5"
                    x="6"
                    y="17.3137"
                    width="16"
                    height="2"
                    rx="1"
                    transform="rotate(-45 6 17.3137)"
                    fill="currentColor"
                  ></rect>
                  <rect
                    x="7.41422"
                    y="6"
                    width="16"
                    height="2"
                    rx="1"
                    transform="rotate(45 7.41422 6)"
                    fill="currentColor"
                  ></rect>
                </svg>
              )}
              <button
                onClick={() => init()}
                className="bg-gray-50 hover:bg-gray-100 outline-none px-2 rounded-md py-2"
              >
                <AiOutlineReload
                  className={
                    "cursor-pointer hoveropacityfader duration-200 " +
                    `${loading ? "animate-spin" : ""}`
                  }
                />
              </button>
            </div>
          </div>
          {create && (
            <>
              {entries.map((entr, idx) => (
                <div
                  key={idx}
                  className="mountedanimater overflow-hidden mt-4 px-4 py-2 bg-white border-t border-dashed"
                >
                  <div className="flex justify-evenly gap-1 items-center">
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Select Rice
                      </label>
                      <select
                        onChange={(e) => {
                          let altered = { ...entr };
                          altered.riceName = e.target.value;
                          altered.riceId = getRiceId(altered.riceName);
                          altered.netWeight = getRiceNetWeight(
                            altered.riceName
                          );
                          altered.pricePerKg = getRicePrice(altered.riceName);
                          altered.totalPrice = altered.kg * altered.pricePerKg;
                          setEntries(
                            [
                              ...entries.filter(
                                (rnm) => rnm.index !== altered.index
                              ),
                              altered,
                            ].sort((a, b) => {
                              if (a.index < b.index) {
                                return -1;
                              }
                              if (a.index > b.index) {
                                return 1;
                              }
                              return 0;
                            })
                          );
                        }}
                        value={entr.riceName}
                        className=" ease-in-out duration-200 cursor-pointer text-gray-500 rounded-md border border-gray-50 focus:border-gray-200 hover:border-gray-200 px-3 py-2 bg-gray-50 w-full hover:bg-base-100 outline-none"
                      >
                        <option>Select Rice</option>
                        {rices.map((rc, x) => (
                          <option key={x} value={rc.articleName}>
                            {rc.articleName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Price (per kg)
                      </label>
                      <input
                        readOnly={loading}
                        type="number"
                        tabIndex={1}
                        required
                        onChange={(e) => {
                          var val = e.target.value;
                          let altered = { ...entr };
                          altered.pricePerKg = e.target.value;
                          altered.totalPrice = altered.kg * altered.pricePerKg;
                          setEntries(
                            [
                              ...entries.filter(
                                (rnm) => rnm.index !== altered.index
                              ),
                              altered,
                            ].sort((a, b) => {
                              if (a.index < b.index) {
                                return -1;
                              }
                              if (a.index > b.index) {
                                return 1;
                              }
                              return 0;
                            })
                          );
                        }}
                        value={entr.pricePerKg}
                        className="ease-in-out duration-200qw cursor-pointer text-gray-500 rounded-md border border-gray-50 focus:border-gray-200 hover:border-gray-200 px-3 py-2 bg-gray-50 w-full hover:bg-base-100 outline-none"
                      />
                    </div>

                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Kg
                      </label>
                      <input
                        readOnly={loading}
                        type="number"
                        tabIndex={1}
                        required
                        onChange={(e) => {
                          var val = e.target.value;
                          let altered = { ...entr };
                          altered.kg = e.target.value;
                          altered.totalPrice = altered.kg * altered.pricePerKg;
                          setEntries(
                            [
                              ...entries.filter(
                                (rnm) => rnm.index !== altered.index
                              ),
                              altered,
                            ].sort((a, b) => {
                              if (a.index < b.index) {
                                return -1;
                              }
                              if (a.index > b.index) {
                                return 1;
                              }
                              return 0;
                            })
                          );
                        }}
                        value={entr.kg}
                        className="ease-in-out duration-200qw cursor-pointer text-gray-500 rounded-md border border-gray-50 focus:border-gray-200 hover:border-gray-200 px-3 py-2 bg-gray-50 w-full hover:bg-base-100 outline-none"
                      />
                    </div>

                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Total Cost
                      </label>
                      <input
                        readOnly={loading}
                        type="number"
                        tabIndex={1}
                        required
                        onChange={(e) => {
                          var val = e.target.value;
                          let altered = { ...entr };
                          altered.totalPrice = Number.parseFloat(val);
                          setEntries(
                            [
                              ...entries.filter(
                                (rnm) => rnm.index !== altered.index
                              ),
                              altered,
                            ].sort((a, b) => {
                              if (a.index < b.index) {
                                return -1;
                              }
                              if (a.index > b.index) {
                                return 1;
                              }
                              return 0;
                            })
                          );
                        }}
                        value={entr.totalPrice}
                        className="ease-in-out duration-200qw cursor-pointer text-gray-500 rounded-md border border-gray-50 focus:border-gray-200 hover:border-gray-200 px-3 py-2 bg-gray-50 w-full hover:bg-base-100 outline-none"
                      />
                    </div>

                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-transparent dark:text-white">
                        -
                      </label>
                      <button
                        onClick={() => {
                          setEntries(
                            entries.filter((ent) => ent.index !== entr.index)
                          );
                        }}
                        type="button"
                        className="px-2 py-2 text-sm font-inter text-center text-gray-600 bg-gray-100 hover:bg-gray-200 ease-in-out duration-200  rounded-lg "
                      >
                        <VscClose className="text-xl" />
                      </button>
                    </div>
                  </div>
                  <p className="inline-flex items-center gap-2 mt-4 text-xs text-gray-400 group ease-in duration-200">
                    <FaWeightHanging className="text-sm" />
                    Net Weight : <span>{entr.netWeight} Kg</span>
                  </p>
                </div>
              ))}

              <button
                onClick={() => {
                  let uid = new Date().toISOString();
                  let entry = {
                    index: uid,
                    riceId: "-",
                    riceName: "",
                    imgUrl: "/emptyimage.png",
                    kg: 0,
                    pricePerKg: 0,
                    netWeight: 0,
                    date: curDate,
                    time: curDate,
                    datew: dateMomentBeautify(curDate, "YYYY-MM-DD"),
                    createdBy: editorData ? editorData._id : null,
                    totalPrice: 0,
                  };
                  setEntries([...entries, entry]);
                }}
                type="button"
                className="px-6 mt-4 py-4 w-full border border-dashed mx-auto text-sm font-inter text-center text-gray-600 bg-gray-50 hover:bg-gray-100 ease-in-out duration-200 rounded-lg "
              >
                <AiOutlinePlus className="text-xl inline-flex justify-center" />
              </button>
              <div className="flex justify-between items-center">
                <input
                  value={dateMomentBeautify(curDate, "YYYY-MM-DD")}
                  type="date"
                  onChange={(e) => {
                    setCurDate(new Date(e.target.value));
                  }}
                  placeholder=""
                  className="outline-none text-sm smooth-shadow-fine border-gray-50 border focused:border-gray-100 bg-gray-50 focused:bg-gray-100 px-3 py-2 text-gray-400 hover:text-gray-500 focus:text-gray-500 duration-200 ease-in rounded-md"
                />
                <div className="flex w-full justify-end py-4 space-x-2">
                  {entries.length > 0 && (
                    <button
                      onClick={() => {
                        batchCreate();
                      }}
                      type="button"
                      className="px-6 py-2 text-sm font-inter text-center text-white bg-[#009ef7] hover:bg-[#0093e8] ease-in-out duration-200  rounded-lg "
                    >
                      Save
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEntries([]);
                    }}
                    type="button"
                    className="px-6 py-2 text-sm font-inter text-center text-gray-600 bg-gray-100 hover:bg-gray-200 ease-in-out duration-200  rounded-lg "
                  >
                    Remove All
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="py-4 px-6 bg-white mt-4 rounded-md smooth-shadow-fine">
          <div className="flex justify-between">
            <div>
              <p className="mt-4 text-gray-400 text-sm font-medium">
                {cRetail.length} records
              </p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setModal(1)}
                className={
                  "border rounded-lg border-gray-50 group hover:border-gray-200 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex gap-2 duration-150 ease-in-out " +
                  `${marked.length === 0 ? "btn-disabled" : ""}`
                }
              >
                <AiFillDelete className="group-hover:text-rose-400 text-gray-400 text-xl" />
                Delete {marked.length === retail.length ? "All" : "Selected"}
              </button>
              <div className="flex items-center justify-end">
                {marked.length > 0 ? (
                  <button
                    onClick={() =>
                      exportData(
                        retail.filter((ret) => marked.includes(ret._id))
                      )
                    }
                    type="button"
                    className="border rounded-lg group border-gray-100 hover:border-gray-200 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex items-center gap-2 duration-150 ease-in-out "
                  >
                    <RiFileExcel2Fill className="text-lg duration-200 text-gray-500 group-hover:text-[#1c895a]" />
                    Export Selected
                    <span className="text-xs text-gray-500 font-medium">
                      .xlsx
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => exportData(retail, true)}
                    type="button"
                    className="border group rounded-lg border-gray-100 hover:border-gray-200 hover:bg-gray-100 bg-white px-2 py-1 text-sm inline-flex items-center gap-2 duration-150 ease-in-out "
                  >
                    <RiFileExcel2Fill className="text-lg duration-200 text-gray-500 group-hover:text-[#1c895a]" />
                    Export All
                    <span className="text-xs text-gray-500 font-medium">
                      .xlsx
                    </span>
                  </button>
                )}
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="grow">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-stone-800 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative  mx-2 group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      width="24"
                      height="24"
                      className="ease-in opacity-40 group-hover:opacity-90 duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.5"
                        x="17.0365"
                        y="15.1223"
                        width="8.15546"
                        height="2"
                        rx="1"
                        transform="rotate(45 17.0365 15.1223)"
                        fill="currentColor"
                      ></rect>
                      <path
                        d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <input
                    onChange={(e) => {
                      if (e.target.value === "") {
                        filterRetail();
                      }
                      setSearch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.code === "Enter") {
                        filterRetail();
                      }
                    }}
                    type="search"
                    id="default-search"
                    className="duration-200 ease-in block w-80 outline-none p-3 pl-10 text-sm text-stone-600 border border-gray-50 hover:border-gray-100 focus:border-gray-100 rounded-lg bg-gray-50 focus:bg-gray-100 hover:bg-gray-100 "
                    placeholder="Search any"
                    required
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="relative overflow-x-auto max-h-screen min-h-full overflow-y-scroll smooth-shadow-fine sm:rounded-lg mt-4">
            {loading && (
              <VscLoading className="text-lg animate-spin mx-auto my-24" />
            )}
            {!loading && (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMarked(retail.map((ids) => ids._id));
                            } else {
                              setMarked([]);
                            }
                          }}
                          checked={
                            retail.length === marked.length &&
                            marked.length !== 0
                          }
                          className="checkbox  checkboxcustom"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Rice Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Base Price Per (kg)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Purchased (kg)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total Cost
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {retail.map((ret, idx) => (
                    <>
                      {idx >= currentPage * pageMax &&
                      idx + 1 <= currentPage * pageMax + pageMax ? (
                        <tr
                          key={idx}
                          className="bg-white border-t border-dashed hover:bg-gray-50 py-4"
                        >
                          <td className="w-4 p-4">
                            <div className="flex items-center">
                              <input
                                id="checkbox-table-search-2"
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setMarked([...marked, ret._id]);
                                  } else {
                                    setMarked(
                                      marked.filter((ids) => ids !== ret._id)
                                    );
                                  }
                                }}
                                checked={
                                  marked.filter((ids) => ids === ret._id)
                                    .length > 0
                                }
                                className="checkbox checkboxcustom"
                              />
                            </div>
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {ret.riceName}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {(ret.pricePerKg + 0.0).toLocaleString("en-Us")}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {ret.kg}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {(ret.totalPrice + 0.0).toLocaleString("en-Us")}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {dateMomentBeautify(
                              new Date(ret.date),
                              "MM-DD-YYYY"
                            )}{" "}
                            <span className="text-xs font-medium text-gray-400">
                              ({getDateAgo(new Date(), new Date(ret.date))} days
                              ago)
                            </span>
                          </td>
                        </tr>
                      ) : (
                        <></>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && cRetail.length === 0 && (
              <p className="text-center mx-auto text-xs my-24 text-gray-400">
                No data found
              </p>
            )}
            <div className="flex items-center mt-1 px-4 py-2 justify-between">
              <div className="flex justify-start items-center space-x-2">
                <select
                  onChange={(e) => {
                    setPageMax(parseInt(e.target.value));
                  }}
                  value={pageMax}
                  className="bg-gray-50 hover:bg-gray-100 ease-in-out cursor-pointer text-gray-600 text-xs rounded-lg w-16 outline-none block p-2.5 px-3 "
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={20}>25</option>
                  <option value={20}>50</option>
                </select>
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {currentPage * pageMax + 1}
                  </span>
                  -
                  <span className="font-medium text-gray-700">
                    {currentPage * pageMax + pageMax > retail.length
                      ? retail.length
                      : currentPage * pageMax + pageMax}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {retail.length}{" "}
                  </span>
                </p>
              </div>
              {retail.length >= pageMax ? (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={Math.ceil(retail.length / pageMax)}
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
                      className="px-3 py-1 rounded-md cursor-pointer ease-in duration-200 hover:text-white hover:bg-[#0f96e4]"
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
        </div>
      </div>
    </div>
  );
};

Daily_sales.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Daily_sales;
