import pickle
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

from sklearn.decomposition import LatentDirichletAllocation

#pickle
#https://scikit-learn.org/stable/modules/model_persistence.html
#p = pickle.loads(s)

pkl_file = open('model.pkl', 'rb')
p = pickle.load(pkl_file)

enc_file = open('enc.pkl', 'rb')
enc = pickle.load(enc_file)

vec_file = open('vec.pkl', 'rb')
vectorizer = pickle.load(vec_file)

def pickle_predict(text):

    text_tf = vectorizer.transform(text)

    #text_lower = text.str.lower()
    text_lower = text[0].lower()

    #text_enc = enc.transform(text_lower.reshape(-1,1))
    text_enc = enc.transform([[text_lower]])

    text_joined = hstack([text_tf, text_enc], format="csr")
    return p.predict(text_joined)

print(pickle_predict(["this is a review"]))
print(pickle_predict(["This is a great restaurant!"]))
print(pickle_predict(["This is a bad restaurant!"]))
