from flask import Flask
from flask import render_template, request

import pandas as pd
import numpy as np
import json
import math
import pickle

import copy
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

@app.route('/index/<cat>/', methods=['GET', 'POST'])
def index(cat):
	enc_file = open('enc.pkl', 'rb')
	enc = pickle.load(enc_file)

	vec_file = open('vec.pkl', 'rb')
	vectorizer = pickle.load(vec_file)

	pkl_file = open('model.pkl', 'rb')
	p = pickle.load(pkl_file)
	#category=request.form['category']
	category = "Pizza"
	#category = [cat]
	city = "phoenix"
	text = ["this is a good review"]



#encode city
	cities = []
	for t in enc.categories_:
		for c in t:
			cities.append(c)

	text_enc = genCity(city, cities)

#encode Category
	cat_row = genCat(category)

	text_tf = vectorizer.transform(text)

	text_joined = hstack([text_tf, text_enc, cat_row], format="csr")
	score_phoenix = p.predict(text_joined)



	category = "Pizza"
	city = "las vegas"
	text = ["this is a good review"]



#encode city
	cities = []
	for t in enc.categories_:
		for c in t:
			cities.append(c)

	text_enc = genCity(city, cities)

#encode Category
	cat_row = genCat(category)

	text_tf = vectorizer.transform(text)

	text_joined = hstack([text_tf, text_enc, cat_row], format="csr")
	score_lv = p.predict(text_joined)

	t = pd.read_csv("static/data/states_in.csv", dtype= {'id': str})
	#phoenix
	t.loc[t['id'] == '04', ['rate']] = score_phoenix

	#las vegas
	t.loc[t['id'] == '32', ['rate']] = score_lv

	#charlotte
	t.loc[t['id'] == '33', ['rate']] = 3
	t.loc[t['id'] == '34', ['rate']] = 4
	t.loc[t['id'] == '35', ['rate']] = 5
	t.loc[t['id'] == '36', ['rate']] = 6
	t.loc[t['id'] == '37', ['rate']] = 7
	t.loc[t['id'] == '38', ['rate']] = 6
	t.loc[t['id'] == '39', ['rate']] = 5
	t.loc[t['id'] == '40', ['rate']] = 4
	t.loc[t['id'] == '41', ['rate']] = 3
	t.loc[t['id'] == '42', ['rate']] = 4
	t.loc[t['id'] == '43', ['rate']] = 5
	t.loc[t['id'] == '44', ['rate']] = 6
	t.loc[t['id'] == '45', ['rate']] = 7




	t.to_csv("static/data/states.csv", sep=',')
	return render_template('index.html')
'''

	text=[request.form['text']]
	city=request.form['city']



	'''


