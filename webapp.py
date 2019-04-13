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

import nltk
from nltk.stem.snowball import EnglishStemmer
import string


import os

app = Flask(__name__)
default_cityList = ["Charlotte","Las Vegas","Madison","Phoenix","Pittsburgh"]

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

	## add pittsurgh, cleveland, madison

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

	city = "pittsburgh"

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
	score_pitt = p.predict(text_joined)

	city = "madison"

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
	score_mad = p.predict(text_joined)

	scores = {'city': ['Phoenix', 'Las Vegas', 'Charlotte', 'Pittsburgh', 'Madison'], 'score': [score_phoenix[0], score_lv[0], score_cha[0], score_pitt[0], score_mad[0]]}
	#phoenix
	#t.loc[t['id'] == '04', ['rate']] = score_phoenix
	#scores['Phoenix'] = score_phoenix

	#las vegas
	#t.loc[t['id'] == '32', ['rate']] = score_lv
	#scores['Las Vegas'] = score_lv

	#charlotte
	#t.loc[t['id'] == '37', ['rate']] = score_cha
	#scores['Charlotte'] = score_cha

	#pittsburgh
	#t.loc[t['id'] == '42', ['rate']] = score_pitt
	#scores['Pittsburgh'] = score_pitt

	#madison
	#t.loc[t['id'] == '55', ['rate']] = score_mad
	#scores['Madison'] = score_mad
	t = pd.DataFrame.from_dict(scores)

	t.to_csv("static/data/states.csv", sep=',')
	return render_template('category.html', category=request.form['category'])


@app.route('/compare/', methods=['GET'])
def compare():
	restaurants_file = open('pickle/restaurants_min.pkl', 'rb')
	restaurants_min = pickle.load(restaurants_file)
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

	categories = ['','Pizza', "Mexican", "Chinese", "Italian", "Vietnamese"]
	city_list = request.args.getlist('city_list')
	cat = request.args.get('category')
	if (city_list is None):
		city_list = ["Charlotte","Las Vegas","Madison","Phoenix","Pittsburgh"]
	topic_distribution_cols = ['city']
	tmpList_topic_distribution_cols = all_topic_keywords['topic'].tolist()
	tmpList_topic_distribution_cols.sort()
	topic_distribution_cols = topic_distribution_cols + tmpList_topic_distribution_cols
	topic_distribution = pd.DataFrame(columns=topic_distribution_cols)

	topic_distribution_good_cols = ['city']
	tmpList_topic_distribution_good_cols = good_topic_keywords['topic'].tolist()
	tmpList_topic_distribution_good_cols.sort()
	topic_distribution_good_cols = topic_distribution_good_cols + tmpList_topic_distribution_good_cols
	topic_distribution_good = pd.DataFrame(columns=topic_distribution_good_cols)

	topic_distribution_bad_cols = ['city']
	tmpList_topic_distribution_bad_cols = bad_topic_keywords['topic'].tolist()
	tmpList_topic_distribution_bad_cols.sort()
	topic_distribution_bad_cols = topic_distribution_bad_cols + tmpList_topic_distribution_bad_cols
	topic_distribution_bad = pd.DataFrame(columns=topic_distribution_bad_cols)

	i = 0
	for city in city_list:
		restaurants = copy.deepcopy(restaurants_min)
		restaurants = restaurants[restaurants['city']==city]

		if (cat and cat != ''):
			category = restaurants['categories'].str.contains(cat, regex=False)
			category = category.fillna(False)
			restaurants = restaurants[category]
		indexes = restaurants.index.values
		docnames = ["Doc" + str(i) for i in indexes]

		city_topic_distribution = generateSubtopic(docnames, all_document_topic, all_topic_keywords, city)
		city_topic_distribution_good = generateSubtopic(docnames, good_document_topic, good_topic_keywords, city)
		city_topic_distribution_bad = generateSubtopic(docnames, bad_document_topic, bad_topic_keywords, city)
		topic_distribution.loc[i] = city_topic_distribution
		topic_distribution_good.loc[i] = city_topic_distribution_good
		topic_distribution_bad.loc[i] = city_topic_distribution_bad
		i = i + 1

	topic_distribution = reformat(topic_distribution)
	topic_distribution_good = reformat(topic_distribution_good)
	topic_distribution_bad = reformat(topic_distribution_bad)
	return render_template('compare.html',
	 topic_dist=(topic_distribution.to_json(orient='records')),
	  topic_dist_good=(topic_distribution_good.to_json(orient='records')),
	   topic_dist_bad=(topic_distribution_bad.to_json(orient='records')),
	   categories=categories, 
	   category = cat,
	   cities=city_list,
	   default_cities=default_cityList)	

