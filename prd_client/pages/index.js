import Head from "next/head";
import HomeLayout from "../Layouts/HomeLayout";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Philip Rice Dealer</title>
        <meta
          name="description"
          content="A admin web app for Philip Rice Dealer that focuses on Sales Forecasting."
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
