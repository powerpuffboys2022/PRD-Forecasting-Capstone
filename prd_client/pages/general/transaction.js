import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { getDateAgo, dateMomentBeautify, beautifyMoney } from "../../helpers";
import Loading from "../../components/Loading";
import { BsTelephoneFill } from "react-icons/bs";
import { SiMinutemailer } from "react-icons/si";
import { FaMapMarkerAlt } from "react-icons/fa";
import { HiArrowSmLeft } from "react-icons/hi";
const Transaction = () => {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [reseller, setReseller] = useState();
  const [admin, setAdmin] = useState();

  const [userName, setUserName] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const loadTransaction = () => {
    setLoading(true);
    const response = fetch("/api/prd/transaction", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content: { _id: transactionId },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data[0]);
        let accumulate = 0;
        data[0].rice.forEach((rc) => {
          accumulate += rc.price * rc.qty;
        });

        setTotal(accumulate);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadReseller = () => {
    setLoading(true);
    const response = fetch("/api/prd/userInfo", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: transaction.userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReseller(data);
        setImgUrl(data.imgUrl);
        setUserName(data.userName);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadAdmin = () => {
    if (!transaction || !transaction.processedBy) return;
    setLoading(true);
    const response = fetch("/api/prd/userInfo", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: transaction.processedBy,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setAdmin(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!transaction) return;
    loadReseller();
    loadAdmin();
  }, [transaction]);

  useEffect(() => {
    if (transactionId.length === 0) return;
    loadTransaction();
  }, [transactionId]);

  useEffect(() => {
    let { _id } = router.query;
    if (_id) {
      setTransactionId(_id);
    }
  }, [router]);

  const getStepStyle = (status) => {
    if (status === -1) return "step-error";
    if (status === 1) return "step-neutral";
    if (status === 2) return "step-warning";
    if (status === 3) return "step-primary";
    if (status === 4) return "step-success";
    return "step-neutral";
  };

  return (
    <div className="w-full flex justify-center">
      <Head>
        <title>Transaction Detail</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="font-inter w-full mx-4 pb-14 md:mx-0 md:w-2/4 mt-12 relative">
      <button
            className="btn btn-sm btn-ghost absolute top-0 left-0"
            onClick={() => router.back() }
          >
            <HiArrowSmLeft className="text-lg mr-2" /> Go back
          </button>
        <p className="text-lg md:text-3xl font-inter mx-auto text-center">
          Transaction Information
        </p>

        <p className="font-inter mx-auto text-center mt-4 md:mt-8">
          Order ID : {transactionId}
        </p>

        <div className="w-full mx-auto mt-4">
          <ul className="steps steps-vertical w-full md:mt-8 duration-200 ease-in-out lg:steps-horizontal">
            <li
              className={
                "step " +
                `${
                  !transaction
                    ? getStepStyle(-2)
                    : getStepStyle(transaction.status)
                }`
              }
            >
              {!transaction ? (
                <p>-</p>
              ) : (
                <div>
                  <p className="font-medium text-lg">Placed</p>
                  <p>
                    {dateMomentBeautify(
                      new Date(transaction.placedDate),
                      "MMMM Do YYYY"
                    )}
                  </p>
                  <p className="text-xs ">
                    {getDateAgo(new Date(), new Date(transaction.placedDate))}{" "}
                    Days Ago
                  </p>
                </div>
              )}
            </li>
            <li
              className={
                "step " +
                `${
                  !transaction
                    ? getStepStyle(-2)
                    : transaction.trackingDates.processed
                    ? getStepStyle(transaction.status)
                    : ""
                }`
              }
            >
              {!transaction ? (
                <p>-</p>
              ) : (
                <div>
                  <p className="font-medium text-lg">Processing</p>
                  {!transaction.trackingDates.processed ? (
                    "-"
                  ) : (
                    <>
                      <p>
                        {dateMomentBeautify(
                          new Date(transaction.trackingDates.processed),
                          "MMMM Do YYYY"
                        )}
                      </p>
                      <p className="text-xs ">
                        {getDateAgo(
                          new Date(),
                          new Date(transaction.trackingDates.processed)
                        )}{" "}
                        Days Ago
                      </p>
                    </>
                  )}
                </div>
              )}
            </li>
            <li
              className={
                "step " +
                `${
                  !transaction
                    ? getStepStyle(-2)
                    : transaction.trackingDates.shipped
                    ? getStepStyle(transaction.status)
                    : ""
                }`
              }
            >
              {!transaction ? (
                <p>-</p>
              ) : (
                <div>
                  <p className="font-medium text-lg">Shipped</p>
                  {!transaction.trackingDates.shipped ? (
                    "-"
                  ) : (
                    <>
                      <p>
                        {dateMomentBeautify(
                          new Date(transaction.trackingDates.shipped),
                          "MMMM Do YYYY"
                        )}
                      </p>
                      <p className="text-xs ">
                        {getDateAgo(
                          new Date(),
                          new Date(transaction.trackingDates.shipped)
                        )}{" "}
                        Days Ago
                      </p>
                    </>
                  )}
                </div>
              )}
            </li>
            <li
              className={
                "step " +
                `${
                  !transaction
                    ? getStepStyle(-2)
                    : transaction.trackingDates.completed
                    ? getStepStyle(transaction.status)
                    : ""
                }`
              }
            >
              {!transaction ? (
                <p>-</p>
              ) : (
                <div>
                  <p className="font-medium text-lg">Completed</p>
                  {!transaction.trackingDates.completed ? (
                    "-"
                  ) : (
                    <>
                      <p>
                        {dateMomentBeautify(
                          new Date(transaction.trackingDates.completed),
                          "MMMM Do YYYY"
                        )}
                      </p>
                      <p className="text-xs ">
                        {getDateAgo(
                          new Date(),
                          new Date(transaction.trackingDates.completed)
                        )}{" "}
                        Days Ago
                      </p>
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>

        <p className="text-lg font-medium mt-16">Items Ordered</p>

        <div className="h-80 group mt-8 overflow-scroll fade">
          <div className="overflow-x-auto w-full">
            {transaction && (
              <>
                {transaction.rice.length > 0 && (
                  <table className="table w-full shadow-lg">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.rice.map((prod, i) => (
                        <tr key={i} className="">
                          <td>
                            <div className="flex items-center space-x-3">
                              <img
                                className="h-24 w-16"
                                src={prod.imgUrl}
                                alt="Avatar Tailwind CSS Component"
                              />
                              <div>
                                <div className="font-bold">{prod.name}</div>
                                <div className="text-sm opacity-80">
                                  {prod.netWeight}Kg | {prod.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p>{prod.qty}</p>
                          </td>
                          <td>
                            <p>{beautifyMoney(prod.price * prod.qty, 2)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>

        <div className="font-inter bg-base-200 hover:scale-105 duration-150 ease-in-out shadow-lg w-full rounded-md p-5  flex items-center justify-between">
          <p className="text-2xl font-bold">Total</p>
          <p className="text-2xl font-medium">{beautifyMoney(total, 2)}</p>
        </div>

        <p className="text-lg font-medium mt-16">Partner Info</p>

        <div className="flex justify-start group items-center mt-4">
          <div className="p-4 md:p-8 w-full duration-150 ease-in group-hover:text-white bg-base-300 group-hover:bg-neutral group-hover:shadow-xl">
            <div className="flex items-center space-x-3 ">
              {imgUrl === "" ? (
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-24 group-hover:w-32 duration-200 ease-in-out">
                    <span>
                      {loading ? (
                        userName.substring(0, 2)
                      ) : (
                        <Loading loading={true} />
                      )}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="avatar">
                  <div className="w-24 group-hover:w-32 duration-200 ease-in-out rounded-full">
                    {imgUrl === "" ? (
                      <Loading loading={true} />
                    ) : (
                      <img src={imgUrl} alt="User Profile Pic" />
                    )}
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center space-x-3">
                  <p className="text-2xl font-medium">{userName}</p>
                  <div className="flex justify-start items-center">
                    <BsTelephoneFill className="text-xl mr-2" />
                    <p className="text-lg">
                      {reseller ? reseller.contact : "-"}
                    </p>
                  </div>
                  <div className="flex justify-start items-center">
                    <SiMinutemailer className="text-xl mr-2" />
                    <p className="text-lg">{reseller ? reseller.email : "-"}</p>
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <FaMapMarkerAlt className="text-2xl mr-2" />
                  <p className="text-lg font-medium ">Delivery Address</p>
                </div>
                <p className="text-lg mt-2 p-1">
                  {reseller ? reseller.address : "-"}
                </p>
                <p className="opacity-0 mt-2 text-sm group-hover:opacity-100">
                  Joined on{" "}
                  {reseller
                    ? dateMomentBeautify(
                        new Date(reseller.dateJoined),
                        "MMMM Do YYYY"
                      ) +
                      " | id : " +
                      reseller._id
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg font-medium mt-8">Admin</p>

        <div className="flex justify-start items-center mt-4">
          {!admin ? (
            <p className="mt-4 text-center tex-lg w-full">
              this order is waiting to be managed by an admin
            </p>
          ) : (
            <div className="flex items-center space-x-4 p-4 bg-neutral w-full text-white">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <img src={admin.imgUrl} />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <p className="text-2xl font-medium">{admin.userName}</p>
                  <div className="flex justify-start items-center">
                    <BsTelephoneFill className="text-xl mr-2" />
                    <p className="text-lg">{admin ? admin.contact : "-"}</p>
                  </div>
                  <div className="flex justify-start items-center">
                    <SiMinutemailer className="text-xl mr-2" />
                    <p className="text-lg">{admin ? admin.email : "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
