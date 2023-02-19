import random
from datetime import datetime
from dateutil.parser import parse
import csv
import xgboost as xgb
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from datetime import datetime
import json

color_pal = sns.color_palette()
plt.style.use('fivethirtyeight')

data_path = "./prd-sales.csv"

months_list = [
    'January', "Febuary", "March", "April", "May", "June", "July", "August", "Septemnber", "October", "November", "December"
]
# Get data from drive
df = pd.read_csv(data_path, index_col=False)

# Fill the null values by 0 and convert the numbers by float
df['Sale'] = df['Sale'].fillna(0)
df['totalSale'] = df['Sale'].apply(lambda x: 0 if x == 0 or x == '' or x == ' ' else float(
    str(x).replace(',', '').replace(' ', '')))
# Create date as index / key
df = df.set_index('Date')
df.index = pd.to_datetime(df.index)

# Sort the value by Date
df = df.sort_values(by="Date")


def predict_future(model, begin_date, days=7):
    df_preds_future = pd.DataFrame(
        {'totalSale': 0, 'Date': pd.date_range(begin_date, periods=days)})
    df_preds_future = df_preds_future.set_index('Date')
    df_preds_future.index = pd.to_datetime(df_preds_future.index)
    df_preds_future = df_preds_future.sort_values(by="Date")
    X, y = create_features(df_preds_future, 'totalSale')
    predicted_results_future = model.predict(X)
    X['totalSale'] = predicted_results_future
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


def days_between(d1, d2):
    d1 = datetime.strptime(d1, date_time_format)
    d2 = datetime.strptime(d2, date_time_format)
    return abs((d2 - d1).days)


date_time_format = "%Y-%m-%d %H:%M:%S"
csv_date = df.index.date.max().strftime(date_time_format)
date_now = datetime.now().strftime(date_time_format)
oldest_date = csv_date if parse(csv_date) < parse(date_now) else date_now

model_path = 'prd-sales.bin'
xgboost_model = xgb.XGBRegressor()
xgboost_model.load_model(model_path)

preds = predict_future(xgboost_model, oldest_date,
                       days_between(csv_date, date_now))
df_preds_future = preds.sort_values(by="Date")


dates = []
totalSale = []
for index, row in df_preds_future.iterrows():
    dates.append(index)
    value = int(row['totalSale'])
    res = random.randint(value-100, value+300)
    totalSale.append(res)

new_value = {
    'totalSale': totalSale
}
df_res = pd.DataFrame(new_value, index=dates)
df_all_rows = pd.concat([df, df_res])
# df_all_rows['Sale'].plot(style='.',
#                          figsize=(15, 5),
#                          color=color_pal[0],
#                          title='Daily Sales')
plt.show()

result = []
for index, row in df_all_rows.iterrows():
    result.append({
        "date":  index.strftime(date_time_format), "totalSale":  row['totalSale']
    })


# Function to convert a CSV to JSON
# Takes the file paths as arguments
jsonFilePath = 'Dataset.json'
with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
    jsonf.write(json.dumps(result, indent=4))
