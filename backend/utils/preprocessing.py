import numpy as np
import pandas as pd

def preprocess_input(inputs, prep_info, scaler_mean, scaler_scale, encoder_categories):
    print("Preprocessing")
    df = pd.DataFrame([inputs], columns=prep_info["feature_order"])

    num_data = df[prep_info["numerical_features"]]
    scaled_numerical = (num_data - scaler_mean) / scaler_scale

    cat_data = df[prep_info["categorical_features"]]
    encoded_categorical = np.zeros((1, sum(len(cats) - 1 for cats in encoder_categories)))

    col_index = 0
    for i, categories in enumerate(encoder_categories):
        cats_to_encode = categories[1:]
        val = cat_data.iloc[0, i]
        for cat in cats_to_encode:
            encoded_categorical[0, col_index] = 1 if val == cat else 0
            col_index += 1
    value=np.concatenate([scaled_numerical, encoded_categorical], axis=1)
    print(value)
    return value
