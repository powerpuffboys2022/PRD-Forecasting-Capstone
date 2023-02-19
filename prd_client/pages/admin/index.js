import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout"
import { useEffect, useState } from "react";


export default function Home() {
    const [forecast, setForecast] = useState([])
    const [prediction, setPrediction] = useState([])
    const getForcasts = async () => {
        const response = await fetch("api/prd/forecast", {
            method: "POST",
            mode: "cors",
        })
        const data = await response.json()
        setForecast(data);
    }

    const resetForecast = async () => {
        const response = await fetch("api/prd/forecast", {
            method: "DELETE",
            mode: "cors",
        })
        const data = await response.json();
    }

    const getPredictionForecasts = async () => {
        const response = await fetch("http://forecastprd-env-1.eba-jutzyivj.ap-southeast-1.elasticbeanstalk.com/xgboost-predict", {
            method: "POST",
            mode: "cors",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "days": 365 }),
        })
            .then((response) => response.json())
            .then((data) => {
                data = data.map((value) => {
                    const date = new Date(value['date'])
                    const datew = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                    value = { ...value, datew: datew }
                    return value;
                })
                setPrediction(data)
            })


    }
    useEffect(() => {
        getForcasts();
        getPredictionForecasts();
        return;
    }, []);
    return (
        <div>
            <Head>
                <title>Dashboard</title>
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
            <main>
                <h1 className="">
                    <span className="font-mono">Dashboard</span>
                </h1>
                <ForecastDashboard forecast={forecast} prediction={prediction} />

            </main>
        </div>
    );
}


const crosshairFormat = {
    type: 'fixedPoint',
    precision: 2,
};
const ForecastDashboard = ({ forecast, prediction }) => {
    if (!prediction && !forecast) return <></>;
    return (
        <div className="">

        </div>
    )
}
Home.getLayout = function getLayout(page) {
    return <HomeLayout>{page}</HomeLayout>;
};
