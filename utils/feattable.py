import warnings
warnings.filterwarnings('ignore')

import pandas as pd
import json

from os.path import expanduser
HOME = expanduser("~") + "/"

DATADIR = HOME + "wintour/utils/data/"
FEATTABLE = DATADIR + "193398_feattable.csv"

ft = pd.read_csv(FEATTABLE)
ft.sort_values(by="feature_importance",ascending=False,inplace=True)

def row2jso(ft,i):
    row = ft.loc[i]
    jso = {}
    jso['feature'] = row.feature
    jso['imp'] = row.feature_importance
    jso['rType'] = row.record_type
    jso['numAgg'] = row.num_agg
    jso['tempAgg'] = row.temp_agg
    jso['featVal'] = row.feat_val
    jso['featVar'] = row.feat_var

    return jso

jsonArray = [row2jso(ft,i) for i in ft.index]

JSONDIR = HOME + "wintour/src/assets/json/"
with open(JSONDIR+"feattable.json",'w') as outfile:
    json.dump(jsonArray,outfile)
