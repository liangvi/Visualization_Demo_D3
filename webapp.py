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

import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
	#https://www.w3schools.com/python/python_file_remove.asp
	if(os.path.exists("static/data/states.csv")):
		os.remove("static/data/states.csv")
		print("Deleted")


	return render_template('index.html')

#def index(cat):
#@app.route('/<cat>', methods=['GET'])
@app.route('/category/', methods=['GET', 'POST'])
def category():

	### Good/bad breakdown for given categories

	common_cats = ['Pizza', 'Mexican', 'Chinese', 'Italian', 'Vietnamese']

	#Pizza
	temp = joined['categories'].str.contains('Pizza', regex=False)
	temp = temp.fillna(False)
	pizza = joined[temp]
	pizza.loc[pizza['stars_r'] > 3, 'review_type'] = "good"
	pizza.loc[pizza['stars_r'] <= 3, 'review_type'] = "bad"
	p_types = pizza['review_type'].value_counts()

	#Mexican
	temp = joined['categories'].str.contains('Mexican', regex=False)
	temp = temp.fillna(False)
	mexican = joined[temp]
	mexican.loc[mexican['stars_r'] > 3, 'review_type'] = "good"
	mexican.loc[mexican['stars_r'] <= 3, 'review_type'] = "bad"
	m_types = mexican['review_type'].value_counts()

	#Chinese
	temp = joined['categories'].str.contains('Chinese', regex=False)
	temp = temp.fillna(False)
	chinese = joined[temp]
	chinese.loc[chinese['stars_r'] > 3, 'review_type'] = "good"
	chinese.loc[chinese['stars_r'] <= 3, 'review_type'] = "bad"
	c_types = chinese['review_type'].value_counts()

	#Italian
	temp = joined['categories'].str.contains('Italian', regex=False)
	temp = temp.fillna(False)
	italian = joined[temp]
	italian.loc[italian['stars_r'] > 3, 'review_type'] = "good"
	italian.loc[italian['stars_r'] <= 3, 'review_type'] = "bad"
	i_types = italian['review_type'].value_counts()

	#Vietnamese
	temp = joined['categories'].str.contains('Vietnamese', regex=False)
	temp = temp.fillna(False)
	vietnamese = joined[temp]
	vietnamese.loc[vietnamese['stars_r'] > 3, 'review_type'] = "good"
	vietnamese.loc[vietnamese['stars_r'] <= 3, 'review_type'] = "bad"
	v_types = vietnamese['review_type'].value_counts()

	#Build dataframe
	d = {'bad': [p_types[1], m_types[1], c_types[1], i_types[1], v_types[1]], 'good': [p_types[0], m_types[0], c_types[0], i_types[0], v_types[0]]}
	review_types = pd.DataFrame(data=d, index=['Pizza', 'Mexican', 'Chinese', 'Italian', 'Vietnamese'])
	review_types.to_csv("static/data/review_types.csv", sep=',')






	### Building choropleth

	enc_file = open('enc.pkl', 'rb')
	enc = pickle.load(enc_file)

	vec_file = open('vec.pkl', 'rb')
	vectorizer = pickle.load(vec_file)

	pkl_file = open('model.pkl', 'rb')
	p = pickle.load(pkl_file)
	category=request.form['category']
	text = ["this is a good review"]

	city = "phoenix"

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

	city = "las vegas"

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

	city = "charlotte"

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
	score_cha = p.predict(text_joined)

	t = pd.read_csv("static/data/states_in.csv", dtype= {'id': str})
	if(os.path.exists("static/data/states.csv")):
		os.remove("static/data/states.csv")
		print("Deleted_compare")


	#phoenix
	t.loc[t['id'] == '04', ['rate']] = score_phoenix

	#las vegas
	t.loc[t['id'] == '32', ['rate']] = score_lv

	#charlotte
	t.loc[t['id'] == '37', ['rate']] = score_cha
	print(category)
	print(score_phoenix)
	print(score_lv)
	print(score_cha)

	t.to_csv("static/data/states.csv", sep=',')
	return render_template('category.html', category=request.form['category'])


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
	return render_template('analysis.html')

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
