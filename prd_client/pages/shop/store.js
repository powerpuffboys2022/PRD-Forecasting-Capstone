import Head from "next/head";
import UserLayout from "../../layouts/UserLayout";

const rice = () => {
  return (
    <div>
      <Head>
        <title>Store</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

rice.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};

export default rice;