@app.route('/compare/<cat>/<loc>', methods=['GET'])
def compare(cat, loc):
	restaurants_file = open('pickle/restaurants_min.pkl', 'rb')
	restaurants = pickle.load(restaurants_file)
	restaurants_file.close()

	all_topic_keywords_file = open('pickle/all_topic_keywords.pkl', 'rb')
	all_topic_keywords = pickle.load(all_topic_keywords_file)
	all_topic_keywords_file.close()

	all_document_topic_file = open('pickle/all_document_topic.pkl', 'rb')
	all_document_topic = pickle.load(all_document_topic_file)
	all_document_topic_file.close()

	all_topic_distribution_file = open('pickle/all_topic_distribution.pkl', 'rb')
	all_topic_distribution = pickle.load(all_topic_distribution_file)
	all_topic_distribution_file.close()

	good_topic_keywords_file = open('pickle/good_topic_keywords.pkl', 'rb')
	good_topic_keywords = pickle.load(good_topic_keywords_file)
	good_topic_keywords_file.close()

	good_document_topic_file = open('pickle/good_document_topic.pkl', 'rb')
	good_document_topic = pickle.load(good_document_topic_file)
	good_document_topic_file.close()

	good_topic_distribution_file = open('pickle/good_topic_distribution.pkl', 'rb')
	good_topic_distribution = pickle.load(good_topic_distribution_file)
	good_topic_distribution_file.close()

	bad_topic_keywords_file = open('pickle/bad_topic_keywords.pkl', 'rb')
	bad_topic_keywords = pickle.load(bad_topic_keywords_file)
	bad_topic_keywords_file.close()

	bad_document_topic_file = open('pickle/bad_document_topic.pkl', 'rb')
	bad_document_topic = pickle.load(bad_document_topic_file)
	bad_document_topic_file.close()

	bad_topic_distribution_file = open('pickle/bad_topic_distribution.pkl', 'rb')
	bad_topic_distribution = pickle.load(bad_topic_distribution_file)
	bad_topic_distribution_file.close()

	if not (loc == 'all'):
		restaurants = restaurants[restaurants['city']==loc]

	if not (cat == 'all'):
		category = restaurants['categories'].str.contains(cat, regex=False)
		category = category.fillna(False)
		restaurants = restaurants[category]

	indexes = restaurants.index.values
	docnames = ["Doc" + str(i) for i in indexes]

	sub_topic_distribution = generateSubtopic(docnames, all_document_topic, all_topic_keywords)
	sub_topic_distribution_good = generateSubtopic(docnames, good_document_topic, good_topic_keywords)
	sub_topic_distribution_bad = generateSubtopic(docnames, bad_document_topic, bad_topic_keywords)
	return render_template('compare.html',
		topic_dist=(sub_topic_distribution.to_json(orient='records')),
		topic_dist_good=(sub_topic_distribution_good.to_json(orient='records')),
		topic_dist_bad=(sub_topic_distribution_bad.to_json(orient='records'))
		)

def generateSubtopic(docnames, topics, keywords):
	sub_restaurants = copy.deepcopy(topics.reindex(docnames))
	sub_topic_distribution = sub_restaurants['dominant_topic'].value_counts().reset_index(name="Num Documents")
	sub_topic_distribution.columns = ['topic_num', 'freq']
	for i in range(10):
		if not (i in sub_topic_distribution['topic_num']):
			sub_topic_distribution = sub_topic_distribution.append({'topic_num': i, 'freq': 0}, ignore_index=True)

	sub_topic_distribution = sub_topic_distribution.sort_values(by=['topic_num'])
	sub_topic_distribution['topic'] = keywords['topic'].values
	sub_topic_distribution = sub_topic_distribution.sort_values(by=['freq'], ascending=False)
	return sub_topic_distribution

@app.route('/analysis/', methods=['GET'])
def analysis():
	return render_template('analysis.html', )

def genCity(city, cities):
	row = pd.DataFrame(columns=cities)
	row.loc[0] = [0]*len(cities)
	row.loc[:, city] = 1
	row = row.astype('int64')
	row = csr_matrix(row.values)
	return row

def genCat(cat):
	common_cats = ['Pizza', 'Mexican', 'Chinese', 'Italian', 'Vietnamese']
	row = pd.DataFrame(columns=common_cats)
	row.loc[0] = [0]*len(common_cats)
	row.loc[:, cat] = 1
	row = row.astype('int64')
	row = csr_matrix(row.values)
	return row

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
	city=request.form['city']
	category=request.form['category']

#encode city
	cities = []
	for t in enc.categories_:
		for c in t:
			cities.append(c)

	text_enc = genCity(city, cities)


#encode Category
	cat_row = genCat(category)

	text_tf = vectorizer.transform(text)

	#text_joined = hstack([text_tf, text_enc], format="csr")
	text_joined = hstack([text_tf, text_enc, cat_row], format="csr")
	score = p.predict(text_joined)
	return render_template('review.html', category=request.form['category'], text=request.form['text'], city=request.form['city'], score=score)

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
