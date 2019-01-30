import warnings
warnings.filterwarnings('ignore')

import pandas as pd
import json

from os.path import expanduser
HOME = expanduser("~") + "/"

DATADIR = HOME + "wintour/utils/data/"
MATRIX = DATADIR + "193398_test_2014-04-01.csv"
FEATTABLE = DATADIR + "193398_feattable.csv"
IMP = DATADIR + "193398_individual_importances.csv"

print("reading CSV data...",end="",flush=True)

ft = pd.read_csv(FEATTABLE)
X = pd.read_csv(MATRIX)
imp = pd.read_csv(IMP)

print("[DONE]")

ft.sort_values(by="feature_importance",ascending=False,inplace=True)
num_feats = len(ft)

def row2jso(X,i,feature):
    row = X.loc[i]
    jso = {}
    jso['id'] = str(int(row.officer_id))
    jso['outcome'] = str(int(row.outcome))
    jso['score'] = str(row.score)
    jso['imp'] = str(int(row.imp))
    jso['featVal'] = row[feature]

    return jso

def get_imp(feature,imp):
    print("generating JSON file...",end="",flush=True)

    imp['impfeats'] = [[imp.risk_1.loc[l],
                        imp.risk_2.loc[l],
                        imp.risk_3.loc[l],
                        imp.risk_4.loc[l],
                        imp.risk_5.loc[l]] for l in imp.index]

    isimp = []
    for k in imp.index:
        if feature in imp.impfeats.loc[k]:
            isimp.append(1)
        else:
            isimp.append(0)

    imp['imp'] = isimp

    imp = imp[['entity_id','imp']]
    imp.rename(columns={"entity_id":"officer_id"},inplace=True)
    imp.set_index("officer_id",inplace=True)

    return imp

def subset_X(X,feature):
    X = X[['officer_id','outcome','score',feature]]
    X['score'] = X.score.rank(pct=True)
    X.score = X.score.round(2)
    X[feature] = X[feature].round(2)

    return X

def create_table(ft,X,imp,featnum):

    feature = ft.feature.iloc[featnum]
    print(str(featnum),'of',str(num_feats),'\n',feature,'\n')

    imp = get_imp(feature,imp)
    X = subset_X(X,feature)
    X = X.join(imp,on="officer_id")

    jsonArray = []
    for i in X.index:
        jso = row2jso(X,i,feature)
        jsonArray.append(jso)

    JSONDIR = HOME + "wintour/src/assets/json/"
    with open(JSONDIR+str(featnum)+".json",'w') as outfile:
        json.dump(jsonArray,outfile)
    print("[DONE]")

for j in range(num_feats):
    create_table(ft,X,imp,num_feats)
