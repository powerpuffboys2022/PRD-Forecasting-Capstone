import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";


const NotAllowed = () => {
  const router = useRouter();

  return (
    <div className="bg-3">
      <Head>
        <title>Philip Rice Dealer</title>
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
      <section
        className={
          "backdrop-blur-lg font-inter h-screen w-full flex justify-center items-center " +
          ``
        }
      >
        <div className="mx-8 md:mx-0 bg-base-100/40 p-4 md:p-8 rounded-lg">
            <img src="/notallowed.png" className="h-24 mx-auto"/>
            <p className="md:text-lg text-center">Your account is not allowed on this page</p>
            <button onClick={()=>{router.back()}} className="w-full mt-6 btn btn-ghost btn-outline">Go Back</button>
        </div>
      </section>
    </div>
  );
};

export default NotAllowed;
