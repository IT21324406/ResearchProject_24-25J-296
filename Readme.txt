Running Flask App with Virtual Environment

1. Prerequisites ============================================================================================================

Ensure you have the following installed on your system:

Python (Download from https://www.python.org/ or install via Anaconda)

Anaconda (Optional, but can be used to manage environments: https://www.anaconda.com/)

pip (Usually comes with Python)

Git (Optional, for version control)

2. Set Up Virtual Environment ============================================================================================================

Open a terminal or command prompt.

Navigate to your project directory by using the 'cd' command followed by the project path.

Create a virtual environment using the command 'python -m venv venv'.

Activate the virtual environment:

On Windows, run 'venv\Scripts\activate'.

On macOS/Linux, run 'source venv/bin/activate'.

3. Install Requirements ==================================================================================================================

Install dependencies from the requirements.txt file by running 
'pip install -r requirements.txt'.

4. Change app.py IP to Your IPv4 Address =================================================================================================

Find your IPv4 address:

On Windows, open Command Prompt and run 'ipconfig'. Look for the "IPv4 Address" under your active network.

On macOS/Linux, open a terminal and run 'ifconfig | grep 'inet ''. Look for the local IPv4 address (not 127.0.0.1).

Open the app.py file in a text editor.

Locate the line that contains 'app.run(host='127.0.0.1', port=5000, debug=True)'.

Replace '127.0.0.1' with your IPv4 address, for example, 'app.run(host='192.168.X.X', port=5000, debug=True)'.

Save the file.

5. Run the Flask App ======================================================================================================================

Ensure the virtual environment is activated.

Start the Flask application by running 'python app.py'.

Access the app in your browser using 'http://192.168.X.X:5000', replacing '192.168.X.X' with your actual IPv4 address.

6. Set Up EyeCareAI Chrome Extension========================================================================================================

Open Google Chrome and go to Extensions (chrome://extensions/).

Enable "Developer mode" in the top-right corner.

Click on "Load unpacked" and select the folder 'EyeCareAI/eyeCareAI-plugin'.

Locate the 'popup.js' file in the extension directory and open it in a text editor.

Update any API endpoint IP addresses to match your IPv4 address (e.g., replace '127.0.0.1' with '192.168.X.X').

Save the file and reload the extension in Chrome.

The extension should now connect to your local Flask API properly.

