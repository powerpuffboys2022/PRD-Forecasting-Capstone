import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";

const cart = () => {
  return (
    <div>
      <Head>
        <title>Cart</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

cart.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default cart;
