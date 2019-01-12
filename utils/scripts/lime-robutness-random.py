import warnings
warnings.filterwarnings('ignore') # pending solution to hdf issue
import pandas as pd
pd.options.mode.chained_assignment = None # shut off SettingWithCopyWarning

import lime.lime_tabular
import visualime
import numpy as np

model_id = 32092
selected_model = visualime.dataframe_from_model_id(model_id)
train_matrix,train_labels = visualime.train_matrix_from_dataframe(selected_model)
possible_test_matrices = visualime.show_test_matrices(selected_model)
test_matrix_uuid = '725897ad93c2ce1b7e7628d2964142cf' # from above listing
test_matrix_and_labels,test_matrix = visualime.test_matrix_from_uuid(test_matrix_uuid,possible_test_matrices)
fitted_model = visualime.clone_model(selected_model,train_matrix,train_labels)

explainer = lime.lime_tabular.LimeTabularExplainer(train_matrix.as_matrix(), 
                                                   feature_names=list(train_matrix), 
                                                   discretize_continuous=False)

"""Nullify large tables"""
train_matrix = None
train_labels = None
test_matrix_and_labels = None

nums_features = [2,5,7,11,13,17]
nums_samples = [50,100,500,1000,3000,5000,7000]
num_officers = 53 # based on how much time I have for this script; each officer takes ~45 min

n = num_officers * len(nums_features) * len(nums_samples)

results = pd.DataFrame(columns=['id','nsmp','nft','nunq','unq'],index=range(n))

counter = -1
officer_set = list(np.random.choice(test_matrix.index,num_officers))
for officer_id in officer_set:
    for num_samples in nums_samples:    
        for num_features in nums_features:
    
            counter+=1
            feats = []
            for j in range(10):
                explainer_i = explainer.explain_instance(test_matrix.loc[officer_id].as_matrix(),
                                                         fitted_model.predict_proba,
                                                         num_features=num_features,
                                                         top_labels=1,
                                                         num_samples=num_samples)
                
                try:
                    feats.append([item[0] for item in explainer_i.as_list(label=1)])
                except:
                	feats.append([item[0] for item in explainer_i.as_list(label=0)])
                
            all_feats = [item for sublist in feats for item in sublist]
            config_tup = (officer_id,num_samples,num_features,len(set(all_feats)),set(all_feats))
            results.loc[counter] = config_tup
            print(counter,officer_id,num_samples,num_features,len(set(all_feats)))

results.to_csv("lime-robustness.csv",index=False)