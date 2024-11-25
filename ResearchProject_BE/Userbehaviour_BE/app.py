from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

user_data = []

# Function to analyze the behavior data
def analyze_behavior(data):
    # Extracting the font size and zoom level data from the collected user data
    font_sizes = [d["fontSize"] for d in data if "fontSize" in d]
    zoom_levels = [d["zoomLevel"] for d in data if "zoomLevel" in d]

    # Safely handle floating-point font sizes
    try:
        avg_font_size = sum([float(size[:-2]) for size in font_sizes]) / len(font_sizes) if font_sizes else 16
    except ValueError:
        avg_font_size = 16  # Default to 16px if conversion fails

    # Calculate average zoom level
    avg_zoom_level = sum(zoom_levels) / len(zoom_levels) if zoom_levels else 100

    # Create a preferences dictionary to return
    preferences = {
        "averageFontSize": avg_font_size,
        "averageZoomLevel": avg_zoom_level,
        "averageFontColor": "#ff004c000"  # Assume black as default, you can add color analysis
    }

    print("Preferences", preferences)
    return preferences


# Endpoint to collect tracking data
@app.route("/track", methods=["POST"])
def track_behavior():
    data = request.json
    print("Data received at /track:", data)

    if not data:
        return jsonify({"error": "No data provided!"}), 400

    # Append the incoming data to the in-memory storage (user_data)
    user_data.append(data)
    return jsonify({"message": "User behavior tracked successfully!"})

# Endpoint to get user preferences (this was missing and caused the 404 error)
@app.route("/preferences", methods=["GET"])
def get_preferences():
    if not user_data:
        return jsonify({"message": "No preferences available."})

    preferences = analyze_behavior(user_data)
    return jsonify(preferences)

# Endpoint to analyze the collected data and apply preferences
@app.route("/apply-preferences", methods=["POST"])
def apply_preferences():
    if not user_data:
        return jsonify({"message": "No preferences to apply yet."})

    # Analyze the collected user data and generate preferences
    preferences = analyze_behavior(user_data)
    return jsonify({"message": "Preferences applied successfully!", "preferences": preferences})

# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True)
