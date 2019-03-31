from flask import Flask
from flask import render_template

import pandas as pd
import numpy as np
import json
import math


app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

@app.route('/compare/', methods=['GET'])
def compare():
	return render_template('compare.html')

@app.route('/analysis/', methods=['GET'])
def analysis():
	return render_template('analysis.html')

@app.route('/predict/')
def predict():
    print "Hello"
    return "nothing"

@app.route('/categories/', methods=['GET'])
def categories():
	city_restaurants = pd.read_csv('data/lasvegas_restaurants.csv')
	totals = city_restaurants.iloc[:, 13:].sum().sort_values(ascending=False)[2:12]
	totals_dict = pd.DataFrame({'category':totals.index, 'value':totals.values}).to_dict('records')
	totals_json =  json.dumps(totals_dict)
	return render_template('categories.html', totals=totals_dict)

@app.route('/reviews/<category>/<city>', methods=['GET'])
def reviews(category, city):
	restaurants = pd.read_csv('data/reviews.csv')
	city_restaurants = restaurants
	if city is not None:
		city_restaurants = restaurants_combined[restaurants_combined.city == city]
	totals = city_restaurants.iloc[:, 13:].sum().sort_values(ascending=False)
	return json.dumps(totals.to_dict())

if __name__ == '__main__':
	app.debug = True
	app.run()
