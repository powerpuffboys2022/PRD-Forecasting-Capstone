import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";

const inventory = () => {
  return <div>
    <Head>
        <title>Inventory</title>
        <meta
          name="description"
          content="A admin web app for Philip Rice Dealer that focuses on Sales Forecasting."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>

      </main>
  </div>;
};

inventory.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default inventory;
