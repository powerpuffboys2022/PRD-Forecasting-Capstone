import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";
import { useState, useEffect } from "react";

import { MdAdminPanelSettings } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { VscLoading } from "react-icons/vsc";
import { HiTrash } from "react-icons/hi";

import { scanVals } from "../../helpers";
import axios from "axios";

import Account from "../../components/Admin/AccountComponent";
import CustomConfirm from "../../components/modals/CustomConfirm";
import { toast } from "react-toastify";

const Accounts = () => {
  const [tab, setTab] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [modal, setModal] = useState(-1);
  const [confirm, setConfirm] = useState("");

  const [user, setUser] = useState([]);
  const [c_user, setCUser] = useState([]);
  const [selected, setSelected] = useState();
  const [search, setSearch] = useState("");

  const filterUser = () => {
    let candidates = c_user.filter((acc) =>
      scanVals(acc, search, ["dateAdded", "imgUrl"])
    );
    if (tab !== -1)
      candidates = candidates.filter((acc) => acc.userType === tab);
    setUser(candidates);
  };

  useEffect(() => {
    filterUser();
  }, [tab]);

  const init = async () => {
    try {
      setLoading(true);
      const users = await axios.post("/api/prd/updateUser", { mode: 2 });
      setSearch("");
      setUser(users.data);
      setCUser(users.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const _delete = async () => {
    try {
      setLoading(true);
      const req = await axios.post("/api/prd/updateUser", {
        _id: selected._id,
        mode: -1,
      });
      toast.success("User Permanently Removed", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <HiTrash className="text-2xl text-red-500" />,
      });
      setSelected(null);
      setModal(-1);
      setIsNew(false);
      init();
    } catch (e) {
      console.log(e);
      toast.error("Failed to remove user", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="relative overflow-hidden font-poppins p-4 h-screen w-full main-content flex flex-col flex-grow bg-[#fcfcfc]">
      <Head>
        <title>Accounts</title>
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

      {selected && (
        <CustomConfirm
          shown={modal === 1}
          title={"Delete User"}
          content={
            <div className="mt-6">
              <p>
                You are about to delete{" "}
                <span className="font-medium">{selected.userName}</span> from
                the{" "}
                <span className="font-medium">
                  {selected.userType > 0 ? "Admin" : "Partner"}
                </span>{" "}
                accounts. Doing this will remove this user from the list of{" "}
                <span className="font-medium">
                  {selected.userType > 0 ? "Admins" : "Partners"}
                </span>{" "}
                who can access the PRD.{" "}
                <span className="text-red-700">
                  {" "}
                  This action cannot be undone
                </span>
              </p>
              <div className="mt-6">
                <label
                  htmlFor="default-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  type{" "}
                  <span className="font-semibold">{selected.userName}</span> to
                  confirm.
                </label>
                <input
                  type="text"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  id="default-input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setModal(-1);
                    _delete();
                  }}
                  type="button"
                  disabled={confirm !== selected.userName}
                  className={
                    `${
                      confirm !== selected.userName
                        ? "opacity-50"
                        : "hover:text-white  hover:bg-red-800 focus:ring-4 focus:ring-red-300 border outline-red-600"
                    }` +
                    " duration-200 ease-in-out w-full cursor-pointer focus:outline-none text-red-500 font-medium rounded-lg text-sm px-5 py-2.5"
                  }
                >
                  I understand the consequence of deleting this user
                </button>
              </div>
              <p
                onClick={() => setModal(-1)}
                className="mt-4 text-center text-sm link"
              >
                Go Back
              </p>
            </div>
          }
        />
      )}

      <div className="flex items-center justify-between text-sm smooth-shadow-fine bg-white p-2 font-medium rounded-lg text-center text-gray-500">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <a
              href="#"
              onClick={() => setTab(-1)}
              className={
                "inline-flex p-4 rounded-t-lg " +
                `${
                  tab === -1
                    ? "active border-b-2 border-yellow-600 text-yellow-600 "
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
                "inline-flex items-center p-4 rounded-t-lg " +
                `${
                  tab === 1
                    ? "active border-b-2 border-yellow-600 text-yellow-600 "
                    : ""
                }`
              }
              aria-current="page"
            >
              <MdAdminPanelSettings className="h-6 w-6 mr-2" />
              Admins
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              onClick={() => setTab(0)}
              className={
                "inline-flex items-center p-4 rounded-t-lg " +
                `${
                  tab === 0
                    ? "active border-b-2 border-yellow-600 text-yellow-600 "
                    : ""
                }`
              }
            >
              <FaHandshake className="h-6 w-6 mr-2" />
              Partners
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
                  filterUser();
                }
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  filterUser();
                }
              }}
              type="search"
              id="default-search"
              className="block w-full outline-none p-3 pl-10 text-sm text-stone-800 border border-gray-300 rounded-lg bg-gray-50 "
              placeholder="search by id, username, address.."
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

        <button
          type="button"
          onClick={() => {
            setSelected({});
            setIsNew(true);
          }}
          className="inline-flex focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
        >
          <AiOutlineUserAdd className="text-xl mr-2" />
          New Account
        </button>
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
          {user.length === 0 && (
            <div className="w-full flex justify-center items-center h-16">
              <p className="text-center">There are 0 accounts</p>
            </div>
          )}
        </>
      )}

      <div className="w-full overflow-y-scroll h-full mt-4 ">
        <div className="w-full rounded-md grid grid-cols-3">
          {user.map((u, idx) => (
            <div
              onClick={() => {
                setIsNew(false);
                setSelected(u);
              }}
              key={idx}
              className="p-2 w-full cursor-pointer"
            >
              <div className="w-full border duration-200 hover:border-gray-300 border-transparent rounded-lg smooth-shadow-fade p-4 flex flex-col items-center text-center bg-white">
                <div className="avatar mr-2">
                  <div className="w-16 h-16 rounded-full">
                    <img src={u.imgUrl} alt={u.userName} />
                  </div>
                </div>
                <div className="font-helvetica break-words">
                  <p className="text-gray-600 mt-4 font-inter font-medium text-lg ">{u.userName}</p>
                  <p className="text-gray-500 text-xs font-medium mt-2">{u.email}</p>
                  <p className="font-medium mt-4 text-gray-600 inline-flex">
                    {u.userType > 0 ? (
                      <MdAdminPanelSettings className="h-6 w-6 mr-2" />
                    ) : (
                      <FaHandshake className="h-6 w-6 mr-2" />
                    )}
                    {u.userType > 0 ? "Admin" : "Partner"}

                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={
          "smooth-shadow2 p-4 flex duration-500 overflow-y-scroll ease-in-out w-1/2 h-full bg-white/80 absolute top-0 backdrop-blur-lg " +
          `${selected ? " right-0" : "  -right-full"}`
        }
      >
        {selected && (
          <Account
            isNew={isNew}
            role={tab}
            data={selected}
            close={() => {
              setIsNew(false);
              init();
              setSelected(null);
            }}
            onUpdate={() => {
              init();
              filterUser();
            }}
            onDelete={() => setModal(1)}
          />
        )}
      </div>
    </div>
  );
};

Accounts.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Accounts;
