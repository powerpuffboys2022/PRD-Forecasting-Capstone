import Head from "next/head";
import { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { BiFilter } from "react-icons/bi";

import RiceCard2 from "../../components/Users/RiceCard2";

const rice = () => {
  const [rices, setRices] = useState([]);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState()

  const loadUser = () => {
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
        init();
      });
  };

  const searchFunc = () => {
    const response = fetch("/api/prd/rice", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content: {
          articleName: { $regex: search, $options: "i" },
        },
      }),
    })
      .then((res) => {
        return res;
      })
      .then((data) => {
        data.json().then((data) => setRices(data));
      })
      .catch((err) => {})
      .finally((d) => {});
  };

  const init = () => {
    const response = fetch("/api/prd/rice", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content: {},
      }),
    })
      .then((res) => {
        return res;
      })
      .then((data) => {
        data.json().then((data) => setRices(data));
      })
      .catch((err) => {})
      .finally((d) => {});
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div>
      <Head>
        <title>Store</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="py-24 w-full bg-rice-pattern flex justify-center items-center">
          <div className="mx-4 md:mx-0 md:w-1/3">
            <img className="mx-auto h-40" src="/logo_big.png" />
            <div className="flex items-center space-x-2 mt-4">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="flex absolute inset-y-0 -left-8 items-center pl-3 pointer-events-none"></div>
                <input
                  type="text"
                  id="simple-search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      if (search.length > 0) searchFunc();
                      else init();
                  }}
                  value={search}
                  className="input w-full"
                  placeholder="Search Product"
                  required
                />
              </div>
              <div className="dropdown">
                <label tabIndex={0} className="btn m-1">
                  <BiFilter className="text-xl" />
                </label>
                <div
                  tabIndex={0}
                  className="dropdown-content menu p-4 shadow bg-base-100 rounded-box w-52"
                >
                  <p className="text-lg font-medium">Filters</p>
                  <div className="divider my-2 py-2" />
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">High to Low</span>
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-red-500"
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Low to High</span>
                      <input
                        type="radio"
                        name="radio-10"
                        className="radio checked:bg-blue-500"
                      />
                    </label>
                  </div>
                  <div className="divider my-2 py-2" />

                  <div className="form-control">
                    <label className="label"><span className="font-medium text-lg">Range</span></label>
                    <label className="input-group">
                      <input
                        type="text"
                        placeholder="min"
                        className="input input-bordered w-1/2"
                      />
                      <input
                        type="text"
                        placeholder="max"
                        className="input input-bordered w-1/2"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-2 font-inter w-full py-8 md:py-16 flex justify-center items-center">
          <div className="w-full mx-5 md:mx-0 md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {rices.map((rice, i) => (
              <RiceCard2
                key={i}
                uid={userData._id}
                gcart={userData.cart}
                _id={rice._id}
                onAddToCart={()=>{ loadUser() }}
                articleName={rice.articleName}
                imgUrl={rice.imgUrl}
                netWeight={rice.netWeight}
                price={rice.price}
                stock={rice.stock}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

rice.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default rice;
