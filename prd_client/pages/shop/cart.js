import React, { useEffect, useState } from "react";

import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";

import { toast } from "react-toastify";

const cart = () => {
  const [userData, setUserData] = useState();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0.0)

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
      });
  };

  const findQtyFromCart = (_id) => {
    for(var x = 0; x < userData.cart.length; x++)
        if(userData.cart[x]._id === _id) return userData.cart[x].qty
  }

  const fetchCart = () => {
    let prod_ids = [];

    userData.cart.forEach((id, i) => {
      prod_ids.push(id._id);
    });

    let merged = []

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
          dt.forEach((prod)=>{
            merged.push({...prod, qty : findQtyFromCart(prod._id)})
          })
          let tot = 0.00
          merged.forEach((pr) => { tot += (pr.price * pr.qty) })
          setTotal(tot)
          setItems(merged)
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
      <Head>
        <title>Cart</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-14 w-full md:w-4/6 p-2 md:p-8 ">
        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center">
            <p className="text-xl md:text-4xl font-medium font-inter">
              Your Cart
            </p>
            <p className="ml-4">4 products</p>
          </div>
          <button className="btn">Checkout</button>
        </div>
        <div className="h-4/6 mt-8 overflow-scroll fade">
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {items.map((prod, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="/tailwind-css-component-profile-2@56w.png"
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{prod.articleName}</div>
                          <div className="text-sm opacity-50">
                            United States
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      Zemlak, Daniel and Leannon
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        Desktop Support Technician
                      </span>
                    </td>
                    <td>Purple</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="font-inter mx-5 md:mx-16 flex items-center justify-between">
          <p className="text-2xl font-bold">Total</p>
          <p className="text-2xl font-medium">{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

cart.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default cart;
