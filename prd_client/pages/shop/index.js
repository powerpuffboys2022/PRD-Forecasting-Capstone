import Head from "next/head";
import { useRouter } from "next/router";
import UserLayout from "../../layouts/UserLayout";

import Slider from "react-slick";

import RiceCard from "../../components/Users/RiceCard"

export default function Home() {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const rices = [{
    articleName : "Jasmine Rice", // name ng bigas
  articleCode : "jsmn", // shortcut ng name
  description : "Malagkit", // malagkit something
  price : 1500,
  imgUrl : "https://sunnywoodrice.com/wp-content/uploads/2019/05/Farmboy-Jasmine-2019-2kg-FINAL-01.jpg",
  purchased : 0,
  sold : 5,
  stock : 25,
  pricePerKg : 43,
  netWeight : 25,
  dateAdded : { type : Date, default : Date.now }
  },{
    articleName : "Jasmine Rice Malagkit", // name ng bigas
  articleCode : "jsmn-mlgkt", // shortcut ng name
  description : "Malagkit", // malagkit something
  price : 2100,
  imgUrl : "https://sunnywoodrice.com/wp-content/uploads/2019/05/Farmboy-Jasmine-2019-2kg-FINAL-01.jpg",
  purchased : 0,
  sold : 8,
  stock : 12,
  pricePerKg : 47,
  netWeight : 50,
  dateAdded : { type : Date, default : Date.now }
  },
];


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
            <Slider className="h-96 my-10" {...settings}>
              {
                rices.map((rc, i) => <RiceCard articleName={rc.articleName} imgUrl={rc.imgUrl} netWeight={rc.netWeight} price={rc.price} key={i}/>)
              }
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
