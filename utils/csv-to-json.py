
# coding: utf-8

# In[5]:


import pandas as pd
import json


# In[2]:


DATADIR = "/Users/damoncrockett/wintour/src/assets/data/"
CSVDIR = DATADIR + "csv/"
JSONDIR = DATADIR + "json/"


# In[3]:


df = pd.read_csv(CSVDIR+"data.csv")


# In[13]:


def row2jso(i):
    row = df.loc[i]
    jso = {}
    jso['id'] = str(int(row.officer_id))
    jso['x'] = str(int(row.xbin))
    jso['y'] = str(int(row.ypos))
    jso['score'] = row.score
    return jso


# In[16]:


jsonArray = []
for i in df.index:
    jso = row2jso(i)
    jsonArray.append(jso)


# In[18]:


with open(JSONDIR+"data.json",'w') as outfile:
    json.dump(jsonArray,outfile)

