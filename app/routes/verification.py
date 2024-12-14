#!/usr/bin/env python3
"""a module for user verification"""
from routes import request, abort, app_views, jsonify
from models import storage
from models.image import Image



@app_views.route('/verification', methods=['GET'], strict_slashes=False)
def verification():
    """a view function that returns the stats of the app"""
    images = storage.count(Image)
    return jsonify({'message': 'Fetched successfully', 'data': {'images': images}}), 200


@app_views.route('/image/<user_id>', methods=['POST'], strict_slashes=False)
def register(user_id):
    """a view function that registers a new user"""
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid data'}), 400
    if 'image' not in data:
        return jsonify({'message': 'Image is required'}), 400
    image = Image(user_id=user_id, image=data['image'])
    image.save()
    return jsonify({'message': 'Image registered successfully'}), 201
