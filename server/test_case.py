from case_builder import build_model
from case_compiler import compile_model
import pandas as pd
import numpy as np

import pymc3 as pm

df = pd.read_csv('data.csv', sep=';', index_col =[0])
case_name = r'C:\Users\Fran\Downloads\complex_r2.xml'
A, auk, edges, nodes = build_model(case_name)
model = compile_model(A, edges, df)

with model:
    start = pm.find_MAP()
print start