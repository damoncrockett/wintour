"""
Contains functions for visualizing a model's test set.
"""

import psycopg2
import pandas as pd
import json
import sklearn
import sklearn.ensemble
import sklearn.linear_model
import math
import numpy as np
import os
from PIL import Image,ImageDraw,ImageFont
import matplotlib.pyplot as plt

def dataframe_from_model_id(model_id):
    """Fetches results.models for model_id; outputs df"""
    
    with open("./database_credentials.json",'r') as f:
        credentials = json.load(f)   
    conn = psycopg2.connect(**credentials)
    
    """Could do this within pandas using d, of course, too"""
    df = pd.read_sql("SELECT * FROM results.models WHERE model_id="+str(model_id),
                       conn, 
                       coerce_float=True, 
                       params=None)
    conn.close()
    return df
    
def train_matrix_from_dataframe(df,DIR):
    """Takes a results.models dataframe, returns train matrix and labels.
    The while loop gets around a problem loading .h5 files using pandas' read_hdf. 
    Sometimes it raises a UnicodeDecodeError, but sometimes it doesn't."""
        
    train_matrix_uuid = df.train_matrix_uuid.iloc[0]
    
    """Check both matrix directories"""
    MATRIX_DIR = "/mnt/data/public_safety/charlotte_eis/triage/matrices/"
    if not os.path.isfile(MATRIX_DIR+train_matrix_uuid+".h5"):
        MATRIX_DIR = "/mnt/data/public_safety/charlotte_eis/matrices/"
        if not os.path.isfile(MATRIX_DIR+train_matrix_uuid+".h5"):
            MATRIX_DIR = DIR
            if not os.path.isfile(MATRIX_DIR+train_matrix_uuid+".h5"):
                raise OSError(".h5 file does not exist in matrix directory, triage, or supplied directory")
    
    train_matrix_and_labels = pd.read_hdf(MATRIX_DIR+train_matrix_uuid+".h5",mode="r")
   
    ncols_train = train_matrix_and_labels.shape[1]
    train_matrix = train_matrix_and_labels.iloc[:,:ncols_train-1] # removing label col
    train_labels = train_matrix_and_labels.iloc[:,ncols_train-1] # only label col
    del train_matrix['as_of_date'] # a hack sorta
    del train_matrix['officer_id'] # instead of resetting index to officer_id
    return train_matrix,train_labels
    
def clone_model(df,train_matrix,train_labels):
    """Takes a results.models dataframe and train matrix; returns
    a clone of trained model."""
    
    model_type = df.model_type.iloc[0]
    model_params = json.loads(df.model_parameters.iloc[0])
        
    function_dict = {
        'sklearn.ensemble.RandomForestClassifier':sklearn.ensemble.RandomForestClassifier,
        'sklearn.ensemble.ExtraTreesClassifier':sklearn.ensemble.ExtraTreesClassifier,
        'sklearn.ensemble.AdaBoostClassifier':sklearn.ensemble.AdaBoostClassifier,
        'sklearn.linear_model.LogisticRegression':sklearn.linear_model.LogisticRegression
    }
    
    model = function_dict[model_type](**model_params)
    model.fit(train_matrix,train_labels)
    return model

def show_test_matrices(df):
    """Finds all test matrices for selected model and displays them."""
                
    model_id = df.model_id.iloc[0]
    
    with open("./database_credentials.json",'r') as f:
        credentials = json.load(f)   
    conn = psycopg2.connect(**credentials)
    
    """Using results.predictions to find all possible test matrices"""
    df = pd.read_sql("SELECT * FROM results.predictions WHERE model_id="+str(model_id),
                       conn, 
                       coerce_float=True, 
                       params=None)
    conn.close()
    
    if len(df)==0:
        raise ValueError("dataframe is empty; model_id is not in results.predictions")
        
    possible_test_matrices = []
    for as_of_date in df.as_of_date.unique():
        uuid = df.matrix_uuid[df.as_of_date==as_of_date].iloc[0] # supposes only one id/date
        print(str(as_of_date)[:10],uuid) 
        possible_test_matrices.append(uuid)
    return possible_test_matrices
        
def test_matrix_from_uuid(test_matrix_uuid,possible_test_matrices,DIR):
    """Retrieves test matrix and labels as both single df and df without labels."""
    
    if test_matrix_uuid not in possible_test_matrices:
        raise ValueError("not a valid test matrix for this model")
    
    """Check both matrix directories"""
    MATRIX_DIR = "/mnt/data/public_safety/charlotte_eis/triage/matrices/"
    if not os.path.isfile(MATRIX_DIR+test_matrix_uuid+".h5"):
        MATRIX_DIR = "/mnt/data/public_safety/charlotte_eis/matrices/"
        if not os.path.isfile(MATRIX_DIR+test_matrix_uuid+".h5"):
            MATRIX_DIR = DIR
            if not os.path.isfile(MATRIX_DIR+test_matrix_uuid+".h5"):
                raise OSError(".h5 file does not exist in matrix directory, triage, or supplied directory")
    
    
    """tmp = 0
    while tmp==0:
        try:
            test_matrix_and_labels = pd.read_hdf(MATRIX_DIR+test_matrix_uuid+".h5",mode="r")
            tmp = 1
        except UnicodeDecodeError:
            pass
        except:
            raise"""

    test_matrix_and_labels = pd.read_hdf(MATRIX_DIR+test_matrix_uuid+".h5",mode="r")
    test_matrix_and_labels.set_index("officer_id",inplace=True)
    #test_matrix_and_labels.reset_index(drop=True,inplace=True) # idx from officer_id to arbitrary int
    
    """Separating features and labels"""  
    ncols_test = test_matrix_and_labels.shape[1]
    test_matrix = test_matrix_and_labels.iloc[:,:ncols_test-1] # removing label col
    del test_matrix['as_of_date'] # a hack sorta
    #test_labels = test_matrix_and_labels.iloc[:,ncols_test-1] # only label col
    
    return test_matrix_and_labels,test_matrix

