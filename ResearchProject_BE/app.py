# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
    
# # app = Flask(__name__)

# # # Enable CORS for all domains (adjust as needed for security)
# # CORS(app)

# # @app.route('/api/feedback', methods=['POST'])
# # def handle_feedback():
# #     feedback = request.get_json()

# #     # Process the feedback using predefined rules
# #     ui_changes = process_feedback(feedback)

# #     return jsonify({'success': True, 'feedback': ui_changes})

# # def process_feedback(feedback):
# #     # Apply rules based on user feedback
# #     ui_changes = {}

# #     # Font size rule
# #     if feedback['fontSize'] == '12sp':
# #         ui_changes['fontSize'] = '12px'
# #     elif feedback['fontSize'] == '14sp':
# #         ui_changes['fontSize'] = '14px'
# #     else:
# #         ui_changes['fontSize'] = '16px'

# #     # Font color rule
# #     if feedback['fontColor'] == 'red':
# #         ui_changes['fontColor'] = 'red'
# #     elif feedback['fontColor'] == 'blue':
# #         ui_changes['fontColor'] = 'blue'
# #     else:
# #         ui_changes['fontColor'] = 'black'

# #     # Alignment rule
# #     ui_changes['alignment'] = feedback['alignment']  # Just pass the value directly

# #     # Color scheme rule
# #     if feedback['colorScheme'] == 'dark':
# #         ui_changes['colorScheme'] = 'dark-mode'
# #     else:
# #         ui_changes['colorScheme'] = 'light-mode'

# #     return ui_changes

# # if __name__ == '__main__':
# #     app.run(debug=True)


# from flask import Flask, request, jsonify
# from sklearn.preprocessing import LabelEncoder
# from flask_cors import CORS
# import pickle
# import os

# app = Flask(__name__)
# CORS(app)

# # Load pre-trained models
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# FONT_SIZE_MODEL = os.path.join(BASE_DIR, "Font_Size_model.pkl")
# FONT_COLOR_MODEL = os.path.join(BASE_DIR, "Font_Color_model.pkl")
# ALIGNMENT_MODEL = os.path.join(BASE_DIR, "Alignment_model.pkl")
# COLOR_SCHEME_MODEL = os.path.join(BASE_DIR, "Color_Scheme_model.pkl")

# font_size_model = pickle.load(open(FONT_SIZE_MODEL, 'rb'))
# font_color_model = pickle.load(open(FONT_COLOR_MODEL, 'rb'))
# alignment_model = pickle.load(open(ALIGNMENT_MODEL, 'rb'))
# color_scheme_model = pickle.load(open(COLOR_SCHEME_MODEL, 'rb'))

# # @app.route('/api/feedback', methods=['POST'])
# # def handle_feedback():
# #     data = request.get_json()
# #     user_input = [[data['fontSize'], data['fontColor'], data['alignment'], data['colorScheme']]]

# #     # Predict user preferences based on the models
# #     predicted_font_size = font_size_model.predict(user_input)[0]
# #     predicted_font_color = font_color_model.predict(user_input)[0]
# #     predicted_alignment = alignment_model.predict(user_input)[0]
# #     predicted_color_scheme = color_scheme_model.predict(user_input)[0]

# #     ui_changes = {
# #         "fontSize": predicted_font_size,
# #         "fontColor": predicted_font_color,
# #         "alignment": predicted_alignment,
# #         "colorScheme": predicted_color_scheme
# #     }

# #     return jsonify({"success": True, "feedback": ui_changes})
# ##############################
# # @app.route('/api/feedback', methods=['POST'])
# # def handle_feedback():
# #     data = request.get_json()
# #     print("Received feedback:", data)  # Add this line to log the incoming data

# #     user_input = [[data['fontSize'], data['fontColor'], data['alignment'], data['colorScheme']]]
# #     print("User Input for Prediction:", user_input)  # Add this line to log the user input

# #     predicted_font_size = font_size_model.predict(user_input)[0]
# #     predicted_font_color = font_color_model.predict(user_input)[0]
# #     predicted_alignment = alignment_model.predict(user_input)[0]
# #     predicted_color_scheme = color_scheme_model.predict(user_input)[0]

# #     ui_changes = {
# #         "fontSize": predicted_font_size,
# #         "fontColor": predicted_font_color,
# #         "alignment": predicted_alignment,
# #         "colorScheme": predicted_color_scheme
# #     }

