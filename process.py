import sys 
from flask import Flask, request, render_template
import os
import pickle
import numpy as np
import pandas as pd


app = Flask(__name__)
this_dir = os.path.dirname(__file__)
with open('Model_Test.pkcls', 'rb') as model:
    lr = pickle.load(model)

tuoi = int(sys.argv[1])
cannang = int(sys.argv[2])
nhiptim = int(sys.argv[3])
spo2 = int(sys.argv[4])
hattruong = int(sys.argv[5])
hatthu = int(sys.argv[6])

tinhtrang = ''

data = [[tuoi, cannang, nhiptim, spo2, hattruong, hatthu]]
#print(data)
#data = [[50, 60, 90, 99, 80, 120]]
prediction = lr.predict(data)
#print(pd.Series(prediction))
array = pd.Series(prediction)[1]
print(array[0][1])
 