def plot(n,toppct,model,test_matrix_and_labels,test_matrix):
    """Visualizes test set as flat, glyph histogram.
    Args:
        n: the number of test set datapoints to plot
        toppct: percentage of scores labeled '1'
        model: fitted model ( the output of clone_model() )
        test_matrix_and_labels: both as df
        test_matrix: alone as df
    Returns:
        displays a plot inline"""
        
    """Verifying that n is larger than toppct of numrows of test matrix"""
    cutoff = int(math.ceil( len(test_matrix_and_labels) * toppct ))
    if n <= cutoff:
        raise ValueError("n is too small")
        
    """Building a dataframe we'll use for plotting"""    
    test_matrix_and_labels["unit_score"] = [item[1] for item in model.predict_proba(test_matrix)]
    visdf = test_matrix_and_labels.sort_values(by="unit_score",ascending=False) #descending
    visdf = visdf.iloc[:n,:]
    
    # This bit creates the predicted labels based on score
    tmp = list(np.repeat(1,cutoff))
    tmp.extend(np.repeat(0,n-cutoff))
    
    visdf['pred'] = tmp
    #visdf['correct'] = visdf.pred==visdf.outcome
    
    """Create PIL canvas"""
    boxwidth = 32 # adjustable but not recommended
    gridheight = int(math.ceil( np.sqrt( n / 2 ) )) # ensuring 2:1 w:h 
    gridwidth = gridheight * 2
    px_w,px_h = gridwidth * boxwidth, gridheight * boxwidth
    canvas = Image.new('RGB',(px_w,px_h),"rgb(100,100,100)")
    
    """Assign plotting coords"""
    visdf['x'] = np.repeat(range(gridwidth-1,-1,-1),gridheight)[:n] # reversed range
    tmp = list(range(gridheight-1,-1,-1)) * gridwidth # reversed range
    visdf['y'] = tmp[:n]
    
    """Plot glyphs"""
    axis_labels = []
    for i in reversed(visdf.index): # reversed bc PIL causes slight overlap; advantageous to plot this order
        #if visdf.correct.loc[i]==1:
        if visdf.outcome.loc[i]==1:
            fillcolor = "hsl(354,63%,56%)" # red
            if visdf.pred.loc[i]==1:
                fillcolor = "hsl(354,63%,28%)" # darker red if model says '1'
        else:
            fillcolor = "hsl(211,52%,56%)" # blue
            if visdf.pred.loc[i]==1:
                fillcolor = "hsl(211,52%,28%)" # darker blue if model says '1'
  
        xcoord = visdf.x.loc[i] * boxwidth
        ycoord = visdf.y.loc[i] * boxwidth
    
        if visdf.y.loc[i] == max(visdf.y):
            axis_labels.append(str(visdf.unit_score.loc[i])[1:4])
        
        bbox = [
            xcoord,
            ycoord,
            xcoord + boxwidth,
            ycoord + boxwidth
        ]
    
        draw = ImageDraw.Draw(canvas)
        draw.rectangle(bbox,fill=fillcolor,outline=None)
        draw.text((xcoord - 1 + 4, ycoord - 1 + boxwidth/4),str(i),fill="white")
    
    """Add ticks and labels"""  
    axis_labels.reverse() # because we reversed the plotting order above
    plot_canvas_height = px_h + boxwidth*2
    plot_canvas = Image.new('RGB',(px_w,plot_canvas_height),"rgb(100,100,100)")
    plot_canvas.paste(canvas,(0,0)) #pasting old canvas onto larger

    tick_locs_x = [int( item * boxwidth + boxwidth / 2 ) for item in range(gridwidth-1,-1,-1)]
    tick_locs_x = tick_locs_x[:len(axis_labels)]

    draw = ImageDraw.Draw(plot_canvas)
    for i in range(len(tick_locs_x)):
        draw.line([
                (tick_locs_x[i], plot_canvas_height - boxwidth - boxwidth / 2),
                (tick_locs_x[i], plot_canvas_height - boxwidth * 2)
            ])
        draw.text(
            (tick_locs_x[i] - boxwidth / 4 - 2, plot_canvas_height - boxwidth - 10),
            axis_labels[i],
            fill="white"
        )
    
    """Show in notebook. Commented lines produce lower-res image. Better to just execute returned plot."""
    #fig, ax = plt.subplots(figsize=(20,10))
    #plt.imshow(np.asarray(plot_canvas))
    #plt.axis('off')
    return plot_canvas