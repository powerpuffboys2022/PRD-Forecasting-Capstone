import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout"

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="">
          <span className="font-mono">Dashboard</span>
        </h1>
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};
