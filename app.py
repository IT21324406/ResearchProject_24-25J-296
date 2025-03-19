from flask import Flask, request, jsonify, g
import joblib
import pandas as pd
import sqlite3
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the saved model and label encoders
model = joblib.load('vision_theme_recommendation_model.pkl')
label_encoders = joblib.load('label_encoders.pkl')

# Create a SQLite connection and database
DATABASE = 'EyeCareAI.db'

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = sqlite3.connect(DATABASE)
    return g.sqlite_db

# Function to create users table if it doesn't exist
def init_db():
    with app.app_context():
        with get_db() as db:
            db.execute('''CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT,
                            email TEXT UNIQUE,  -- Make email unique
                            Age TEXT,
                            Gender TEXT,
                            "Color Blind" INTEGER,
                            "Short-Sighted" INTEGER,
                            "Distance Vision" INTEGER,
                            "Near Vision" INTEGER,
                            "Color Discrimination" INTEGER,
                            Label INTEGER,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )''')
            
            db.execute('''
            CREATE TABLE IF NOT EXISTS model_details (
                Label INTEGER PRIMARY KEY,
                Condition TEXT,
                Screen_Zoom_Level INTEGER,  
                Color_Scheme TEXT,          
                Font_Size TEXT,             
                Live_Caption TEXT,          
                Live_Translate TEXT,        
                Theme_URL TEXT              
            )
        ''')
        db.commit()
        
# Insert model details with the updated schema
def insert_model_details():
    with app.app_context():
        model_details = [
            (0, 'No Condition', 100, 'Standard', 'Medium', 'No', 'No', None),
            (1, 'Mild Color Blindness', 100, 'Deuteranopia-Friendly', 'Medium', 'No', 'No', 
             'https://chromewebstore.google.com/detail/mild-color-blindness-them/kapoealjmdmmneodmcgbhinhcmogaolj'),
            (2, 'Severe Color Blindness', 100, 'High Contrast / Monochrome', 'Medium', 'No', 'No', 
             'https://chromewebstore.google.com/detail/severe-color-blindness-th/kfopbolajoeapkpoeoplfliibmaigmgg'),
            (3, 'Mild Short-Sightedness', 110, 'Standard', 'Large', 'No', 'No', 
             'https://chromewebstore.google.com/detail/mild-short-sightedness-th/ooaiamheinnodapldkcgigkhnenhajad'),
            (4, 'Moderate Short-Sightedness', 125, 'High Contrast', 'Large', 'No', 'No', 
             'https://chromewebstore.google.com/detail/moderate-short-sightednes/oplngcfnhjeaefkmmhobbbfcocohdmha'),
            (5, 'Severe Short-Sightedness', 150, 'High Contrast', 'Very Large', 'Yes', 'No', 
             'https://chromewebstore.google.com/detail/severe-short-sightedness/mmiehkbdfgpkbjonaefajoiodhfdkggn'),
            (6, 'Hybrid: Color Blind & Short-Sighted (Mild)', 125, 'Deuteranopia-Friendly', 'Large', 'No', 'No', 
             'https://chromewebstore.google.com/detail/hybrid-mild-color-blind-s/ifllmkbficlennefjibpajlmoibndcpj'),
            (7, 'Hybrid: Color Blind & Short-Sighted (Severe)', 150, 'High Contrast', 'Very Large', 'Yes', 'Yes', 
             'https://chromewebstore.google.com/detail/hybrid-severe-color-blind/bdkbajblaoodpignkpkikmgdjpkeadej'),
            (8, 'Aging Vision (Presbyopia)', 125, 'High Contrast', 'Large', 'No', 'No', 
             'https://chromewebstore.google.com/detail/aging-vision-theme/jknmnpjeghncojkdgpiaaeilnknplbjb'),
            (9, 'Distance Vision Impairment', 150, 'Standard', 'Large', 'No', 'No', 
             'https://chromewebstore.google.com/detail/distance-vision-impairmen/aombpfbjgakpfhmamapgjobmgbbjhmoc'),
            (10, 'Near Vision Impairment', 125, 'Standard', 'Large', 'No', 'No', 
             'https://chromewebstore.google.com/detail/near-vision-impairment-th/oibpdnfmmniojejglgeipjifmljmdlem'),
            (11, 'Total Vision Assistance', 175, 'High Contrast', 'Very Large', 'Yes', 'Yes', 
             'https://chromewebstore.google.com/detail/total-vision-assistance-t/poloijgdoeejpmbllhlkcfpfiddhebef')
        ]
        
        with get_db() as db:
            db.executemany('''INSERT OR REPLACE INTO model_details 
                              (Label, Condition, Screen_Zoom_Level, Color_Scheme, Font_Size, Live_Caption, Live_Translate, Theme_URL) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)''', model_details)
            db.commit()


# Initialize DB and insert model details
with app.app_context():
    init_db()
    insert_model_details()

