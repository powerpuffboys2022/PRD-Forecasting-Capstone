import { useEffect, useState } from "react";
import Head from "next/head";
import Loading from "../../Loading"
import { getago, dateMomentBeautify } from "../../../helpers";
const https = require('https');
import axios from "axios";
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
} from "devextreme-react/chart";

import RangeSelector, {
    Size,
    Scale,
    Chart as RsChart,
    ValueAxis as RsValueAxis,
    Series as RsSeries,
    Aggregation as RsAggregation,
    Behavior,
} from "devextreme-react/range-selector";

const Forecasting = () => {

    const [forecast, setForecast] = useState([]);
    const [prediction, setPrediction] = useState([]);
    const [loading, setLoading] = useState(false);

    const initalize = async () => {
        setLoading(true)
        await getForcasts();
        await getPredictionForecasts();
        setLoading(false)
    };

    useEffect(() => {
        initalize();
    }, []);

    const getForcasts = async () => {
        const response = await fetch("api/prd/forecast", {
            method: "POST",
            mode: "cors",
        });
        const data = await response.json();
        setForecast(data.forecasts);


    };

    const resetForecast = async () => {
        const response = await fetch("api/prd/forecast", {
            method: "DELETE",
            mode: "cors",
        });
        const data = await response.json();
    };

    const getPredictionForecasts = async () => {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });


        const response = await fetch(
            "http://deployprd-env.eba-naqwvpva.ap-southeast-1.elasticbeanstalk.com/xgboost-predict",
            {
                method: "POST",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "days": 365 }),
                agent: httpsAgent,
            }
        )
            .then((response) => response.json())
            .then((data) => {
                data = data.map((value) => {
                    const date = new Date(value["date"]);
                    const datew =
                        date.getFullYear() +
                        "-" +
                        (date.getMonth() + 1) +
                        "-" +
                        date.getDate();
                    value = { ...value, datew: datew, prediction: value.totalSale };
                    return value;
                });
                setPrediction(data);
            });
    };

    return (
        <>
            <ForecastDashboard forecast={forecast} loading={loading} prediction={prediction} />
        </>
    );
};

const ForecastDashboard = ({ forecast, prediction, loading }) => {
    const [todaysSales, setTodaysSales] = useState({ date: new Date(), totalSale: 0 })

    const [estimate, setEstimate] = useState([]);
    const [visualRange, setVisualRange] = useState({});
    const [today, setToday] = useState(new Date());

    const updateVisualRange = (e) => {
        setVisualRange(e.value);
    };
    const getToday = async () => {
        const todayss = await axios.post("api/prd/forecast", {
            mode: 1,
            filter: {
                datew: dateMomentBeautify(today, "yyyy-MM-DD")
            },
        });
        if (todayss.data.length === 0) return
        setTodaysSales(todayss.data[0])
    }
    useEffect(() => {
        if (
            prediction.length != 0 &&
            forecast.length != 0 &&
            estimate.length != forecast.length + prediction.length
        ) {
            setEstimate(forecast.concat(prediction));
            getToday();

        }
    });
    const sameDay = (d1, d2) => {
        return d1.getUTCFullYear() == d2.getUTCFullYear() &&
            d1.getUTCMonth() == d2.getUTCMonth() &&
            d1.getUTCDate() == d2.getUTCDate();
    }
    const GetCurrentSale = () => {
        if (!todaysSales) return 0;
        return todaysSales.totalSale;
    }

    const MAPEStatus = (f, a) => {
        const mape = MAPE(f, a)
        if (mape <= 10) return "Very Good";
        if (mape <= 20) return "Good"
        if (mape <= 50) return "Not Good"
        if (mape <= 75) return "Bad"
        if (mape <= 100) return "Very Bad"
        return "Unreliable"
    }

    const MAPE = (f, a) => {
        a = Math.abs(parseInt(a))
        f = Math.abs(parseInt(f))
        const res = ((100 / 1) * Math.abs((a - f) / a) * 100).toFixed(2);

        return res
    }


    return (
        <div className="w-full">

            {loading && <div className="flex justify-center"><Loading loading={true} /></div>}
            <Chart
                id="zoomedChart"
                dataSource={estimate}
                title="PRD Daily Forcasting"
            >
                <CommonSeriesSettings argumentField="datew" type={"line"} />
                <Series name="Daily Sales" valueField="totalSale"></Series>
                <Series name="Forecasting" valueField="prediction"></Series>
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
                <Tooltip
                    enabled={true}
                    contentRender={(info) => {
                        const date = new Date(info.argumentText);
                        const value =
                            date.getFullYear() +
                            "-" +
                            (date.getMonth() + 1) +
                            "-" +
                            date.getDate();
                        return (
                            <div>
                                <span className="text-xs text-gray-600">{value}</span>
                                <p className="font-bold text-sm">
                                    {parseFloat(info.valueText).toFixed(2)}
                                </p>
                            </div>
                        );
                    }}
                />
            </Chart>
            <RangeSelector dataSource={estimate} onValueChanged={updateVisualRange}>
                <Size height={120} />
                <RsChart>
                    <RsValueAxis valueType="numeric" />
                    <RsSeries type="line" valueField="totalSale" argumentField="date">
                        <RsAggregation enabled="true" />
                    </RsSeries>
                    <RsSeries type="line" valueField="prediction" argumentField="date">
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
                <Behavior snapToTicks={true} callValueChanged="onMoving" />
            </RangeSelector>
            {prediction.length != 0 && GetCurrentSale() !== null &&
                <div className="w-full flex justify-center mt-16" data-theme="light">
                    <div className="stats bg-inherit shadow">

                        <div className="stat">
                            <div className="stat-title">Todays Prediction</div>
                            <div className="stat-value">{parseInt(prediction[0].prediction).toLocaleString("en-US")}</div>
                            <div className="stat-actions">
                                <div className="stat-desc mt-1">
                                    <div className="stat-desc">Prediction Lower than :  {(prediction[0].prediction + 2711).toLocaleString("en-US")}</div>
                                    <div className="stat-desc mt-1">Prediction Higher than : {(prediction[0].prediction - 2711).toLocaleString("en-US")}</div>

                                </div>
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Current Sale</div>
                            <div className="stat-value">{GetCurrentSale()}</div>
                            <div className="stat-desc mt-1">
                                Based on MAPE : {MAPE(prediction[0].prediction, GetCurrentSale())}%
                                <p className="text-xs">
                                    status <strong>{MAPEStatus(prediction[0].prediction, GetCurrentSale())}</strong>

                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            }
            {/* {prediction.length != 0 && <div className="w-full flex justify-center m-5" data-theme="light">
                <div className="stats stats-vertical lg:stats-horizontal shadow">

                    <div className="stat">
                        <div className="stat-title">MAPE</div>
                        <div className="stat-value">6.30%</div>
                        <div className="stat-desc">Mean absolute Percentage</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">MAE</div>
                        <div className="stat-value">2,711.34</div>
                        <div className="stat-desc">Mean absolute error</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">R2</div>
                        <div className="stat-value">0.945</div>
                        <div className="stat-desc">R-Squared</div>
                    </div>

                </div>
            </div>} */}



        </div >
    );
};

export default Forecasting;
