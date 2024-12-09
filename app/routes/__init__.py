#!/usr/bin/python3
""" Blueprint for the api """
from flask import Blueprint, jsonify, request, abort, current_app
app_views = Blueprint('app_views', __name__, url_prefix='/api/v1', template_folder='templates')



from routes.register import *
from routes.auth import *