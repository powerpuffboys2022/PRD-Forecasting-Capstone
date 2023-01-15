import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";
import axios from "axios";
import { useState, useEffect } from "react";

import { BsDot } from "react-icons/bs";

import Loading from "../../components/Loading";

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
      <div className="grow h-full flex p-4">
        <div className="w-1/2">
          <h1 className="text-2xl">Inventory</h1>
        </div>
        <div className="w-1/2 h-full">
          <div className="h-1/6 flex p-4 rounded-md items-center">
            <form className="grow mr-2">
              <label
                for="default-search"
                className="mb-2 text-sm font-medium text-stone-800 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
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
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          <div className="h-5/6 overflow-y-scroll space-y-5">
          {loading.rice ? (
              <Loading loading={true} />
          ) : (
            <>
              {[...rices, ...rices, ...rices].map((rc, idx) => (
                <div
                  key={idx}
                  className="flex bg-white p-4 rounded-lg items-center smooth-shadow"
                >
                  <BsDot className="flex-none text-3xl mr-3" />
                  <img className="h-16 w-16 mr-3" src={rc.imgUrl} />
                  <div className="grow mr-2">
                    <p className="font-semibold">
                      <span className="text-[#8f9cad]  text-sm">{rc.netWeight} kg </span>{" "}
                      <span className="ml-2 text-stone-800">
                        {rc.articleName}
                      </span>
                    </p>
                    <p className="text-[#575f6b] text-sm mt-2">{ rc.stock > 0 ? "Available"  : "Out of stock"}</p>
                  </div>
                  <p className="flex-none font-semibold text-stone-800 text-sm">
                    ₱ {rc.price}
                  </p>
                </div>
              ))}
            </>
          )} 
          {
            !loading.rice && rices.length === 0 && <p className="text-center w-full">there are no products</p>
          }
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
