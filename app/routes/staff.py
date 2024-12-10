#!/usr/bin/python3
"""a route module for department"""

from routes import jsonify, request, abort, app_views
from models import storage
from models.staff import Staff
from models.department import Department


@app_views.route('/staff', methods=['POST'], strict_slashes=False)
def create_staff():
    """a view function that creates a staff"""
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')
    require_fields = ['email', 'fullname']
    for field in require_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field}'}), 400
    try:
        department = storage.filter_by(Department, department=data['department'])
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        
        staff_data = {
            'email': data['email'],
            'fullname': data['fullname'],
            'password': 'staff@2024',
            'role': data.get('role', 'Staff'),
            'department_id': department.id
        }
        
        # Check for existing staff
        existing_staff = storage.all(Staff)
        for staff in existing_staff.values():
            if staff.email == data['email']:
                return jsonify({'message': 'Staff already exists'}), 400
        
        # Create new staff
        new_staff = Staff(**staff_data)
        new_staff.save()
        
        return jsonify({
            'message': 'Added successfully', 
            'data': new_staff.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Error creating staff: {str(e)}'}), 500

@app_views.route('/staff', methods=['GET'], strict_slashes=False)
def get_staff():
    """a view function that retrieves all staff"""
    staffs = storage.all(Staff)
    staff_data = []
    for staff in staffs.values():
        staff.set_password('')
        staff_data.append(staff.to_dict())
    return jsonify({'message': 'Fetched Successfully', 'data': staff_data}), 200


@app_views.route('/staff/<int:staff_id>', methods=['DELETE'], strict_slashes=False)
def delete_staff(staff_id):
    """a view function that retrieves a staff"""
    staff = storage.get(Staff, staff_id)
    if not staff:
        return jsonify({'error': 'Staff not found'}), 400
    storage.delete(staff)
    storage.save()
    return jsonify({'message': 'Record deleted successfully'}), 200


@app_views.route('/staff/<int:staff_id>', methods=['PUT'], strict_slashes=False)
def update_staff(staff_id):
    """a view function that updates a staff"""
    staff = storage.get(Staff, staff_id)
    if not staff:
        return jsonify({'error': 'Staff not found'}), 400
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({'error': 'Not a JSON'}), 404
    for key, value in data.items():
        if key in ['id', 'created_at', 'updated_at']:
            continue
        if key == 'department':
            department = storage.filter_by(Department, department=value)
            if not department:
                return jsonify({'error': f'Department {value} not found'}), 404
            staff.department_id = department.id
            staff.department = department
        else:
            setattr(staff, key, value)
    staff.save()
    return jsonify({'message': 'Staff updated successfully','data': staff.to_dict()}), 200
