#!/usr/bin/python3
"""a route module for department"""

from routes import jsonify, request, abort, app_views
from models import storage
from models.department import Department


@app_views.route('/department', methods=['POST'], strict_slashes=False)
def create_department():
    """a view function that creates a department"""
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')
    require_fields = ['faculty', 'department']
    for field in require_fields:
        if field not in data:
            return jsonify({'message': f'Missing {field}'}), 400
    department = storage.all(Department)
    for dept in department.values():
        if dept.department == data['department']:
            return jsonify({'message': 'Department already exists'}), 400
    new_department = Department(**data)
    new_department.save()
    return jsonify({'message': 'Added successfully', 'data': new_department.to_dict()}), 201


@app_views.route('/department', methods=['GET'], strict_slashes=False)
def get_departments():
    """a view function that retrieves all departments"""
    departments = storage.all(Department)
    department_data = [department.to_dict() for department in departments.values()]
    return jsonify({'message': 'Fetched Successfully', 'data': department_data}), 200


@app_views.route('/department/<int:department_id>', methods=['DELETE'], strict_slashes=False)
def delete_department(department_id):
    """a view function that retrieves a department"""
    department = storage.get(Department, department_id)
    if department is None:
        return jsonify({'message': 'Department not found'}), 400
    storage.delete(department)
    storage.save()
    return jsonify({'message': 'Department deleted successfully'}), 200


@app_views.route('/department/<int:department_id>', methods=['PUT'], strict_slashes=False)
def update_department(department_id):
    """a view function that updates a department"""
    department = storage.get(Department, department_id)
    if not department:
        return jsonify({'message': 'Department not found'}), 400
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Not a JSON'}), 404
    for key, value in data.items():
        setattr(department, key, value)
    department.save()
    return jsonify({'message': 'Department updated successfully','data': department.to_dict()}), 200
