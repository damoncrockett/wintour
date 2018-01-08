import warnings
warnings.filterwarnings('ignore') # pending solution to hdf issue
warnings.simplefilter("ignore", DeprecationWarning)
import pandas as pd
pd.options.mode.chained_assignment = None # shut off SettingWithCopyWarning

import visualime
import numpy as np

model_id = 170728
selected_model = visualime.dataframe_from_model_id(model_id)

MATRIX_DIR = '/mnt/data/public_safety/charlotte_eis/triage/matrix_correct_month_1y/'
train_matrix,train_labels = visualime.train_matrix_from_dataframe(selected_model,MATRIX_DIR)
fitted_model = visualime.clone_model(selected_model,train_matrix,train_labels)

possible_test_matrices = visualime.show_test_matrices(selected_model)
test_matrix_uuid = '59da3d6dc63e035ef0f65c1413451f5a' # from above listing
test_matrix_and_labels,test_matrix = visualime.test_matrix_from_uuid(test_matrix_uuid,possible_test_matrices,MATRIX_DIR)

tree_preds_all = []
counter=-1
for estimator in fitted_model.estimators_:
    counter+=1
    tree_preds = [estimator.predict_proba(test_matrix.loc[i].as_matrix().reshape(1,-1))[0][0] for i in test_matrix.index]
    tree_preds_all.append(tree_preds)
    print(counter)

df = pd.DataFrame()
n = len(tree_preds_all)
for i in range(n):
    df[i] = tree_preds_all[i]

df.to_csv("/mnt/data/public_safety/charlotte_eis/dcrockett/indiv_tree_pred.csv",index=False)