import axios from "axios";
import React, { useState, useEffect } from "react";

import { getago, dateMomentBeautify } from "../../../helpers";

const InventorySummary = ({ trigger, className }) => {
  const [today, setToday] = useState(new Date());
  const [from, setFrom] = useState(new Date().setDate(today.getDate() - 14));

  const [forecasts, setForecasts] = useState([]);
  const [todaysSales, setTodaysSales] = useState({ date: new Date(), totalSale: 0 })

  const [total, setTotal] = useState(0);

  const compute = (data) => {
    let totals = 0;
    data.forEach((frcst) => (totals += frcst.totalSale));
    setTotal(totals);
  };

  const init = async () => {
    try {
      setForecasts([{ date: new Date(), totalSale: 0 }]);
      setTotal(0);

      const forecastrange = await axios.post("api/prd/forecast", {
        mode: 1,
        filter: {
          datew : {
            $gte : dateMomentBeautify(from, "yyyy-MM-DD"),
            $lte : dateMomentBeautify(today, "yyyy-MM-DD"),
          }
        },
      });

      setForecasts(forecastrange.data)
      compute(forecastrange.data)

      const todayss = await axios.post("api/prd/forecast", {
        mode: 1,
        filter: {
          datew : dateMomentBeautify(today, "yyyy-MM-DD")
        },
      });

      if(todayss.data.length === 0) return
      setTodaysSales(todayss.data[0])
    } catch (e) {
    }
  };

  useEffect(() => { compute(forecasts) }, [forecasts]);

  useEffect(() => {
    init();
  }, [trigger, from]);

  return (
    <div
      className={`bg-white rounded-lg smooth-shadow-fade smooth-shadow-fine p-4 ${className}`}
    >
      <p onClick={()=>{
        console.log('fired')
        init()
      }}>Sale Summary</p>

      <p className="mt-4 text-3xl font-inter">
      ₱ { todaysSales.totalSale.toLocaleString() }
      </p>
      <p className="text-xs text-gray-500">
        Today&apos;s Sale ({dateMomentBeautify(today, "MMM DD YYYY")})
      </p>

      <p className="mt-4 text-2xl font-inter">
      ₱ { total.toLocaleString() }
      </p>
      <p className="text-xs text-gray-500">
        Total Sales from ({dateMomentBeautify(from, "MMM DD YYYY")}) to ({dateMomentBeautify(today, "MMM DD YYYY")})
      </p>


      <div className="flex justify-between items-center text-gray-500">
        <p className="text-xs mt-4">Include Records From</p>
        <input
          type="date"
          value={dateMomentBeautify(from, "YYYY-MM-DD")}
          onChange={(e) => {
            setFrom(new Date(e.target.value));
          }}
          placeholder="Type here"
          className="outline-none border-b border-gray-300 p-2 text-xs mt-2"
        />
      </div>
    </div>
  );
};

export default InventorySummary;
