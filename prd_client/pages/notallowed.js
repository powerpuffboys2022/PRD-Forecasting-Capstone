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
