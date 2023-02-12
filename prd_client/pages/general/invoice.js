import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { dateMomentBeautify } from "../../helpers";

import { SlPrinter } from "react-icons/sl"

const Invoice = () => {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [reseller, setReseller] = useState();
  const [admin, setAdmin] = useState();
  const [updater, setUpdater] = useState();

  const [userName, setUserName] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const printme = () => {
    print();
  };

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

    if (!transaction.updatedBy) return;

    const response2 = fetch("/api/prd/userInfo", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: transaction.updatedBy,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUpdater(data);
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
    let { invoiceId } = router.query;
    if (invoiceId) {
      setTransactionId(invoiceId);
    }
  }, [router]);

  return (
    <div className="globalBg w-full flex justify-center">
      <Head>
        <title>Invoice</title>
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
      <div className="w-full p-16 print:p-0">
        <div className="relative printable print:mt-4 bg-white smooth-shadow-thin rounded-lg py-12 px-10 print:p-0 print:shadow-none h-full w-full">
          <div className="flex justify-between">
            <div className="w-8/12 p-4 print:p-0">
              <div className="flex justify-between items-center">
                <img className="h-14 prdlogo" src="/logo_big.png" />
                <button
                  className="print:hidden inline-flex gap-2 items-center px-4 py-2 duration-200 bg-blue-400 rounded-lg text-white hover:bg-blue-300"
                  onClick={() => printme()}
                >
                  <SlPrinter className="text-lg"/>
                  Print Invoice
                </button>
              </div>

              {transaction && (
                <>
                  <div className="mt-16 print:mt-8">
                    <p className=" font-inter text-xs">
                      <span className="font-medium text-sm text-gray-600">
                        Invoice #
                      </span>{" "}
                      {transactionId}
                    </p>
                  </div>

                  <div className="mt-8">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-inter font-medium text-gray-500 print:text-gray-500 print:text-xs">
                          Date Placed
                        </p>
                        <p className="mt-2 text-xs font-inter font-medium text-gray-800">
                          {dateMomentBeautify(
                            new Date(transaction.placedDate),
                            "DD MMM, YYYY"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-inter font-medium text-gray-500 print:text-gray-500">
                          Date Shipped
                        </p>
                        <p className="mt-2 text-xs font-inter font-medium text-gray-800">
                          {transaction.trackingDates.shipped && (
                            <>
                              {dateMomentBeautify(
                                new Date(transaction.trackingDates.shipped),
                                "DD MMM, YYYY"
                              )}
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-inter font-medium text-gray-500 print:text-gray-500">
                          Date Completed
                        </p>
                        <p className="mt-2 text-xs font-inter font-medium text-gray-800">
                          {dateMomentBeautify(
                            new Date(transaction.placedDate),
                            "DD MMM, YYYY"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex justify-between items-center">
                      <div className="w-1/4">
                        <p className="text-xs font-inter font-medium text-gray-500 print:text-gray-500 print:text-xs">
                          Issued By
                        </p>
                        <p className="mt-2 text-xs font-inter font-medium text-gray-800">
                          Philip Rice Dealer
                        </p>
                        <p className="text-sm font-inter text-gray-500">
                          Philip Rice Dealer . Quezon City . Philippines
                        </p>
                      </div>
                      <div className="w-1/4">
                        {reseller && (
                          <>
                            <p className="text-xs font-inter font-medium text-gray-500 print:text-gray-500 print:text-xs">
                              Issued To
                            </p>
                            <p className="mt-2 text-xs font-inter font-medium text-gray-800">
                              {reseller.userName}
                            </p>
                            <p className="text-sm font-inter text-gray-500">
                              {reseller.email}
                            </p>
                            <p className="text-sm font-inter text-gray-500">
                              {reseller.address}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="w-1/4"></div>
                    </div>
                  </div>

                  <table className="w-full mt-8">
                    <thead className="text-left">
                      <tr className="border-b border-gray-100">
                        <th className="py-5 text-sm text-gray-500">Product</th>
                        <th className="py-5 text-sm text-gray-500">
                          Net Weight
                        </th>
                        <th className="py-5 text-sm text-gray-500">Price</th>
                        <th className="py-5 text-sm text-gray-500">Qty</th>
                        <th className="py-5 text-sm text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.rice.map((rc, id) => (
                        <tr className="" key={id}>
                          <td className="py-3 text-sm text-gray-700 font-medium">
                            {rc.name}
                          </td>
                          <td className="py-3 text-sm text-gray-600">
                            {rc.netWeight}
                            <span className="text-gray-500 font-medium text-xs">
                              kg
                            </span>
                          </td>
                          <td className="py-3 text-sm text-gray-600 font-inter">
                            {rc.price.toLocaleString()}
                          </td>
                          <td className="py-3 text-sm text-gray-600">x{rc.qty}</td>
                          <td className="py-3 text-sm text-gray-700 font-inter font-medium">
                            {(rc.qty * rc.price).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-100">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="py-4 text-sm text-gray-500">Total</td>
                        <td className="font-inter  text-sm text-gray-700 font-medium">
                          {transaction
                            ? transaction.totalPrice.toLocaleString()
                            : "0.00"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              )}
            </div>
            <div className="w-4/12">
              <div className="rounded-md border-dashed border border-gray-200 p-4 m-4">
                <p className="font-medium text-gray-800 text-sm">
                  Payment Method
                </p>
                <p className="text-gray-600 text-sm">Cash on Delivery</p>

                <p className="font-medium text-gray-800 mt-6 text-sm">
                  Delivery Address
                </p>
                <p className="text-gray-600 text-sm">
                { reseller ? reseller.address : "-" }
                </p>
                <p className="font-medium text-gray-800 mt-6 text-sm">Customer Contact</p>
                <p className="text-gray-600 text-sm">{reseller ? reseller.contact : "-"}</p>
                <p className="font-medium text-gray-800 mt-6 text-sm">Accepted By</p>
                <p className="text-gray-600 text-sm">{admin ? admin.userName : "-"}</p>
                <p className="text-gray-600 text-sm">{admin ? admin.contact : "-"}</p>
                <p className="font-medium text-gray-800 mt-6 text-sm">Updated By</p>
                <p className="text-gray-600 text-sm">{updater ? updater.userName : "-"}</p>
                <p className="text-gray-600 text-sm">{updater ? updater.contact : "-"}</p>

              </div>
            </div>
          </div>
          <p className="text-center w-full text-xs font-medium text-gray-400 mt-6">
            Delivery Cost is not added, Trucker shipping cost varries depending
            on delivery address.
          </p>
          <p className="text-gray-500 text-xs text-center font-inter mt-16">
            Invoice autogenerated by PRD web systems at{" "}
            {dateMomentBeautify(new Date(), "MMMM DD YYYY @ hh:mm A")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
