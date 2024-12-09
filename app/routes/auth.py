#!/usr/bin/python3
""" a module for user login"""
from routes import request, abort, app_views, jsonify
from models import storage
from models.staff import Staff
from hashlib import md5

@app_views.route('/login', methods=['POST'], strict_slashes=False)
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Not a JSON'}), 400
    if 'password' not in data:
        return jsonify({'message': 'Missing password'}), 400
    if 'email' not in data:
        return jsonify({'message': 'Missing email'}), 400
    users = storage.all(Staff)
    if users is None:
        abort(400, 'User not found')
    for user in users.values():
        if user.email == data['email']:
            if user.password != md5(data['password'].encode()).hexdigest():
                return jsonify({'message:': 'Incorrect password'}), 400
            user.set_password('')
            return jsonify({'message': 'Successful', 'data': user.to_dict()})
    return jsonify({'message': 'Not a register member, Signup'}), 400



@app_views.route('/user/<int:user_id>', methods=['GET'], strict_slashes=False)
#jwt_required()
def getdetails(user_id):
    users = storage.get(Staff, user_id)
    if users is None:
       return jsonify({'message': 'User not found'}), 400
    user_data = users.to_dict()
    user_data.set_password('')
    return jsonify(user_data, 201)