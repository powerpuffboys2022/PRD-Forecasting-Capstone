import React, { useEffect, useState } from "react";

import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";

import { toast } from "react-toastify";

import { CiCircleRemove, CiCirclePlus, CiCircleMinus } from "react-icons/ci";

import Notify from "../../components/modals/Notify";
import LoadingModal from "../../components/modals/LoadingModal";

import { beautifyMoney } from "../../helpers"

import { useRouter } from "next/router";

const Cart = () => {

    const router = useRouter()

  const [userData, setUserData] = useState();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0.0);
  const [modal, setModal] = useState(-1);

  const getMyCart = () => {
    return userData.cart;
  };

  const updateUserCart = (cartState) => {
    setLoading(true);
    const response = fetch("/api/prd/updateUser", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode : 0,
        filter : { _id: userData._id },
        content : {
          cart: cartState,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //   toast.success("Added To Cart", {
        //     position: toast.POSITION.TOP_LEFT,
        //   });
        //   onAddToCart();
        loadUser();
      })
      .catch((err) => {
        //   toast.error("Add to cart failed", {
        //     position: toast.POSITION.TOP_LEFT,
        //   });
      });
  };

  const buildCheckoutItems = () => {
    let plc = [] 
    items.forEach((itm)=>plc.push({ 
        _id : itm._id, 
        name : itm.articleName, 
        imgUrl : itm.imgUrl,
        price : itm.price, 
        description : itm.description,
        netWeight : itm.netWeight, 
        qty : itm.qty }))
    return plc
  }

  const placeOrder = () => {
    setModal(0)
    const response = fetch("/api/prd/transaction", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode : 1,
          content : {
            rice : buildCheckoutItems(),
            totalPrice : total,
            userId : userData._id,
            status : 1
          }
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          //   toast.success("Added To Cart", {
          //     position: toast.POSITION.TOP_LEFT,
          //   });
          //   onAddToCart();
          updateUserCart([]);
          setModal(1);
        })
        .catch((err) => {
            toast.error("Checkout failed", {
              position: toast.POSITION.TOP_LEFT,
            });
        });
  };

  const add = (id) => {
    let newCart = getMyCart().map((entr) => {
      return { ...entr, qty: entr._id === id ? entr.qty + 1 : entr.qty };
    });
    updateUserCart(newCart);
  };

  const less = (id) => {
    let newCart = getMyCart().map((entr) => {
      return { ...entr, qty: entr._id === id ? entr.qty - 1 : entr.qty };
    });
    updateUserCart(newCart);
  };

  const remove = (id) => {
    let newCart = getMyCart().filter((obj) => obj._id !== id);
    updateUserCart(newCart);
  };

  const loadUser = () => {
    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const findQtyFromCart = (_id) => {
    for (var x = 0; x < userData.cart.length; x++)
      if (userData.cart[x]._id === _id) return userData.cart[x].qty;
  };

  const fetchCart = () => {
    let prod_ids = [];
    userData.cart.forEach((id, i) => {
      prod_ids.push(id._id);
    });

    let merged = [];

    const response = fetch("/api/prd/rice", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content: { _id: { $in: prod_ids } },
      }),
    })
      .then((res) => {
        return res;
      })
      .then((data) => {
        data.json().then((dt) => {
          dt.forEach((prod) => {
            merged.push({ ...prod, qty: findQtyFromCart(prod._id) });
          });
          let tot = 0.0;
          merged.forEach((pr) => {
            tot += pr.price * pr.qty;
          });
          setTotal(tot);
          setItems(merged);
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

  useEffect(() => {
    if (userData !== undefined) fetchCart();
  }, [userData]);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="h-screen w-full flex justify-center">
      <Notify
        title="Checkout Complete"
        shown={modal === 1}
        content={
            <div className="p-4">
                <img src="/checkout.png" className="mx-auto h-24"/>
                <p className="text-justify mt-4">Your order has been placed and waiting for admin aproval. You can still cancel it if your order is still pending. Once accepted by admin, you cannot cancel it anymore.</p>
                <p className="mt-4">You can view/track it&apos;s progress on the <a className="link font-semibold" onClick={()=>router.push("/shop/transaction")}>Transaction</a> tab.</p>
            </div>
        }
        onOkay={() => {
          setModal(-1);
        }}
      />
      <LoadingModal
        title="Checkout Complete"
        message={"Checking Out.."}
        shown={modal === 0}
      />
      <Head>
        <title>Cart</title>
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
        <meta
          itemProp="image"
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
      <div className="mt-14 w-full md:w-4/6 p-2 md:p-8 ">
        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-xl md:text-4xl font-medium font-inter">
              Your Cart
            </p>
            <p className="ml-4">{items.length} product(s)</p>
          </div>
          <button
            disabled={loading || items.length === 0}
            className={`btn btn-sm bg-yellow-400 hover:bg-yellow-500 ${loading ? "loading" : ""}`}
            onClick={() => {
              placeOrder()
            }}
          >
            Checkout
          </button>
        </div>
        <div className="h-4/6 group mt-8 overflow-scroll fade">
          <div className="overflow-x-auto w-full">
            {items.length > 0 && (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Cost</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((prod, i) => (
                    <tr key={i} className="">
                      <td>
                        <div className="flex items-center space-x-3">
                          {/* <img
                            className="h-24 "
                            src={prod.imgUrl}
                            alt="Avatar Tailwind CSS Component"
                          /> */}
                          <div
                            className="h-24 w-24 bg-cover bg-transparent bg-center duration-300 rounded-lg "
                            style={{ backgroundImage: `url(${prod.imgUrl})` }}
                            alt="Shoes"
                            />
                          <div>
                            <div className="font-bold">{prod.articleName}</div>
                            <div className="text-sm opacity-50">
                              {prod.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="form-control">
                          <div className="input-group">
                            <button
                              onClick={() => {
                                if (prod.qty === 1) {
                                  toast.warning("1 is the minimum quantity", {
                                    position: toast.POSITION.TOP_LEFT,
                                  });
                                  return;
                                }
                                less(prod._id);
                              }}
                              className="btn btn-sm"
                            >
                              <CiCircleMinus className="text-2xl" />
                            </button>
                            <input
                              type="text"
                              placeholder="10"
                              value={prod.qty}
                              className="input w-16 input-sm input-bordered text-sm"
                            />
                            <button
                              onClick={() => {
                                if (prod.qty === prod.stock) {
                                  toast.warning(
                                    `${prod.stock} is the maximum stock available`,
                                    {
                                      position: toast.POSITION.TOP_LEFT,
                                    }
                                  );
                                  return;
                                }
                                add(prod._id);
                              }}
                              className="btn btn-sm"
                            >
                              <CiCirclePlus className="text-2xl" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p>{(prod.price * prod.qty).toLocaleString()}</p>
                      </td>
                      <td>
                        <div className="tooltip" data-tip="Remove Item">
                          <CiCircleRemove
                            onClick={() => {
                              toast.success(
                                `"${prod.articleName}" removed from your cart`,
                                {
                                  position: toast.POSITION.TOP_LEFT,
                                }
                              );
                              remove(prod._id);
                            }}
                            className="text-lg md:text-2xl text-error duration-200 ease-in hover:rotate-90 hover:scale-125 cursor-pointer"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {items.length === 0 && (
              <div className="mx-auto">
                <img
                  src="/empty.png"
                  className="mx-auto w-28 h-28 group-hover:rotate-12 duration-200"
                />
                <p className="text-center font-inter tracking-wider">
                  You have no items on your cart
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="font-inter mx-5 md:mx-16 flex items-center justify-between">
          <p className="text-2xl font-bold">Total</p>
          <p className="text-2xl font-medium">{total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

Cart.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default Cart;
