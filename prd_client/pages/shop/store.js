import Head from "next/head";
import { useState, useEffect } from "react";
import UserLayout from "../../layouts/UserLayout";
import { BiFilter } from "react-icons/bi";

import { BsSearch } from "react-icons/bs";

import { toast } from "react-toastify";

import RiceCard2 from "../../components/Users/RiceCard2";
import Loading2 from "../../components/Loading2";
import Loading from "../../components/Loading";

const Store = () => {
  const [loading, setLoading] = useState(false);
  const [rices, setRices] = useState([]);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState();

  const [sort, setSort] = useState(0); // 0 - low to high, 1 - high to low
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(999999);

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
      })
      .catch((err) => {
        toast.error("Failed To Load Your Data", {
          position: toast.POSITION.TOP_LEFT,
        });
      })
      .finally(() => {});
  };

  const searchFunc = () => {
    setLoading(true);
    let contents = [
      { articleName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { articleCode: { $regex: search, $options: "i" } },
    ];

    if (!isNaN(parseInt(search))) {
      contents.push({ netWeight: parseInt(search) });
      contents.push({ price: parseInt(search) });
    }

    const response = fetch("/api/prd/rice", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content: { $or: contents },
      }),
    })
      .then((res) => {
        return res;
      })
      .then((data) => {
        data.json().then((dt) => {
          let newdt = filter(dt);
          setRices(newdt);
        });
      })
      .catch((err) => {
        toast.error("Failed To Load Your Search", {
          position: toast.POSITION.TOP_LEFT,
        });
      })
      .finally((d) => {
        setLoading(false);
      });
  };

  const sortPrice = (a, b) => {
    const A = a.price;
    const B = b.price;
    if (sort === 0) {
      if (A > B) return -1;
      if (A < B) return 1;
    }
    if (sort === 1) {
      if (A < B) return -1;
      if (A > B) return 1;
    }
    return 0;
  };

  const filter = (data) => {
    let ndata = data;
    ndata = ndata.filter((obj) => obj.price >= min && obj.price <= max);
    ndata = ndata.sort(sortPrice);
    return ndata;
  };

  const init = () => {
    if (search.length !== 0) {
      searchFunc();
      return;
    }
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
        data.json().then((dt) => {
          let newdt = filter(dt);
          setRices(newdt);
        });
      })
      .catch((err) => {
        toast.error("Failed To Load Products", {
          position: toast.POSITION.TOP_LEFT,
        });
      })
      .finally((d) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    loadUser();
  }, []);

  return (
    <div>
      <Head>
        <title>Store</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <link itemprop="image" href="cover.png" />
        <meta itemprop="name" content="Philip Rice Dealer" />
        <meta
          itemprop="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta
          itemprop="image"
          content="cover.png"
        />

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
        <meta
          property="og:image"
          content="cover.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Philip Rice Dealer" />
        <meta
          name="twitter:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta
          name="twitter:image"
          content="cover.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="py-24 w-full bg-rice-pattern flex justify-center items-center">
          <div className="mx-4 md:mx-0 md:w-1/3">
            <img className="mx-auto h-40" src="/logo_big.png" />
            {/* <div className="flex items-center space-x-2 mt-4">
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
                      if (search.length > 0) {
                        setLoading(true);
                        searchFunc();
                      } else init();
                  }}
                  value={search}
                  className="input w-full"
                  placeholder="Search Product"
                  required
                />
              </div>
              <div className="dropdown">
                <label
                  tabIndex={0}
                  className="btn btn-ghost bg-base-100 hover:bg-base-200 text-black m-1"
                >
                  <BiFilter className="text-2xl" />
                </label>
                <div
                  tabIndex={0}
                  className="dropdown-content menu p-4 shadow bg-base-100/70 backdrop-blur-md  w-52"
                >
                  <p className="text-lg font-medium">Filters</p>
                  <div className="divider my-2 py-2" />
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">High to Low</span>
                      <input
                        checked={sort === 0}
                        onChange={(e) => {
                          setSort(e.target.checked ? 0 : 1);
                        }}
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
                        onChange={(e) => {
                          setSort(e.target.checked ? 1 : 0);
                        }}
                        checked={sort === 1}
                        name="radio-10"
                        className="radio checked:bg-blue-500"
                      />
                    </label>
                  </div>
                  <div className="divider my-2 py-2" />

                  <div className="form-control">
                    <label className="label">
                      <span className="font-medium text-lg">Price Range</span>
                    </label>
                    <label className="input-group">
                      <input
                        type="text"
                        placeholder="min"
                        value={min}
                        onChange={(e) => {
                          let parsed = e.target.value;
                          var regex = /^[0-9\b]+$/;
                          if (parsed.length === 0) setMin(parsed);
                          if (!parsed.includes(".") && !regex.test(parsed))
                            return;
                          setMin(parsed);
                        }}
                        className="input input-bordered w-1/2"
                      />
                      <input
                        type="text"
                        placeholder="max"
                        value={max}
                        onChange={(e) => {
                          let parsed = e.target.value;
                          var regex = /^[0-9\b]+$/;
                          if (parsed.length === 0) setMax(parsed);
                          if (!parsed.includes(".") && !regex.test(parsed))
                            return;
                          setMax(parsed);
                        }}
                        className="input input-bordered w-1/2"
                      />
                    </label>
                  </div>

                  <button
                    className="mt-4 btn btn-sm w-full"
                    onClick={() => {
                      toast.success("Filter Applied", {
                        position: toast.POSITION.TOP_LEFT,
                      });
                      init();
                    }}
                  >
                    apply
                  </button>
                </div>
              </div>
            </div> */}
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
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      if (search.length > 0) {
                        setLoading(true);
                        searchFunc();
                      } else init();
                  }}
                  value={search}
                  type="search"
                  id="default-search"
                  className="block focus:drop-shadow-xl duration-200 ease-out w-full p-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-yellow-400 border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Search"
                  required
                />
                {/* <button
                  type="submit"
                  className="text-black absolute right-2.5 bottom-2.5 bg-yellow-400 hover:bg-yellow-500 duration-200 ease-in-out focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2 "
                >
                  Search
                </button> */}

                {/* TEST */}

                <div className="dropdown absolute right-2 top-1">
                  <label
                    tabIndex={0}
                    className="btn btn-sm bg-transparent hover:bg-gray-100 outline-none text-gray-800 m-1"
                  >
                    <BiFilter className="text-2xl" />
                  </label>
                  <div
                    tabIndex={0}
                    className="dropdown-content menu p-4 shadow bg-base-100/70 backdrop-blur-md  w-52"
                  >
                    <p className="text-lg font-medium">Filters</p>
                    <div className="divider my-2 py-2" />
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">High to Low</span>
                        <input
                          checked={sort === 0}
                          onChange={(e) => {
                            setSort(e.target.checked ? 0 : 1);
                          }}
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
                          onChange={(e) => {
                            setSort(e.target.checked ? 1 : 0);
                          }}
                          checked={sort === 1}
                          name="radio-10"
                          className="radio checked:bg-blue-500"
                        />
                      </label>
                    </div>
                    <div className="divider my-2 py-2" />

                    <div className="form-control">
                      <label className="label">
                        <span className="font-medium text-lg">Price Range</span>
                      </label>
                      <label className="input-group">
                        <input
                          type="text"
                          placeholder="min"
                          value={min}
                          onChange={(e) => {
                            let parsed = e.target.value;
                            var regex = /^[0-9\b]+$/;
                            if (parsed.length === 0) setMin(parsed);
                            if (!parsed.includes(".") && !regex.test(parsed))
                              return;
                            setMin(parsed);
                          }}
                          className="input input-bordered w-1/2"
                        />
                        <input
                          type="text"
                          placeholder="max"
                          value={max}
                          onChange={(e) => {
                            let parsed = e.target.value;
                            var regex = /^[0-9\b]+$/;
                            if (parsed.length === 0) setMax(parsed);
                            if (!parsed.includes(".") && !regex.test(parsed))
                              return;
                            setMax(parsed);
                          }}
                          className="input input-bordered w-1/2"
                        />
                      </label>
                    </div>

                    <button
                      className="mt-4 btn btn-sm w-full"
                      onClick={() => {
                        toast.success("Filter Applied", {
                          position: toast.POSITION.TOP_LEFT,
                        });
                        init();
                      }}
                    >
                      apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-slate-50 bg-2 font-inter min-h-screen w-full py-8 md:py-16 flex justify-center items-center">
          <div className="w-full mx-5 md:mx-0 md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {rices.map((rice, i) => (
              <RiceCard2
                key={i}
                uid={userData._id}
                gcart={userData.cart}
                _id={rice._id}
                onAddToCart={() => {
                  loadUser();
                }}
                description={rice.description}
                articleName={rice.articleName}
                imgUrl={rice.imgUrl}
                netWeight={rice.netWeight}
                price={rice.price}
                stock={rice.stock}
              />
            ))}
          </div>
          <div className="absolute top-8 left-auto">
            <Loading loading={loading} />
            {!loading && (
              <p className="font-medium ">{rices.length} Product(s) Found</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

Store.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default Store;
