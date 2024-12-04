import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

# Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "UserFeedback.csv")
data = pd.read_csv(DATASET_PATH)

# Drop unnecessary columns
data = data.drop(columns=["user_id", "language", "platform", "gender"], axis=1)

# Convert categorical columns to numeric
data["Font_Size"] = data["Font_Size"].astype(int)
data["Alignment"] = data["Alignment"].astype("category").cat.codes
data["Color_Scheme"] = data["Color_Scheme"].astype("category").cat.codes

# Prepare features and labels
X = data.drop(columns=["Font_Size", "Font_Color", "Alignment", "Color_Scheme"])
y_font_size = data["Font_Size"]
y_font_color = data["Font_Color"]
y_alignment = data["Alignment"]
y_color_scheme = data["Color_Scheme"]

# Train and save models
def train_and_save_model(X, y, model_path):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    pickle.dump(model, open(model_path, 'wb'))
    print(f"Model saved to {model_path}")

train_and_save_model(X, y_font_size, os.path.join(BASE_DIR, "Font_Size_model.pkl"))
train_and_save_model(X, y_font_color, os.path.join(BASE_DIR, "Font_Color_model.pkl"))
train_and_save_model(X, y_alignment, os.path.join(BASE_DIR, "Alignment_model.pkl"))
train_and_save_model(X, y_color_scheme, os.path.join(BASE_DIR, "Color_Scheme_model.pkl"))
