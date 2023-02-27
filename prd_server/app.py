# import packages
from flask import Flask, request, jsonify, json
from flask_cors import CORS, cross_origin
from datetime import date
from datetime import datetime
from dateutil import parser
import pandas as pd
import numpy as np
import xgboost as xgb
import os
# Application CORS
ASSETS_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)
cors = CORS(app, resources={r"/xgboost-predict": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


#   Load Model
model_path = 'prd-sales.bin'
xgboost_model = xgb.XGBRegressor()
xgboost_model.load_model(model_path)

# Routes
# =================================================
# POST http://127.0.0.1:5000/xgboost-predict
# {
#    "days":365
# }
# =================================================


@app.route("/xgboost-predict", methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'application/json'])
def xgboost_predict():
    if request.method != 'POST':
        return "Post Request Only"
    # Get todays date
    today = date.today()
    # Get Number of days prediction
    numDays = int(request.json.get("days"))
    # Give array
    preds = predict_future(xgboost_model, today, numDays)
    df_preds_future = preds.sort_values(by="Date")
    result = []
    for index, row in df_preds_future.iterrows():
        result.append({
            "date": index, "totalSale":  row['Sale']
        })
    response = app.response_class(
        response=json.dumps(result),
        status=200,
        mimetype='application/json'
    )
    return response


def predict_future(model, begin_date, days=7):
    df_preds_future = pd.DataFrame(
        {'Sale': 0, 'Date': pd.date_range(begin_date, periods=days)})
    df_preds_future = df_preds_future.set_index('Date')
    df_preds_future.index = pd.to_datetime(df_preds_future.index)
    df_preds_future = df_preds_future.sort_values(by="Date")
    X, y = create_features(df_preds_future, 'Sale')
    predicted_results_future = model.predict(X)
    X['Sale'] = predicted_results_future
    return X


def create_features(df, target_variable):
    df['date'] = df.index
    df['hour'] = df['date'].dt.hour
    df['dayofweek'] = df['date'].dt.dayofweek
    df['quarter'] = df['date'].dt.quarter
    df['month'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['dayofyear'] = df['date'].dt.dayofyear
    df['dayofmonth'] = df['date'].dt.day
    df['weekofyear'] = df['date'].dt.weekofyear
    X = df[['hour', 'dayofweek', 'quarter', 'month',
            'year', 'dayofyear', 'dayofmonth', 'weekofyear']]
    if target_variable:
        y = df[target_variable]
        return X, y
    return X


if __name__ == '__main__':
    # json_url = os.path.join(SITE_ROOT, 'static', 'data.json')
    context = ('cert.pem', 'key.pem')  # certificate and key files
    app.run(debug=True, ssl_context=context)
