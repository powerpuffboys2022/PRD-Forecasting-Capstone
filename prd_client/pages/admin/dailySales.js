import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";

const daily_sales = () => {
  return (
    <div>
      <Head>
        <title>Daily Sales</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
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
