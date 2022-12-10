import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";

const sales_forecasting = () => {
  return <div>
    <Head>
        <title>Sales Forecast</title>
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
      <main>
        
      </main>
  </div>;
};

sales_forecasting.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default sales_forecasting;
