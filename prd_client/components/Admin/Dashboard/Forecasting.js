import { useEffect, useState } from "react";
import Loading from "../../Loading"

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
    const response = await fetch(
      "http://forecastprd-env-1.eba-jutzyivj.ap-southeast-1.elasticbeanstalk.com/xgboost-predict",
      {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days: 365 }),
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
      <ForecastDashboard forecast={forecast} loading={loading}  prediction={prediction} />
    </>
  );
};

const ForecastDashboard = ({ forecast, prediction, loading }) => {
  const [estimate, setEstimate] = useState([]);
  const [visualRange, setVisualRange] = useState({});

  const updateVisualRange = (e) => {
    setVisualRange(e.value);
  };

  useEffect(() => {
    if (
      prediction.length != 0 &&
      forecast.length != 0 &&
      estimate.length != forecast.length + prediction.length
    ) {
      setEstimate(forecast.concat(prediction));
    }
  });

  return (
    <div className="w-full">
        { loading && <div className="flex justify-center"><Loading loading={true} /></div>}
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
    </div>
  );
};

export default Forecasting;
