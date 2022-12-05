import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";

import { BsSearch } from "react-icons/bs"

const transactions = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = () => {};

  useEffect(() => {}, []);

  return (
    <div className="h-screen w-full flex justify-center">
      <Head>
        <title>Transaction</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-14 w-full md:w-5/6 p-2 md:p-8 ">
        <div className="mt-8 w-full">
          <p className="text-xl mx-auto text-center md:text-4xl font-medium font-inter">
            Your Transactions
          </p>
          <p className="mx-auto text-center mt-4">
            {transactions.length} transaction(s)
          </p>
          <div className="mt-4">
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
                className="block focus:drop-shadow-xl drop-shadow-md duration-200 ease-out w-full p-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-yellow-400 border-gray-300 rounded-lg bg-gray-50"
                placeholder="Search Transaction ID"
                required
              />
              <button
                type="submit"
                className="text-black absolute right-2.5 bottom-2.5 bg-yellow-400 hover:bg-yellow-500 duration-200 ease-in-out focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 "
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="h-4/6 group mt-8 overflow-scroll fade">
          <div className="overflow-x-auto w-full">
            {transactions.length > 0 || (
              <table className="table w-full">
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
                  {[1,2,3].map((trans, i) => (
                    <tr key={i} className="">
                      <td>trans</td>
                      <td>trans</td>
                      <td>trans</td>
                      <td>trans</td>
                      <td>trans</td>
                      <td>trans</td>
                      <td>trans</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
