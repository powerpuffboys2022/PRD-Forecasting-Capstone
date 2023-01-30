import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";
import axios from "axios";
import { useState, useEffect } from "react";

import { BsSearch } from "react-icons/bs";
import { VscClose } from "react-icons/vsc";
import { HiTrash } from "react-icons/hi";

import ProductCard from "../../components/Admin/ProductCard";
import CustomConfirm from "../../components/modals/CustomConfirm";
import { toast } from "react-toastify";
import { scanVals } from "../../helpers"
import { useRouter } from "next/router";

const Inventory = () => {
  const router = useRouter()
  const [loading, setLoading] = useState({ rice: true });
  const [modal, setModal] = useState(-1);
  const [confirm, setConfirm] = useState("");
  const [isNew, setIsNew] = useState(false);

  const [search, setSearch] = useState("");
  const [rices, setRices] = useState([]);
  const [c_rices, setC_rices] = useState([]);
  const [selected, setSelected] = useState();

  const init = async () => {
    try {
      setLoading({ ...loading, rice: true });
      const req = await axios.post("/api/prd/rice", { mode: 0 });
      setRices(req.data);
      setC_rices(req.data)
    //   setSearch("")
    } catch (e) {
    } finally {
      setLoading({ ...loading, rice: false });
    }
  };

  const _delete = async () => {
    try {
      const req = await axios.post("/api/prd/rice", {
        content: selected,
        mode: 3,
      });
      toast.success("Product Deleted", {
        position: toast.POSITION.BOTTOM_RIGHT,
        icon: <HiTrash className="text-2xl text-red-500" />,
      });
      setSelected(null);
      init();
    } catch (e) {
      toast.error("Failed to deleted", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
    }
  };

  const remap = () => {
    const candidates = c_rices.filter((rc)=> scanVals(rc, search, ["dateAdded","imgUrl"]))
    setRices(candidates)
  }

  useEffect(() => {
    if (!router) {
      return;
    }
    
    const { srch } = router.query
    if(!srch) return
    setSearch(srch)
  }, [router]);

  useEffect(()=>{ remap() },[search, c_rices])

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="font-poppins  h-screen main-content flex flex-col flex-grow bg-[#f2f5fa]">
      <Head>
        <title>Inventory</title>
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
          title={"Delete Product"}
          content={
            <div className="mt-6">
              <p>
                You are about to delete {selected.articleName}. Doing this will
                remove the product from the list and the admin & partners will
                not be able to see the product.
              </p>
              <div className="mt-6">
                <label
                  htmlFor="default-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  type{" "}
                  <span className="font-semibold">{selected.articleName}</span>{" "}
                  to confirm.
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
                  disabled={confirm !== selected.articleName}
                  className={
                    `${
                      confirm !== selected.articleName
                        ? "opacity-50"
                        : "hover:text-white  hover:bg-red-800 focus:ring-4 focus:ring-red-300 border outline-red-600"
                    }` +
                    " duration-200 ease-in-out w-full cursor-pointer focus:outline-none text-red-500 font-medium rounded-lg text-sm px-5 py-2.5"
                  }
                >
                  I understand the consequence of deleting this product
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
      <div className="h-full flex p-4">
        <div className="w-4/6 h-full p-4">
          <div className="h-full relative overflow-x-scroll overflow-y-scroll rounded-xl">
            {!selected ? (
              <div className="w-full h-full flex flex-col p-4 text-center">
                <p className="text-3xl font-semibold ">Inventory</p>
                <p className="text-sm mt-6">
                  Manage your product to ensure everything is up to date
                </p>
                <ul className="mt-6 text-sm mx-auto text-gray-600/70">
                  <li>
                    <span className="font-medium text-gray-600">Create</span> -
                    to generate or create new product
                  </li>
                  <li>
                    <span className="font-medium text-gray-600">Choose</span> -
                    select & update any product listed
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <div className="w-full fixed left-0 top-0 p-4 flex justify-between">
                  <div></div>
                  <button
                    className="text-2xl duration-200 text-gray-300 hover:text-gray-800"
                    onClick={() => setSelected(null)}
                  >
                    <VscClose />
                  </button>
                </div>
                <ProductCard
                  ondelete={() => {
                    setModal(1);
                  }}
                  isNew={isNew}
                  onsave={init}
                  onupdate={init}
                  rice={selected}
                />
              </>
            )}
          </div>
        </div>
        <div className="w-2/6 h-full relative">
          <div className="justify-between smooth-shadow absolute w-full bg-transparent backdrop-blur-md flex p-4 rounded-xl items-center">
            <form onSubmit={(e) => e.preventDefault()} className="grow mr-2">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-stone-800 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BsSearch className="text-2xl" />
                </div>
                <input
                    onChange={(e)=>{
                        if(e.target.value === ""){
                            setRices(c_rices)
                        }
                        setSearch(e.target.value)
                    }}
                    onKeyDown={(e)=>{
                        if(e.code === "Enter"){
                            if(search.length === 0){
                                init();
                                return;
                            }
                            remap();
                        }
                    }}
                    value={search}
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 text-sm text-stone-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="search by id, name, article code.."
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
              onClick={() => {
                setIsNew(true);
                setSelected({});
              }}
              type="button"
              className="text-white  bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-2xl text-sm px-5 py-2.5"
            >
              Create
            </button>
          </div>
          <div className="h-full overflow-y-scroll space-y-5">
            <div className="h-20"></div>
            {loading.rice ? (
              <div className="w-full h-full">
                <img
                  src="/package.png"
                  className="mx-auto w-24 mt-16 animate-bounce drop-shadow-2xl"
                />
                <p className="px-3 py-1 text-xs font-medium leading-none text-center animate-pulse ">
                  loading...
                </p>
              </div>
            ) : (
              <>
                {rices.map((rc, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIsNew(false);
                      setSelected(rc);
                    }}
                    className="flex duration-200 ease-in-out cursor-pointer bg-white hover:bg-gray-50 p-4 rounded-lg items-center smooth-shadow"
                  >
                    {/* <BsDot
                      className={
                        "flex-none text-3xl mr-3 " +
                        `${
                          rc.stock === 0
                            ? `text-red-500`
                            : `${
                                rc.stock <= 10
                                  ? "text-[#ffa841]"
                                  : "text-blue-700"
                              }`
                        }`
                      }
                    /> */}
                    <img className="h-16 w-16 mr-3 drop-shadow-lg" src={rc.imgUrl} />
                    <div className="grow mr-2">
                      <p className="">
                        <span className="text-[#1c232c]">
                          {rc.articleName}
                        </span>
                      </p>
                      <p className="mt-2 font-semibold">
                        <span className="text-[#3e4d65]  text-sm">
                          {rc.netWeight} kg{" "}
                        </span>{" "}
                      </p>
                      <p className="text-[#3e4d65] text-xs mt-2">
                        {rc.articleCode}
                      </p>
                    </div>
                    <div className="flex-none px-4">
                      <p className="font-medium text-[#3e4d65] text-sm">
                        {rc.stock} in stock
                      </p>
                      <div className=" bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                        <div
                          className={
                            " h-1.5 rounded-full mx-2 " +
                            `${
                              rc.stock === 0
                                ? `bg-red-500 animate-pulse`
                                : `${
                                    rc.stock <= 10
                                      ? "bg-[#ffa841]"
                                      : "bg-blue-700"
                                  }`
                            }`
                          }
                        ></div>
                      </div>
                    </div>
                    <p className="flex-none font-semibold text-stone-800 text-sm">
                      ₱ {rc.price}
                    </p>
                  </div>
                ))}
              </>
            )}
            {!loading.rice && rices.length === 0 && (
              <p className="text-center w-full">there are no products</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Inventory.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Inventory;
