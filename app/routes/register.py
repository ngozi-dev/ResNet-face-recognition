#!/usr/bin/python3
"""a module for user signup"""
from routes import jsonify, request, abort, app_views
from models import storage
from models.student import Student
from models.department import Department


@app_views.route('/signup', methods=['POST'], strict_slashes=False)
def signup():
    """a view function that creates a user"""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Not a JSON'}), 400
    require_fields = ['firstname', 'lastname', 'email', 'student_id', 'programme']
    for field in require_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field}'}), 400
        
    department = storage.filter_by(Department, department=data['department'])
    if not department:
        return jsonify({'error': 'Department not found'}), 404
        
    data['department_id'] = department.id
    data['department'] = department
    validate = storage.all(Student)
    for student in validate.values():
        if student.email == data['email']:
           return jsonify({'error': 'Student already exists'}), 400
    new_user = Student(**data)
    new_user.save()
    return jsonify({'message': 'Record created successfully','data': new_user.to_dict()}), 201