import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout"
import { useEffect, useState, useRef } from "react";
import { Line } from 'react-chartjs-2'


export default function Home() {

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
                    <ForecastingGraph />
                </h1>
            </main>
        </div>
    );
}

function ForecastingGraph() {
    const data = {
        labels: ["January", "February", "March", "April", "May", "June", "July", 'August', 'September'],
        backgroundColor: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],

        datasets: [
            {
                label: "Daily Sales",
                data: [0.1, 0.4, 0.2, 0.3, 0.7, 0.4, 0.6, 0.3],
                backgroundColor: ['#f9197f'],
                borderColor: '#fd8cc0',
            },
            {
                label: "Daily Prediction",
                data: [0.2, 0.1, 1, 0.2, 0.2, 0.7, 0.6, 0.3],
                backgroundColor: ['#37A2FF'],
                borderColor: '#8fccf8',

            }
        ]
    }
    const colors = ['#5470C6', '#EE6666'];
    const option = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        xAxis: {
            type: 'category',
            boundaryGap: false,
        },
        yAxis: {
            type: 'value'
        }
    };

    useEffect(() => {
        console.log("helo w")
    })
    return (
        <Line data={data} width={100} height={40} options={option} />
    )
}
Home.getLayout = function getLayout(page) {
    return <HomeLayout>{page}</HomeLayout>;
};
