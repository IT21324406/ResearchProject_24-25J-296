from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all domains (adjust as needed for security)
CORS(app)

@app.route('/api/feedback', methods=['POST'])
def handle_feedback():
    feedback = request.get_json()

    # Process the feedback using predefined rules
    ui_changes = process_feedback(feedback)

    return jsonify({'success': True, 'feedback': ui_changes})

def process_feedback(feedback):
    # Apply rules based on user feedback
    ui_changes = {}

    # Font size rule
    if feedback['fontSize'] == '12sp':
        ui_changes['fontSize'] = '12px'
    elif feedback['fontSize'] == '14sp':
        ui_changes['fontSize'] = '14px'
    else:
        ui_changes['fontSize'] = '16px'

    # Font color rule
    if feedback['fontColor'] == 'red':
        ui_changes['fontColor'] = 'red'
    elif feedback['fontColor'] == 'blue':
        ui_changes['fontColor'] = 'blue'
    else:
        ui_changes['fontColor'] = 'black'

    # Alignment rule
    ui_changes['alignment'] = feedback['alignment']  # Just pass the value directly

    # Color scheme rule
    if feedback['colorScheme'] == 'dark':
        ui_changes['colorScheme'] = 'dark-mode'
    else:
        ui_changes['colorScheme'] = 'light-mode'

    return ui_changes

if __name__ == '__main__':
    app.run(debug=True)
