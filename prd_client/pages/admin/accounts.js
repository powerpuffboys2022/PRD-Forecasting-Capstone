import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";

const accounts = () => {
  return (
    <div className="font-poppins h-screen main-content flex flex-col flex-grow bg-[#f2f5fa]">
      <Head>
        <title>Accounts</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <link itemProp="image" href="cover.png" />
        <meta itemProp="name" content="Philip Rice Dealer" />
        <meta
          itemProp="description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta
          itemProp="image"
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
    </div>
  );
};

accounts.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default accounts;
