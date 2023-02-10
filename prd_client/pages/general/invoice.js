import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { dateMomentBeautify } from "../../helpers";

const Invoice = () => {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [reseller, setReseller] = useState();
  const [admin, setAdmin] = useState();

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
        <div className="print:mt-4 bg-white smooth-shadow-thin rounded-lg py-12 px-10 print:p-0 print:shadow-none h-full w-full flex justify-between">
          <div className="w-8/12 p-4 print:p-0">
            <div className="flex justify-between items-center">
              <img className="h-14 prdlogo" src="/logo_big.png" />
              <button
                className="print:hidden px-4 py-2 duration-200 bg-blue-400 rounded-lg text-white hover:bg-blue-300"
                onClick={() => printme()}
              >
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
              </>
            )}
          </div>
          <div className="w-4/12 rounded-md border-dashed border border-gray-200 p-4">
            <img src="https://ih1.redbubble.net/image.3120989000.2710/st,small,507x507-pad,600x600,f8f8f8.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
