import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";


const Index = () => {
  const router = useRouter();

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
      .then((res) => {
        if (res.status === 401) router.push("/login");
        return res;
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.userType === 0) router.push("/shop");
        else if (data.userType === 1) router.push("/admin");
      });
  };

  useEffect(() => {
    loadUser();
  }, []);

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
          "backdrop-blur-lg animate-pulse font-inter h-screen w-full flex justify-center items-center " +
          ``
        }
      >
        <img
          src="/logo_big.png"
          className="h-8 sm:h-14 md:h-16 lg:h-24 font-bold md:text-2xl font-inter"
        />
      </section>
    </div>
  );
};

export default Index;
