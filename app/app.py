#!/usr/bin/env python3
"""Main application file for the Flask app."""
from flask import Flask, jsonify
from flask_cors import CORS
from models import storage
from config.config import Config
from routes import app_views


app = Flask(__name__)

config_name = "development"
app.config.from_object(Config)
Config.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(app_views)

@app.teardown_appcontext
def teardown_appcontext(self):
    """ Teardown app context """
    storage.close()


@app.errorhandler(404)
def not_found_error(error):
    """ Not found error """
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(403)
def forbidden(error) -> str:
    """Forbidden error"""
    return jsonify({'error': 'Forbidden'}), 403

if __name__ == "__main__":
    app.run(debug=True)