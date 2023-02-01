import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout";
import { useState, useEffect } from "react";
import axios from "axios";

import RiceSearchDropDown from "../../components/RiceSearchDropDown";
import { async } from "@firebase/util";
import { toast } from "react-toastify";

const Daily_sales = () => {
  const [tab, setTab] = useState(-2);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(-1);
  const [search, setSearch] = useState("");
  const [rices, setRices] = useState([]);
  const [editorData, setEditorData] = useState();

  const [selected, setSelected] = useState();

  const loadRices = async () => {
    try {
      let Rices = await axios.post("/api/prd/rice", { mode: 0 });
      setRices(Rices.data)
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const loadEditorData = async () => {
    try {
      const request = await axios.post("/api/prd/userInfo", {});
      setEditorData(request.data);
    } catch (e) {}
  };

  useEffect(() => {
    loadRices();
    loadEditorData();
  }, []);

  useEffect(()=>{ console.log(selected)}, [selected])

  return (
    <div className="font-poppins overflow-hidden h-screen flex flex-col flex-grow bg-[#f5f8fa]">
      <Head>
        <title>Daily Sales</title>
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
        <meta itemProp="image" content="cover.png" />

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
        <meta property="og:image" content="cover.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Philip Rice Dealer" />
        <meta
          name="twitter:description"
          content="Philip Rice Dealer Online store & forecasting"
        />
        <meta name="twitter:image" content="cover.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-4 h-full relative">
        
      </div>
    </div>
  );
};

Daily_sales.getLayout = function getLayout(page) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Daily_sales;