def generateSubtopic(docnames, topics, keywords, city):
	sub_restaurants = copy.deepcopy(topics.reindex(docnames))
	sub_topic_distribution = sub_restaurants['dominant_topic'].value_counts().reset_index(name="Num Documents")
	sub_topic_distribution.columns = ['topic_num', 'freq']
	for i in range(10):
		if not (i in sub_topic_distribution['topic_num']):
			sub_topic_distribution = sub_topic_distribution.append({'topic_num': i, 'freq': 0}, ignore_index=True)

	sub_topic_distribution = sub_topic_distribution.sort_values(by=['topic_num'])
	sub_topic_distribution['topic'] = keywords['topic'].values
	sub_topic_distribution = sub_topic_distribution.sort_values(by=['topic'])
	sub_topic_distribution_record = [city]
	tmpList = sub_topic_distribution['freq'].tolist()
	sub_topic_distribution_record = sub_topic_distribution_record + tmpList
	return sub_topic_distribution_record

def reformat(dataframe):
	tmpcols = ['topic']
	city_list = dataframe['city'].tolist()
	tmpcols = tmpcols + city_list
	dataframe_t = dataframe.iloc[:,1:].T
	dataframe_t = dataframe_t.reset_index()
	dataframe_t.columns = tmpcols
	return dataframe_t

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
	enc_file.close()

	vec_file = open('vec.pkl', 'rb')
	vectorizer = pickle.load(vec_file)
	vec_file.close()

	pkl_file = open('model.pkl', 'rb')
	p = pickle.load(pkl_file)
	pkl_file.close()

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

	lda_model_all_data = open("pickle/lda_model_all.pkl","rb")
	lda_model_all = pickle.load(lda_model_all_data)
	lda_model_all_data.close()

	all_topic_keywords_file = open('pickle/all_topic_keywords.pkl', 'rb')
	all_topic_keywords = pickle.load(all_topic_keywords_file)
	all_topic_keywords_file.close()

	count_vectorizer_data = open("pickle/count_vectorizer.pkl",'rb')
	count_vectorizer = pickle.load(count_vectorizer_data)
	count_vectorizer_data.close()

	processed_text = text_process(text)
	processed_text = tokenize(processed_text)
	text_count = count_vectorizer.transform([processed_text])
	text_count_features = count_vectorizer.get_feature_names()
	text_count_df = pd.SparseDataFrame(text_count)
	text_count_df.columns = text_count_features
	text_count_df.fillna(0.0, inplace=True)
	lda_output = lda_model_all.transform(text_count_df)
	topicnames = ["Topic" + str(i) for i in range(lda_model_all.n_components)]
	df_document_topic = pd.DataFrame(np.round(lda_output, 2), columns=topicnames)
	dominant_topic = np.argmax(df_document_topic.values, axis=1)
	predict_topic = all_topic_keywords.loc['Topic ' + str(dominant_topic[0])].topic

	return render_template('review.html', category=request.form['category'], text=request.form['text'], city=request.form['city'], score=score, predict_topic=predict_topic)

def text_process(text):
    """
    Modified from
    http://adataanalyst.com/scikit-learn/countvectorizer-sklearn-example/
    Takes in a string of text, then performs the following:
    1. Remove all punctuation, and digits
    2. Remove all stopwords
    3. Returns a list of the cleaned text
    """
    stemmer = EnglishStemmer()

    # Check characters to see if they are in punctuation
    clean = [char for char in text if (char not in string.punctuation)
            and (not char.isdigit())]

    clean = ''.join(clean)
    tokens = clean.split()
    tokens = [stemmer.stem(c) for c in tokens]
    # Join the characters again to form the string.

    tokens = ' '.join(tokens)

    # Now just remove any stopwords
    return tokens
#https://www.w3schools.com/python/ref_string_join.asp
def tokenize(string):
    d = []
    tokens = nltk.word_tokenize(string)
    tags = nltk.pos_tag(tokens)
    for x in tags:
        if x[1] == "NN" or x[1] == "NNS" or x[1] == "NNP" or x[1] == "NNPS":
            d.append(x[0])
    d = " ".join(d)
    return d

if __name__ == '__main__':
	app.debug = True
	app.run()
