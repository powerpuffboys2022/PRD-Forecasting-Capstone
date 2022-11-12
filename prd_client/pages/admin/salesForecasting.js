import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";

const sales_forecasting = () => {
  return <div>
    <Head>
        <title>Sales Forecast</title>
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

sales_forecasting.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default sales_forecasting;
