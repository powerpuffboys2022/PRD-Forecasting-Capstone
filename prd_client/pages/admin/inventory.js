import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";
import axios from "axios";
import { useState, useEffect } from "react";

import { BsDot, BsSearch } from "react-icons/bs";
import { VscClose } from "react-icons/vsc";

import Loading from "../../components/Loading";

import ProductCard from "../../components/Admin/ProductCard"

const inventory = () => {
  const [loading, setLoading] = useState({ rice: true });

  const [rices, setRices] = useState([]);

  const init = async () => {
    try {
      setLoading({ ...loading, rice: true });
      const req = await axios.post("/api/prd/rice", { mode: 0 });
      setRices(req.data);
    } catch (e) {
    } finally {
      setLoading({ ...loading, rice: false });
    }
  };

  const [selected, setSelected] = useState();

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="font-poppins h-screen main-content flex flex-col flex-grow bg-[#f2f5fa]">
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
      <div className="h-full flex p-4">
        <div className="w-1/2 h-full p-4">
          <div className="h-full relative overflow-x-scroll overflow-y-scroll rounded-xl">
            {!selected ? (
              <div className="w-full p-4">
                <img src="/package.png" className="mx-auto w-24" />
                <p className="text-sm font-medium mx-auto text-center text-gray-600">
                  no selected item
                </p>
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
                <ProductCard rice={selected} />
              </>
            )}
          </div>
        </div>
        <div className="w-1/2 h-full relative">
          <div className="smooth-shadow absolute w-full bg-transparent backdrop-blur-md flex p-4 rounded-xl items-center">
            <form className="grow mr-2">
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
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 text-sm text-stone-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="search by id, name, article code.."
                  required
                />
                <button
                  type="submit"
                  className="text-gray-700 border hover:text-white absolute right-2.5 bottom-2.5 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 "
                >
                  Search
                </button>
              </div>
            </form>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-2xl text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Create
            </button>
          </div>
          <div className="h-full overflow-y-scroll space-y-5">
            <div className="h-20"></div>
            {loading.rice ? (
              <Loading loading={true} />
            ) : (
              <>
                {rices.map((rc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelected(rc)}
                    className="flex duration-200 ease-in-out cursor-pointer bg-white hover:bg-gray-50 p-4 rounded-lg items-center smooth-shadow"
                  >
                    <BsDot
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
                    />
                    <img className="h-16 w-16 mr-3" src={rc.imgUrl} />
                    <div className="grow mr-2">
                      <p className="font-semibold">
                        <span className="text-[#3e4d65]  text-sm">
                          {rc.netWeight} kg{" "}
                        </span>{" "}
                        <span className="ml-2 text-[#1c232c]">
                          {rc.articleName}
                        </span>
                      </p>
                      <p className="text-[#3e4d65] text-sm mt-2">
                        {rc.stock > 0 ? "Available" : "Out of stock"}
                      </p>
                    </div>
                    <div className="flex-none px-4">
                      <p className="font-medium text-[#3e4d65] text-sm">
                        {rc.stock} in stock
                      </p>
                      <div className=" bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
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

inventory.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default inventory;
