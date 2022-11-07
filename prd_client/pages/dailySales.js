import Head from "next/head";
import HomeLayout from "../layouts/HomeLayout";

const daily_sales = () => {
  return (
    <div>
      <Head>
        <title>Daily Sales</title>
        <meta
          name="description"
          content="A admin web app for Philip Rice Dealer that focuses on Sales Forecasting."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </div>
  );
};

daily_sales.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default daily_sales;
