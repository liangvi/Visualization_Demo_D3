from flask import Flask
from flask import render_template, request

import pandas as pd
import numpy as np
import json
import math
import pickle

import sklearn

from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import CountVectorizer

from sklearn.linear_model import ElasticNet

from sklearn.metrics import r2_score

from sklearn.feature_extraction import stop_words
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import DictVectorizer

from scipy.sparse import csr_matrix, hstack, coo_matrix


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

#https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_and_retrieving_form_data
@app.route('/review/', methods=['GET', 'POST'])
def review():

	enc_file = open('enc.pkl', 'rb')
	enc = pickle.load(enc_file)

	vec_file = open('vec.pkl', 'rb')
	vectorizer = pickle.load(vec_file)

	pkl_file = open('model.pkl', 'rb')
	p = pickle.load(pkl_file)
	text=[request.form['text']]
	text_tf = vectorizer.transform(text)

	text_lower = text[0].lower()

	text_enc = enc.transform([[text_lower]])

	text_joined = hstack([text_tf, text_enc], format="csr")
	score = p.predict(text_joined)
	return render_template('review.html', text, score="5")

'''
    return render_template('review.html', text=request.form['text'], score=score)
'''

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
