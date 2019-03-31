import datetime

import pandas as pd
from sklearn import linear_model
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import Ridge
from sklearn.linear_model import Lasso
from sklearn.linear_model import ElasticNet

from sklearn.metrics import accuracy_score
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score

from scipy.sparse import csr_matrix, hstack, coo_matrix

import string
from sklearn.feature_extraction import stop_words
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import DictVectorizer

from nltk.stem.snowball import EnglishStemmer
import nltk

import pickle

from sklearn.decomposition import LatentDirichletAllocation

business = pd.read_json('yelp_dataset/business.json', lines=True)

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


#https://github.com/pandas-dev/pandas/issues/18152

max_records = 1e5
df = pd.read_json('yelp_dataset/review.json', lines=True, chunksize=max_records)
reviews = pd.DataFrame() # Initialize the dataframe
try:
   for df_chunk in df:
       reviews = pd.concat([reviews, df_chunk])
except ValueError:
       print ('\nSome messages in the file cannot be parsed')

joined = reviews.join(business, lsuffix='_r', rsuffix='_b', how="inner")

temp = joined['categories'].str.contains('Restaurants', regex=False)
temp = temp.fillna(False)
joined = joined[temp]


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

#train/test split
temp = joined[['text', 'city']]
X_train, X_test, y_train, y_test = train_test_split(temp, joined['stars_r'], test_size=0.2, random_state=42)

#tf-idf
corpus = X_train['text']
vectorizer = TfidfVectorizer(min_df = 0.01)

vectorizer.fit(corpus)
tf_train = vectorizer.transform(corpus)

test_corpus = X_test['text']
tf_test = vectorizer.transform(test_corpus)

#one-hot encoding

X_train['city'] = X_train['city'].str.lower()
X_test['city'] = X_test['city'].str.lower()

enc = OneHotEncoder(handle_unknown='ignore')
enc.fit(X_train['city'].reshape(-1,1))

X_trainC = enc.transform(X_train['city'].reshape(-1,1))
X_testC = enc.transform(X_test['city'].reshape(-1,1))

#join results
X_trainJ = hstack([tf_train, X_trainC], format="csr")
X_testJ = hstack([tf_test, X_testC], format="csr")

#predict outputs
en_final = ElasticNet(alpha=0.0001)
en_final.fit(X_trainJ, y_train)

y_pred = en_final.predict(X_testJ)
r2_score(y_test, y_pred)

def predict(text):

    text_tf = vectorizer.transform(text)

    #text_lower = text.str.lower()
    text_lower = text[0].lower()

    #text_enc = enc.transform(text_lower.reshape(-1,1))
    text_enc = enc.transform([[text_lower]])

    text_joined = hstack([text_tf, text_enc], format="csr")
    return en_final.predict(text_joined)

print(predict(["this is a review"]))
print(predict(["This is a great restaurant!"]))
print(predict(["This is a bad restaurant!"]))
