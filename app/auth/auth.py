#!/usr/bin/env python3
"""authentication module"""
from models import storage
from models.staff import Staff
from flask import abort

"""
def get_auth_user():
    staff_id = get_jwt_identity()
    user = storage.get(Staff, staff_id)

    if not user:
        abort(404)
    return user
"""