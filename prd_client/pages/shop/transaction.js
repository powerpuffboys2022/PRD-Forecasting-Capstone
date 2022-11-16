import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";

const transactions = () => {
  return (
    <div>
      <Head>
        <title>Transaction</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

transactions.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default transactions;
