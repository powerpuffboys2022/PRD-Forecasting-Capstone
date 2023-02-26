
import dbConnect from "../../../services/MongoDb_Service";
const Forecast = require("../../../models/Forecast");
const Dataset = require('./Dataset.json')
dbConnect();

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "255mb",
        },
    },
};

const resetForecast = async (req, res) => {
    await Forecast.deleteMany({})
    Forecast.insertMany(Dataset)
    return res.status(200).json({ success: true })
}
const getForcasts = async (req, res) => {
    let forecasts;
    const { mode, filter } = req.body
    if(!mode) forecasts = await Forecast.find();
    else {
        if(mode === 1) forecasts = await Forecast.find(filter).sort({date : 0});
        else forecasts = []
        return res.status(200).json(forecasts)
    }

    return res.status(200).json({ success: true, forecasts: forecasts })
}

export default async function handler(req, res) {
    switch (req.method) {
        case "POST": {
            return getForcasts(req, res);
        }
        case "DELETE": {
            return resetForecast(req, res);
        }
    }
}