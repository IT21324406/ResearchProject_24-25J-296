# ###################
# # app.py
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from ai.q_learning import update_q_table, q_table, states, actions
# from ai.probabilistic_model import build_bayesian_network, make_prediction
# from ai.neural_network import predict_ui_adjustments

# app = Flask(__name__)
# CORS(app)

# # Example user interaction data
# interaction_data = []
# model = build_bayesian_network()  # Initialize the model once

# @app.route('/track', methods=['POST'])
# def track():
#     data = request.json
#     if not data or not isinstance(data, dict):
#         return jsonify({"error": "Invalid data format."}), 400
#     interaction_data.append(data)

#     # scroll_speed = float(data.get("scrollSpeed", 0))
#     # zoom_level = float(data.get("zoomLevel", 100))
#     # font_size = float(data["fontSize"].replace("px", "")) if "fontSize" in data else 16

#     scroll_speed = float(data.get("scrollSpeed", 0))
#     zoom_level = float(data.get("zoomLevel", 100))
#     inactivity_time = float(data.get("inactivityTime", 0))
#     is_user_active = data.get("isUserActive", True)

#     # # # Update Q-table with new state-action pair (for simplicity)
#     # # state = data.get('fontState', 'medium_font')  # Placeholder state
#     # # action = data.get('action', 'increase_font')  # Placeholder action
#     # state = "fast_scroll" if scroll_speed > 0.5 else "slow_scroll" 
#     # action = "increase_font" if scroll_speed > 0.5 else "decrease_font"
#     # reward = 1  # Assume reward for now
#     # # next_state = 'zoomed_in'  # Placeholder for next state
#     # next_state = "adjusted"
#     # update_q_table(q_table, state, action, reward, next_state)

#     # Adjust UI based on inactivity
#     state = "active_user" if is_user_active else "inactive_user"
#     action = "increase_font" if inactivity_time > 30 else "decrease_font"
#     reward = 1
#     next_state = "adjusted"
#     update_q_table(q_table, state, action, reward, next_state)

#     return jsonify({"message": "Data tracked successfully."})

# # @app.route('/preferences', methods=['GET'])
# # def get_preferences():
# #     if not interaction_data:
# #         return jsonify({"message": "No preferences available.", "preferences": None})

# #     # # For simplicity, using average font size and zoom level
# #     # scroll_speeds = [d['scrollSpeed'] for d in interaction_data if 'scrollSpeed' in d]
# #     # font_sizes = [float(d['fontSize'].replace('px', '')) for d in interaction_data if 'fontSize' in d]
# #     # zoom_levels = [d['zoomLevel'] for d in interaction_data if 'zoomLevel' in d]

# #     # Extract values safely
# #     scroll_speeds = [d.get('scrollSpeed', 0) for d in interaction_data if 'scrollSpeed' in d]
# #     zoom_levels = [d.get('zoomLevel', 100) for d in interaction_data if 'zoomLevel' in d]
# #     font_sizes = [float(d['fontSize'].replace('px', '')) for d in interaction_data if 'fontSize' in d]

# #     average_scroll_speed = sum(scroll_speeds) / len(scroll_speeds) if scroll_speeds else 0
# #     average_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 16
# #     average_zoom_level = sum(zoom_levels) / len(zoom_levels) if zoom_levels else 100

# #     # Use Bayesian Network model for prediction
# #     adjustment = make_prediction(model, average_zoom_level, average_font_size, average_scroll_speed)

# #     preferences = {
# #         "scroll_speed": average_scroll_speed,
# #         "font_size": average_font_size,
# #         "zoom_level": average_zoom_level,
# #         "adjustment": adjustment
# #     }

# #     # Optionally, use Neural Network for prediction
# #     nn_adjustment = predict_ui_adjustments([average_zoom_level, average_font_size])

# #     return jsonify({
# #         "message": "Preferences fetched successfully.",
# #         "preferences": preferences,
# #         "nn_adjustment": nn_adjustment.tolist()  # Convert tensor output to list
# #     })

# @app.route('/preferences', methods=['GET'])
# def get_preferences():
#     if not interaction_data:
#         return jsonify({"message": "No preferences available.", "preferences": None})

#     # Extract values safely and ensure they are numbers
#     # scroll_speeds = [float(d.get('scrollSpeed', 0)) for d in interaction_data if 'scrollSpeed' in d and isinstance(d.get('scrollSpeed'), (int, float, str))]
#     # zoom_levels = [float(d.get('zoomLevel', 100)) for d in interaction_data if 'zoomLevel' in d and isinstance(d.get('zoomLevel'), (int, float, str))]
#     # font_sizes = [float(d['fontSize'].replace('px', '')) for d in interaction_data if 'fontSize' in d and isinstance(d['fontSize'], str)]

#     # # Compute averages safely
#     # average_scroll_speed = sum(scroll_speeds) / len(scroll_speeds) if scroll_speeds else 0
#     # average_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 16
#     # average_zoom_level = sum(zoom_levels) / len(zoom_levels) if zoom_levels else 100


