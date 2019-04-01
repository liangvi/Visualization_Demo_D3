import pickle


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

    text_lower = text[0].lower()

    text_enc = enc.transform([[text_lower]])

    text_joined = hstack([text_tf, text_enc], format="csr")
    return p.predict(text_joined)

print(pickle_predict(["this is a review"]))
print(pickle_predict(["This is a great restaurant!"]))
print(pickle_predict(["This is a bad restaurant!"]))
