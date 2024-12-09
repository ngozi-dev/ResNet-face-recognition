#!/usr/bin/python3
"""a module for user signup"""
from routes import jsonify, request, abort, app_views
from models import storage
from models.student import Student
from models.image import Image


@app_views.route('/signup', methods=['POST'], strict_slashes=False)
def signup():
    """a view function that creates a user"""
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')
    require_fields = ['firstname', 'lastname', 'email', 'password']
    for field in require_fields:
        if field not in data:
            return jsonify({'message': f'Missing {field}'}), 400
    validate = storage.all(Student)
    for student in validate.values():
        if student.email == data['email']:
           return jsonify({'message': 'Student already exists'}), 400
    new_user = Student(**data)
    new_user.save()
    #new_image = Image(filename='', user_id=new_user.id)
    #new_image.save()
    new_user.set_password('')
    return jsonify({'data': new_user.to_dict()}), 201