# #     print("Predicted UI Changes:", ui_changes)  # Add this line to log the predictions
# #     return jsonify({"success": True, "feedback": ui_changes})
# #########################
# # @app.route('/api/feedback', methods=['POST'])
# # def handle_feedback():
# #     # Retrieve the incoming JSON data
# #     data = request.get_json()
# #     print("Received feedback:", data)  # Log the incoming data for debugging
    
# #     # Convert '20px' to 20 for fontSize (remove 'px' and convert to int)
# #     try:
# #         data['fontSize'] = int(data['fontSize'].replace('px', ''))
# #     except ValueError:
# #         print("Error: Invalid fontSize value")
# #         return jsonify({"error": "Invalid fontSize value"}), 400  # Return error if conversion fails
    
# #     # Assuming that fontColor, alignment, and colorScheme are in the correct format (you may need to preprocess them)
# #     # Prepare the user input for the model
# #     user_input = [[data['fontSize'], data['fontColor'], data['alignment'], data['colorScheme']]]
    
# #     print("User Input for Prediction:", user_input)  # Log the formatted input
    
# #     # Proceed with prediction (this should match the feature types expected by your model)
# #     # For example: assuming the model is ready to predict
# #     try:
# #         predicted_font_size = font_size_model.predict(user_input)[0]
# #         predicted_font_color = font_color_model.predict(user_input)[0]
# #         predicted_alignment = alignment_model.predict(user_input)[0]
# #         predicted_color_scheme = color_scheme_model.predict(user_input)[0]
# #     except Exception as e:
# #         print("Error during prediction:", e)
# #         return jsonify({"error": "Error during prediction"}), 500  # Return error if prediction fails

# #     # Return the predicted UI changes
# #     ui_changes = {
# #         "fontSize": predicted_font_size,
# #         "fontColor": predicted_font_color,
# #         "alignment": predicted_alignment,
# #         "colorScheme": predicted_color_scheme
# #     }
    
# #     return jsonify({"success": True, "feedback": ui_changes})
# #########################

# @app.route('/api/feedback', methods=['POST'])
# def handle_feedback():
#     # Retrieve the incoming JSON data
#     data = request.get_json()
#     print("Received feedback:", data)  # Log the incoming data for debugging
    
#     # Convert '12px' to 12 for fontSize (remove 'px' and convert to int)
#     try:
#         data['fontSize'] = int(data['fontSize'].replace('px', ''))
#     except ValueError:
#         print("Error: Invalid fontSize value")
#         return jsonify({"error": "Invalid fontSize value"}), 400  # Return error if conversion fails
    
#     # Convert categorical values to numeric using LabelEncoder
#     color_encoder = LabelEncoder()
#     alignment_encoder = LabelEncoder()
#     color_scheme_encoder = LabelEncoder()
    
#     # Fit encoders with possible values (this should ideally be done beforehand)
#     color_encoder.fit(['red', 'blue', 'green', 'black', 'white'])
#     alignment_encoder.fit(['left', 'center', 'right', 'justify'])
#     color_scheme_encoder.fit(['dark', 'light'])
    
#     encoded_font_color = color_encoder.transform([data['fontColor']])[0]
#     encoded_alignment = alignment_encoder.transform([data['alignment']])[0]
#     encoded_color_scheme = color_scheme_encoder.transform([data['colorScheme']])[0]
    
#     missing_feature_value = 0 
#     # Prepare the user input for prediction
#     user_input = [[data['fontSize'], encoded_font_color, encoded_alignment, encoded_color_scheme, missing_feature_value]]
    
#     print("User Input for Prediction:", user_input)  # Log the formatted input
    
#     # Prediction (ensure your model supports this format)
#     try:
#         predicted_font_size = font_size_model.predict(user_input)[0]
#         predicted_font_color = font_color_model.predict(user_input)[0]
#         predicted_alignment = alignment_model.predict(user_input)[0]
#         predicted_color_scheme = color_scheme_model.predict(user_input)[0]
#     except Exception as e:
#         print("Error during prediction:", e)
#         return jsonify({"error": "Error during prediction"}), 500  # Return error if prediction fails

#     # Return the predicted UI changes
#     ui_changes = {
#         "fontSize": predicted_font_size,
#         "fontColor": predicted_font_color,
#         "alignment": predicted_alignment,
#         "colorScheme": predicted_color_scheme
#     }
    
#     return jsonify({"success": True, "feedback": ui_changes})


