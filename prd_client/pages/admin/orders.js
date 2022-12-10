import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";

const orders = () => {
  return (
    <div>
      <Head>
        <title>Orders</title>
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

orders.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default orders;
