###################
# app.py
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

    # Update Q-table with new state-action pair (for simplicity)
    state = data.get('fontState', 'medium_font')  # Placeholder state
    action = data.get('action', 'increase_font')  # Placeholder action
    reward = 1  # Assume reward for now
    next_state = 'zoomed_in'  # Placeholder for next state
    update_q_table(q_table, state, action, reward, next_state)

    return jsonify({"message": "Data tracked successfully."})

@app.route('/preferences', methods=['GET'])
def get_preferences():
    if not interaction_data:
        return jsonify({"message": "No preferences available.", "preferences": None})

    # For simplicity, using average font size and zoom level
    font_sizes = [float(d['fontSize'].replace('px', '')) for d in interaction_data if 'fontSize' in d]
    zoom_levels = [d['zoomLevel'] for d in interaction_data if 'zoomLevel' in d]

    average_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 16
    average_zoom_level = sum(zoom_levels) / len(zoom_levels) if zoom_levels else 100

    # Use Bayesian Network model for prediction
    adjustment = make_prediction(model, average_zoom_level, average_font_size)

    preferences = {
        "font_size": average_font_size,
        "zoom_level": average_zoom_level,
        "adjustment": adjustment
    }

    # Optionally, use Neural Network for prediction
    nn_adjustment = predict_ui_adjustments([average_zoom_level, average_font_size])

    return jsonify({
        "message": "Preferences fetched successfully.",
        "preferences": preferences,
        "nn_adjustment": nn_adjustment.tolist()  # Convert tensor output to list
    })

@app.route('/apply-preferences', methods=['POST'])
def apply_preferences():
    if not interaction_data:
        return jsonify({"message": "No preferences to apply."})

    preferences = get_preferences().json.get("preferences")
    return jsonify({"message": "Preferences applied successfully.", "preferences": preferences})

if __name__ == '__main__':
    app.run(debug=True)
