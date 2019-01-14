
# coding: utf-8

# In[106]:


import warnings
warnings.filterwarnings("ignore")


# In[107]:


import pandas as pd
import json
import sys


# In[108]:


featnum = int(sys.argv[1])


# In[109]:


DIR = "/Users/damoncrockett/wintour/utils/data/"
MATRIX = DIR + "193398_test_2014-04-01.csv"
FEATTABLE = DIR + "193398_feattable.csv"
IMP = DIR + "193398_individual_importances.csv"


# In[110]:


ft = pd.read_csv(FEATTABLE)
X = pd.read_csv(MATRIX)
imp = pd.read_csv(IMP)


# In[111]:


ft.sort_values(by="feature_importance",ascending=False,inplace=True)
feature = ft.feature.iloc[featnum]
print(feature)

# In[112]:


imp['impfeats'] = [[imp.risk_1.loc[i],
                    imp.risk_2.loc[i],
                    imp.risk_3.loc[i],
                    imp.risk_4.loc[i],
                    imp.risk_5.loc[i]] for i in imp.index]


# In[113]:


isimp = []
for i in imp.index:
    if feature in imp.impfeats.loc[i]:
        isimp.append(1)
    else:
        isimp.append(0)

imp['imp'] = isimp


# In[114]:


imp = imp[['entity_id','imp']]
imp.rename(columns={"entity_id":"officer_id"},inplace=True)
imp.set_index("officer_id",inplace=True)


# In[115]:


X = X[['officer_id','outcome','score',feature]]
X = X.join(imp,on="officer_id")


# In[116]:

#X['score'] = X.score.rank(pct=True)
X.score = X.score.round(2)
X[feature] = X[feature].round(2)


# In[117]:


X['xbin'] = pd.cut(X[feature],100,labels=False)
X.sort_values(by=['xbin','score'],ascending=[True,False],inplace=True)


# In[118]:


ypos = []
for xbin in range(X.xbin.max()+1):
    n = len(X[X.xbin==xbin])
    ypos.append(list(range(n)))
ypos = [item for sublist in ypos for item in sublist]
X['ypos'] = ypos


# In[119]:


DATADIR = "/Users/damoncrockett/wintour/src/assets/data/"
JSONDIR = DATADIR + "json/"


# In[120]:


X.head()


# In[121]:


def row2jso(i):
    row = X.loc[i]
    jso = {}
    jso['id'] = str(int(row.officer_id))
    jso['outcome'] = str(int(row.outcome))
    jso['score'] = row.score
    jso['imp'] = str(int(row.imp))
    jso['x'] = str(int(row.xbin))
    jso['y'] = str(int(row.ypos))
    return jso


# In[122]:


jsonArray = []
for i in X.index:
    jso = row2jso(i)
    jsonArray.append(jso)


# In[123]:

print("generating JSON file...",end="",flush=True)
with open(JSONDIR+"data.json",'w') as outfile:
    json.dump(jsonArray,outfile)
print("[DONE]")