# if __name__ == '__main__':
#    app.run(debug=True, host='127.0.0.1', port=8000)

from flask import Flask, request, jsonify
from sklearn.preprocessing import LabelEncoder
from flask_cors import CORS
import pickle
import os
import numpy as np

app = Flask(__name__)
CORS(app)

# Load pre-trained models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_SIZE_MODEL = os.path.join(BASE_DIR, "Font_Size_model.pkl")
FONT_COLOR_MODEL = os.path.join(BASE_DIR, "Font_Color_model.pkl")
ALIGNMENT_MODEL = os.path.join(BASE_DIR, "Alignment_model.pkl")
COLOR_SCHEME_MODEL = os.path.join(BASE_DIR, "Color_Scheme_model.pkl")

font_size_model = pickle.load(open(FONT_SIZE_MODEL, 'rb'))
font_color_model = pickle.load(open(FONT_COLOR_MODEL, 'rb'))
alignment_model = pickle.load(open(ALIGNMENT_MODEL, 'rb'))
color_scheme_model = pickle.load(open(COLOR_SCHEME_MODEL, 'rb'))

# Pre-define LabelEncoders with all known values to avoid unseen labels
color_encoder = LabelEncoder()
color_encoder.fit(['red', 'blue', 'green', 'black', 'white', 'purple'])  # Add all expected values here
alignment_encoder = LabelEncoder()
alignment_encoder.fit(['left', 'center', 'right', 'justify'])
color_scheme_encoder = LabelEncoder()
color_scheme_encoder.fit(['dark', 'light'])

@app.route('/api/feedback', methods=['POST'])
def handle_feedback():
    # Retrieve the incoming JSON data
    data = request.get_json()
    print("Received feedback:", data)  # Log the incoming data for debugging
    
    # Convert '12px' to 12 for fontSize (remove 'px' and convert to int)
    try:
        data['fontSize'] = int(data['fontSize'].replace('px', ''))
    except ValueError:
        print("Error: Invalid fontSize value")
        return jsonify({"error": "Invalid fontSize value"}), 400  # Return error if conversion fails
    
    # Convert categorical values to numeric using LabelEncoder
    try:
        encoded_font_color = color_encoder.transform([data['fontColor']])[0]
    except ValueError:
        print(f"Error: Unseen fontColor value: {data['fontColor']}")
        return jsonify({"error": "Unseen fontColor value"}), 400  # Return error if unseen value is encountered

    try:
        encoded_alignment = alignment_encoder.transform([data['alignment']])[0]
    except ValueError:
        print(f"Error: Unseen alignment value: {data['alignment']}")
        return jsonify({"error": "Unseen alignment value"}), 400  # Return error if unseen value is encountered

    try:
        encoded_color_scheme = color_scheme_encoder.transform([data['colorScheme']])[0]
    except ValueError:
        print(f"Error: Unseen colorScheme value: {data['colorScheme']}")
        return jsonify({"error": "Unseen colorScheme value"}), 400  # Return error if unseen value is encountered
    
    missing_feature_value = 0  # Example placeholder for an additional feature if needed
    
    # Prepare the user input for prediction
    user_input = [[data['fontSize'], encoded_font_color, encoded_alignment, encoded_color_scheme, missing_feature_value]]
    
    print("User Input for Prediction:", user_input)  # Log the formatted input
    
    # Prediction (ensure your model supports this format)
    try:
        predicted_font_size = font_size_model.predict(user_input)[0]
        predicted_font_color = font_color_model.predict(user_input)[0]
        predicted_alignment = alignment_model.predict(user_input)[0]
        predicted_color_scheme = color_scheme_model.predict(user_input)[0]
    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": "Error during prediction"}), 500  # Return error if prediction fails

    # Return the predicted UI changes
    ui_changes = {
        "fontSize": predicted_font_size,
        "fontColor": predicted_font_color,
        "alignment": predicted_alignment,
        "colorScheme": predicted_color_scheme
    }
    
    def convert_np_types(obj):
        if isinstance(obj, np.generic):
            return obj.item()  # This converts numpy types to native Python types
        elif isinstance(obj, dict):
            return {key: convert_np_types(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [convert_np_types(item) for item in obj]
        return obj

    # Apply conversion to the ui_changes or feedback data
    ui_changes_converted = convert_np_types(ui_changes)

    return jsonify({"success": True, "feedback": ui_changes_converted})

if __name__ == '__main__':
   app.run(debug=True, host='127.0.0.1', port=8000)
