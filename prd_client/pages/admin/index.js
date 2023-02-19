import Head from "next/head";
import HomeLayout from "../../layouts/HomeLayout"
import { useEffect, useState } from "react";
import Loading from "../../components/Loading2";

import Chart, {
    Series,
    Aggregation,
    ArgumentAxis,
    Grid,
    Label,
    Reduction,
    ValueAxis,
    Margin,
    Legend,
    Tooltip,
    Export,
    Title,
    Subtitle,
    CommonSeriesSettings,
} from 'devextreme-react/chart';

import RangeSelector, {
    Size,
    Scale,
    Chart as RsChart,
    ValueAxis as RsValueAxis,
    Series as RsSeries,
    Aggregation as RsAggregation,
    Behavior,
} from 'devextreme-react/range-selector';


export default function Home() {
    const [forecast, setForecast] = useState([])
    const [prediction, setPrediction] = useState([])


    const getForcasts = async () => {
        const response = await fetch("api/prd/forecast", {
            method: "POST",
            mode: "cors",
        })
        const data = await response.json()
        setForecast(data.forecasts)
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
                    value = { ...value, datew: datew, prediction: value.totalSale }
                    return value;
                })
                setPrediction(data)
            })
    }



    const initalize = async () => {
        await getForcasts();
        await getPredictionForecasts();

    }
    useEffect(() => {
        initalize()
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
            <main className="w-full flex-col flex items-center">
                <h1 className="">
                    <span className="font-mono">Dashboard</span>
                </h1>
                <ForecastDashboard forecast={forecast} prediction={prediction} />
            </main>
        </div>
    );
}


const ForecastDashboard = ({ forecast, prediction }) => {
    if (prediction.length == 0 || forecast.length == 0) return (
        <div className="w-full flex justify-center content-center h-24">
            <Loading loading={true} />
        </div>
    )
    const [estimate, setEstimate] = useState(forecast.concat(prediction))
    const [visualRange, setVisualRange] = useState({});
    const updateVisualRange = (e) => {
        setVisualRange(e.value)

    }

    return (
        <div className="w-full">

            <Chart
                id="zoomedChart"
                dataSource={estimate}
                title="PRD Forcasting"
            >
                <CommonSeriesSettings
                    argumentField="datew"
                    type={"line"}
                />
                <Series
                    name="Total Sales"
                    valueField="totalSale"
                >

                </Series>
                <Series
                    name="Prediction"
                    valueField="prediction"
                ></Series>
                <Margin bottom={20} />
                <ArgumentAxis
                    valueMarginsEnabled={false}
                    discreteAxisDivisionMode="crossLabels"
                >
                    <Grid visible={true} />
                </ArgumentAxis>
                <ArgumentAxis
                    visualRange={visualRange}
                    valueMarginsEnabled={false}
                    argumentType="datetime"
                >
                    <Grid visible={true} />
                    <Label visible={false} />
                </ArgumentAxis>
                <Legend
                    verticalAlignment="bottom"
                    horizontalAlignment="center"
                    itemTextPosition="bottom"
                />
                <Export enabled={true} />
                <Title text="Energy Consumption in 2004">
                    <Subtitle text="(Millions of Tons, Oil Equivalent)" />
                </Title>
                <Tooltip enabled={true} contentRender={(info) => {
                    const date = new Date(info.argumentText)
                    const value = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
                    return (
                        <div>
                            <span className="text-xs text-gray-600">{value}</span>
                            <p className="font-bold text-sm">{parseFloat(info.valueText).toFixed(2)}</p>
                        </div>
                    )
                }} />
            </Chart>
            <RangeSelector
                dataSource={estimate}
                onValueChanged={updateVisualRange}
            >
                <Size height={120} />
                <RsChart>
                    <RsValueAxis valueType="numeric" />
                    <RsSeries
                        type="line"
                        valueField="totalSale"
                        argumentField="date"
                    >
                        <RsAggregation enabled="true" />
                    </RsSeries>
                    <RsSeries
                        type="line"
                        valueField="prediction"
                        argumentField="date"
                    >
                        <RsAggregation enabled="true" />
                    </RsSeries>
                </RsChart>
                <Scale
                    placeholderHeight={30}
                    minorTickInterval="month"
                    tickInterval="year"
                    valueType="datetime"
                    aggregationInterval="week"
                />
                <Behavior
                    snapToTicks={true}
                    callValueChanged="onMoving"
                />
            </RangeSelector>
        </div>
    )
}
Home.getLayout = function getLayout(page) {
    return <HomeLayout>{page}</HomeLayout>;
};
