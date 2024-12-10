#!/usr/bin/python3
""" a module for stats"""
from routes import request, abort, app_views, jsonify
from models import storage
from models.student import Student
from models.staff import Staff
from models.department import Department


@app_views.route('/stats', methods=['GET'], strict_slashes=False)
def stats():
    """a view function that returns the stats of the app"""
    students = storage.count(Student)
    staff = storage.count(Staff)
    departments = storage.count(Department)
    return jsonify({'message': 'Fetched successfully', 'data': {'students': students, 'staffs': staff, 'departments': departments}}), 200
