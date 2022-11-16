import Head from "next/head";
import { useRouter } from "next/router";
import UserLayout from "../../layouts/UserLayout";


export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>PRD Online Store</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <section className="h-96 w-full bg-rice-pattern flex justify-center items-center">
          <img className="h-1/3" src="/logo_big.png" />
        </section>
        <section className="bg-2 font-inter h-screen w-full flex justify-center items-center">
          <div className="space-y-5">
            <p className="text-4xl font-semibold">Discover rice products</p>
            <p className="text-lg">
              We have a wide variety of rice products to choose from.
            </p>
            <button
              onClick={() => router.push("/shop/store")}
              className="btn bg-rose-500"
            >
              view more in store
            </button>
          </div>
          <div className="w-1/2">
        
          </div>
        </section>
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};
