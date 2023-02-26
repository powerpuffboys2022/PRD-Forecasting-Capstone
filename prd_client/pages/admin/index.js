import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";
import { useState, useEffect } from "react";

import Forecasting from "../../components/Admin/Dashboard/Forecasting"
import OrderSummary from "../../components/Admin/Dashboard/OrderSummary"
import InventorySummary from "../../components/Admin/Dashboard/InventorySummary"
import DailySaleSummary from "../../components/Admin/Dashboard/DailySaleSummary"

export default function Home() {
  const [trigger, setTrigger] = useState(0)

  return (
    <div className="font-inter overflow-y-scroll h-screen w-full bg-[#f5f8fa]">
      <Head>
        <title>Dashboard</title>
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
      <div className="py-4 px-6 h-full">
        <div className="mountedanimater bg-white px-6 py-6 mt-6 rounded-lg smooth-shadow-fine">
          <Forecasting />
        </div>
        
        <div className="mountedanimater mt-6 rounded-md smooth-shadow-fine flex justify-evenly">
            <div className="w-1/3">
                <OrderSummary className="mr-2" />
            </div>
            <div className="w-1/3">
                <InventorySummary className="mx-2"/>
            </div>
            <div className="w-1/3">
                <DailySaleSummary className="ml-2"/>
            </div>
        </div>

        <div className="h-12"></div>
      </div>
    </div>
  );
}



Home.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};
