import Head from "next/head";
import { useRouter } from "next/router";
import UserLayout from "../../layouts/UserLayout";

import Slider from "react-slick";

export default function Home() {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

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
          <div className="w-1/3 px-14 space-y-5">
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
          <div className="w-2/3 px-8">
            <Slider className="" {...settings}>
              <div className="card mx-4 w-96 bg-base-100 shadow-xl">
                <figure>
                  <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

              <div className="card mx-4 w-96 bg-base-100 shadow-xl">
                <figure>
                  <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

              <div className="card mx-4 w-96 bg-base-100 shadow-xl">
                <figure>
                  <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>

              <div className="card mx-4 w-96 bg-base-100 shadow-xl">
                <figure>
                  <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Shoes!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </section>
      </main>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <UserLayout>{page}</UserLayout>;
};
