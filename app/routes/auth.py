#!/usr/bin/python3
""" a module for user login"""
from routes import request, app_views, jsonify
from models import storage
from models.staff import Staff
from hashlib import md5

@app_views.route('/login', methods=['POST'], strict_slashes=False)
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Not a JSON'}), 404
    if 'password' not in data:
        return jsonify({'error': 'Missing password'}), 400
    if 'email' not in data:
        return jsonify({'error': 'Missing email'}), 400
    users = storage.all(Staff)
    if users is None:
        return jsonify({'error': 'User not found'}), 400
    for user in users.values():
        if user.email == data['email']:
            if user.password != md5(data['password'].encode()).hexdigest():
                return jsonify({'error': 'Incorrect password'}), 400
            user.set_password('')
            return jsonify({'message': 'Successful', 'data': user.to_dict()})
    return jsonify({'error': 'Not a register member, Signup'}), 400
