import Head from "next/head";
import UserLayout from "../../layouts/UserLayout"

export default function Home() {
  return (
    <div>
      <Head>
        <title>PRD Online Store</title>
        <meta
          name="description"
          content="Philip Rice Dealer Online Store"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-8">
        <h1 className="">
          <span className="font-mono">Our Rice</span>
        </h1>
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};