# Endpoint for theme suggestion and saving user data
@app.route('/theme_suggestion_services', methods=['POST'])
def theme_suggestion():
    try:
        data = request.get_json()  # Receive JSON payload from the client

        # Prepare the data for prediction
        test_data = pd.DataFrame([{
            "Age": data['Age'],
            "Gender": data['Gender'],
            "Color Blind": data['Color Blind'],
            "Short-Sighted": data['Short-Sighted'],
            "Distance Vision": data['Distance Vision'],
            "Near Vision": data['Near Vision'],
            "Color Discrimination": data['Color Discrimination']
        }])

        # Encode categorical variables
        for col in ["Age", "Gender"]:
            le = label_encoders[col]
            test_data[col] = le.transform(test_data[col])

        # Normalize numerical features
        scaler = StandardScaler()
        test_data[["Distance Vision", "Near Vision"]] = scaler.fit_transform(test_data[["Distance Vision", "Near Vision"]])

        # Predict using the trained model
        prediction = model.predict(test_data)

        # Log the predicted label to debug
        #print(f"Predicted label: {prediction[0]}")

        # Get the theme condition and adjustments
        label = int(prediction[0])
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM model_details WHERE Label=?", (label,))
        theme_details = cursor.fetchone()
        # Check if theme details were found
        if theme_details is None:
            return jsonify({"error": "No theme details found for the predicted label"}), 500

        # Insert user data into the users table
        try:
            cursor.execute('''INSERT INTO users (name,email, Age, Gender, "Color Blind", "Short-Sighted", "Distance Vision", 
                                      "Near Vision", "Color Discrimination", Label, created_at) 
                              VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)''', 
                           (data['name'],data['email'], data['Age'], data['Gender'], data['Color Blind'], 
                            data['Short-Sighted'], data['Distance Vision'], 
                            data['Near Vision'], data['Color Discrimination'], label))
            conn.commit()
            print("User data inserted successfully.")
        except Exception as e:
            print(f"Error inserting user data: {e}")
            return jsonify({"error": "Failed to insert user data into database."}), 500

        # Fetch the latest user
        cursor.execute("SELECT * FROM users WHERE name=? ORDER BY created_at DESC LIMIT 1", (data['name'],))
        user_details = cursor.fetchone()

        # Prepare the response
        response = {
            'Theme Details':{
                'Label': label,
                'Condition': theme_details[1],
                'Theme Adjustments': theme_details[2]
            },
            'User Details':{
                'Name': user_details[1],
                'Email': user_details[2]
            }
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_user_data', methods=['POST'])
def get_user_data():
    try:
        data = request.get_json()  # Receive JSON payload from the client
        user_email = data['email']  # The email of the user to search for
        print("Received Email: " + user_email)
        # Query the database for the latest record with the user's email (case-insensitive)
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''SELECT * FROM users WHERE LOWER(email) = LOWER(?) ORDER BY created_at DESC LIMIT 1''', (user_email,))
        user_details = cursor.fetchone()

        if user_details is None:
            return jsonify({"error": "No user found with the specified email"}), 404

        # Fetch the theme details for the predicted label from the model_details table
        label = int(user_details[10])  # The label of the user
        cursor.execute("SELECT * FROM model_details WHERE Label=?", (label,))
        theme_details = cursor.fetchone()

        if theme_details is None:
            return jsonify({"error": "No theme details found for the user's label"}), 500

        # Prepare the response
        response = {
            'Theme Details': {
                'Label': label,
                'Condition': theme_details[1],
                'Screen Zoom Level': theme_details[2],
                'Color Scheme': theme_details[3],
                'Font Size': theme_details[4],
                'Live Caption': theme_details[5],
                'Live Translate': theme_details[6],
                'Theme_URL': theme_details[7]
            },
            'User Details': {
                'Name': user_details[1],
                'Email': user_details[2]
            }
        }


        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_user_email', methods=['GET'])
def get_user_emails():
    try:
        # Query the database for all distinct user emails
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM users')
        user_emails = cursor.fetchall()

        # If no user names are found, return an empty list
        if not user_emails:
            return jsonify({"message": "No users found."}), 404

        # Prepare the response
        response = {
            "User Emails": [user[0] for user in user_emails]  # Extracting the email from the tuple
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/delete_user/', methods=['POST'])
def delete_user():
    try:
        data = request.get_json()  # Receive JSON payload from the client
        user_email = data['email']  # The email of the user to delete
        
        # Query the database for the user with the specified email
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''SELECT * FROM users WHERE LOWER(email) = LOWER(?)''', (user_email,))
        user_details = cursor.fetchone()

        if user_details is None:
            return jsonify({"error": "No user found with the specified email"}), 404
        
        # Delete the user from the database
        cursor.execute('''DELETE FROM users WHERE LOWER(email) = LOWER(?)''', (user_email,))
        conn.commit()

        # Prepare the response
        response = {
            "message": f"User with email {user_email} has been deleted successfully."
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host=' 192.168.8.142', port=5000, debug=True)  # Unique port 5000
