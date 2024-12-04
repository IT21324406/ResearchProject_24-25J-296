# # train_model.py

# import numpy as np
# import pickle
# from sklearn.linear_model import LogisticRegression

# # Create some dummy training data
# # Let's say we have two features: user interactions (for simplicity, random values)
# X_train = np.random.rand(100, 2)  # 100 samples, 2 features

# # Labels: let's say we predict font sizes ('16', '18', '20') based on user interactions
# y_train = np.random.choice(['16', '18', '20'], size=100)  # Randomly assigned font sizes

# # Create a Logistic Regression model
# model = LogisticRegression()

# # Train the model
# model.fit(X_train, y_train)

# # Save the model to a file using pickle
# with open('model/model.pkl', 'wb') as f:
#     pickle.dump(model, f)

# print("Model saved as model/model.pkl")
