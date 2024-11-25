from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS

app = Flask(__name__, static_folder="../frontend/build", static_url_path="")
CORS(app)

# API endpoint
@app.route("/api/data")
def get_data():
    return jsonify({"message": "Hello from Flask!"})

# Serve React frontend
@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")


