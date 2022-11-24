import Head from "next/head";
import { useRouter } from "next/router";
import UserLayout from "../../layouts/UserLayout";
import { useState, useEffect } from "react";

import Slider from "react-slick";

import RiceCard from "../../components/Users/RiceCard";

export default function Home() {
  const router = useRouter();

  const [rices, setRices] = useState([]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const init = () => {
    const response = fetch("/api/prd/rice", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 0,
        content: {},
      }),
    })
      .then((res) => {
        return res;
      })
      .then((data) => {
        data.json().then((data) => setRices(data));
      })
      .catch((err) => {})
      .finally((d) => {});
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <Head>
        <title>PRD Online Store</title>
        <meta name="description" content="Philip Rice Dealer Online Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <section className="h-96 w-full bg-rice-pattern flex justify-center items-center">
          <img className="md:h-1/3" src="/logo_big.png" />
        </section>

        <section className="bg-2 font-inter md:h-screen w-full py-8 md:p-0 md:flex justify-center items-center">
          <div className="md:w-1/3 px-8 md:px-14 space-y-5">
            <p className="text-2xl md:text-4xl font-semibold">
              Discover rice products
            </p>
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
          <div className="md:w-2/3 px-8">
            <Slider className="h-96 my-10" {...settings}>
              {rices.map((rc, i) => (
                <RiceCard
                  articleName={rc.articleName}
                  imgUrl={rc.imgUrl}
                  netWeight={rc.netWeight}
                  price={rc.price}
                  key={i}
                />
              ))}
            </Slider>
          </div>
        </section>

        <section className="bg-3 bg-fuchsia-50 font-inter md:h-screen w-full md:flex justify-center items-center">
          <div className="md:w-1/2 py-12 md:px-14 ">
            <p className="mx-5 md:mx-0 text-center md:text-left text-2xl md:text-4xl leading-relaxed font-inter">
              We distribute <span className="font-bold">high quality</span> rice
              from our <span className="font-bold">Filipino farmers </span>
            </p>
          </div>
          <div className="py-12 px-4 md:w-1/2 md:p-24 flex items-center justify-center">
            <img src="/farmers.png" />
          </div>
        </section>

        <section className="bg-2 md:h-screen bg-fuchsia-50 font-inter py-20 w-full flex-col justify-center items-center">
          <div className="px-8 md:px-14 md:w-1/2 space-y-5 mx-auto">
            <p className="text-2xl font-medium md:text-5xl text-center leading-relaxed font-inter">
              How We Can Serve You?
            </p>
            <p className="text-center text-lg">
              We always think of how we can efficiently reach & deliver to our
              resellers & partners their preferred products.
            </p>
          </div>
          <div className="md:flex mx-auto mt-4 md:mt-16 md:space-x-8 md:w-3/4 items-center justify-evenly">
            <div className="mx-5 md:w-1/3 backdrop-blur-md px-8 py-12 rounded-md shadow-xl">
              <img className="mx-auto w-1/4 md:w-1/3" src="/asst1.png" />
              <p className="text-center mt-8 font-medium text-xl md:text-3xl">
                Place Order
              </p>
              <p className="text-center mt-4">
                Choose products and place your order to generate a transaction
                request
              </p>
            </div>
            <div className="mx-5 md:w-1/3 backdrop-blur-md px-8 py-12 rounded-md shadow-xl">
              <img className="mx-auto w-1/4 md:w-1/3" src="/asst2.png" />
              <p className="text-center mt-8 font-medium text-xl md:text-3xl">
                Track It’s Status
              </p>
              <p className="text-center mt-4">
                Wait for confirmation & monitor your transaction status
              </p>
            </div>
            <div className="mx-5 md:w-1/3 backdrop-blur-md px-8 py-12 rounded-md shadow-xl">
              <img className="mx-auto w-1/4 md:w-1/3" src="/asst3.png" />
              <p className="text-center mt-8 font-medium text-xl md:text-3xl">
                Recieve & Pay
              </p>
              <p className="text-center mt-4">
                Pay & Recieve your orders at your own store / home
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};