#  # Extract values safely
#     scroll_speeds = [float(d.get('scrollSpeed', 0)) for d in interaction_data if 'scrollSpeed' in d]
#     zoom_levels = [float(d.get('zoomLevel', 100)) for d in interaction_data if 'zoomLevel' in d]
#     inactivity_times = [float(d.get('inactivityTime', 0)) for d in interaction_data if 'inactivityTime' in d]
#     #font_sizes = [float(d.get('fontSize', 16)) for d in interaction_data if 'fontSize' in d]
#     font_sizes = [float(d.get('fontSize', 16)) for d in interaction_data if 'fontSize' in d]            


  
#     average_scroll_speed = sum(scroll_speeds) / len(scroll_speeds) if scroll_speeds else 0
#     average_zoom_level = sum(zoom_levels) / len(zoom_levels) if zoom_levels else 100
#     average_inactivity_time = sum(inactivity_times) / len(inactivity_times) if inactivity_times else 0
#     average_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 16
    
#     # Use Bayesian Network model for prediction
#     # adjustment = make_prediction(model, average_zoom_level, average_font_size, average_scroll_speed)

#     # preferences = {
#     #     "scroll_speed": average_scroll_speed,
#     #     "font_size": average_font_size,
#     #     "zoom_level": average_zoom_level,
#     #     "adjustment": adjustment
#     # }

#     # # Optionally, use Neural Network for prediction
#     # nn_adjustment = predict_ui_adjustments([average_zoom_level, average_font_size])

#     # return jsonify({
#     #     "message": "Preferences fetched successfully.",
#     #     "preferences": preferences,
#     #     "nn_adjustment": nn_adjustment.tolist()  # Convert tensor output to list
#     # })

#     # AI-powered UI adjustments
#     #adjustment = make_prediction(model, average_zoom_level, average_scroll_speed, average_inactivity_time)

#     adjustment = make_prediction(model, average_zoom_level, average_scroll_speed, average_inactivity_time, average_font_size)


#     preferences = {
#         "scroll_speed": average_scroll_speed,
#         "zoom_level": average_zoom_level,
#         "inactivity_time": average_inactivity_time,
#         "adjustment": adjustment
#     }

#     return jsonify({"message": "Preferences fetched successfully.", "preferences": preferences})

# if __name__ == '__main__':
#     app.run(debug=True) 


# @app.route('/apply-preferences', methods=['POST'])
# def apply_preferences():
#     if not interaction_data:
#         return jsonify({"message": "No preferences to apply."})

#     preferences = get_preferences().json.get("preferences")
#     return jsonify({"message": "Preferences applied successfully.", "preferences": preferences})

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS 
from ai.q_learning import update_q_table, q_table, states, actions
from ai.probabilistic_model import build_bayesian_network, make_prediction
from ai.neural_network import predict_ui_adjustments

app = Flask(__name__)
CORS(app)

# Example user interaction data
interaction_data = []
model = build_bayesian_network()  # Initialize the model once

@app.route('/track', methods=['POST'])
def track():
    data = request.json
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid data format."}), 400
    interaction_data.append(data)

    scroll_speed = float(data.get("scrollSpeed", 0))
    zoom_level = float(data.get("zoomLevel", 100))
    inactivity_time = float(data.get("inactivityTime", 0))
    is_user_active = data.get("isUserActive", True)

    state = "active_user" if is_user_active else "inactive_user"
    action = "increase_font" if inactivity_time > 30 else "decrease_font"
    reward = 1
    next_state = "adjusted"
    update_q_table(q_table, state, action, reward, next_state)

    return jsonify({"message": "Data tracked successfully."})

@app.route('/preferences', methods=['GET'])
def get_preferences():
    if not interaction_data:
        return jsonify({"message": "No preferences available.", "preferences": None})

    scroll_speeds = [float(d.get('scrollSpeed', 0)) for d in interaction_data if 'scrollSpeed' in d]
    zoom_levels = [float(d.get('zoomLevel', 100)) for d in interaction_data if 'zoomLevel' in d]
    inactivity_times = [float(d.get('inactivityTime', 0)) for d in interaction_data if 'inactivityTime' in d]
  
    font_sizes = [
    float(d.get("fontSize", "16px").replace("px", ""))  # Remove "px"
    for d in interaction_data
    if d.get("fontSize") and d.get("fontSize") != ""  # ✅ Ensure valid non-empty values
]


    average_scroll_speed = sum(scroll_speeds) / len(scroll_speeds) if scroll_speeds else 0
    average_zoom_level = sum(zoom_levels) / len(zoom_levels) if zoom_levels else 100
    average_inactivity_time = sum(inactivity_times) / len(inactivity_times) if inactivity_times else 0
    average_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 16

    adjustment = make_prediction(model, average_zoom_level, average_scroll_speed, average_inactivity_time, average_font_size)

    preferences = {
        "scroll_speed": average_scroll_speed,
        "zoom_level": average_zoom_level,
        "inactivity_time": average_inactivity_time,
        "font_size": average_font_size, 
        "adjustment": adjustment
    }

    return jsonify({"message": "Preferences fetched successfully.", "preferences": preferences})

@app.route('/apply-preferences', methods=['POST'])
def apply_preferences():
    if not interaction_data:
        return jsonify({"message": "No preferences to apply."})

    preferences = get_preferences().json.get("preferences")
    return jsonify({"message": "Preferences applied successfully.", "preferences": preferences})            

# @app.route('/clear-data', methods=['POST'])
# def clear_data():
#     interaction_data.clear()
#     return jsonify({"message": "Interaction data cleared. Preferences will be rebuilt with new inputs."}), 200


if __name__ == '__main__':
    app.run(debug=True)
