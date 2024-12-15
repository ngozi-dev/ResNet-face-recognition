#!/usr/bin/env python3
"""a module for user verification"""
from routes import request, abort, app_views, jsonify, current_app
from models import storage
from models.image import Image
from models.student import Student
from werkzeug.utils import secure_filename
import os
from models.face_recognition import FaceRecognitionSystem
import cv2


allowed_extension = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    """a function that check for allowed file"""
    if '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extension:
        return True
    return False


face_rec_system = FaceRecognitionSystem('known_faces_directory')

@app_views.route('/recognize', methods=['POST'], strict_slashes=False)
def recognize_faces():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    

    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)
    
    try:
        # Recognize faces
        results = face_rec_system.recognize_faces(filepath)
        
        # Optionally draw results and save
        result_image = face_rec_system.draw_results(filepath, results)
        cv2.imwrite(os.path.join(current_app.config['UPLOAD_FOLDER'], 'result_' + file.filename), result_image)
        
        return jsonify({
            'recognized_faces': results,
            'result_image': 'result_' + file.filename
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app_views.route('/image_capture', methods=['POST'], strict_slashes=False)
def face_register():
    """a view function that registers a new user"""
    photo = request.files['photo']
    token = request.form.get('token', '')
    if not photo:
        return jsonify({'error': 'Missing image'}), 400
    if not allowed_file(photo.filename):
        return jsonify({'error': 'Invalid Format'}), 404
    filename = secure_filename(photo.filename)
    file_extension = os.path.splitext(filename)[1]
    student = storage.filter_by(Student, token=token);
    if not student:
        return jsonify({'error': 'Student not found!'}), 404
    new_filename = f"{student.firstname}_{student.lastname}{file_extension}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], new_filename)
    photo.save(file_path)
    image = Image(student_id=student.id, filename=new_filename)
    image.save()
    student.token=''
    student.save()
    return jsonify({'message': 'Image registered successfully'}), 201
   