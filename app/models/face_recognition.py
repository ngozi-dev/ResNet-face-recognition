#!/usr/bin/env python3
"""a module for face recognition"""
import face_recognition
from flask import current_app
import cv2
import numpy as np
import os

class FaceRecognitionSystem:
    def __init__(self):
        known_faces_directory = current_app.config.get('UPLOAD_FOLDER')
        self.known_face_encodings = []
        self.known_face_names = []
        
        # Load known faces
        self.load_known_faces(known_faces_directory)
    
    def load_known_faces(self, directory):
        """
        Load known faces from a directory of images
        Each image filename will be considered the person's name
        """
        for filename in os.listdir(directory):
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                image = face_recognition.load_image_file(os.path.join(directory, filename))
                encoding = face_recognition.face_encodings(image)[0]
                
                # Use filename (without extension) as the name
                name = os.path.splitext(filename)[0]
                
                self.known_face_encodings.append(encoding)
                self.known_face_names.append(name)
    
    def recognize_faces(self, image_path, tolerance=0.6):
        """
        Recognize faces in a given image
        
        Args:
        - image_path: Path to the image to analyze
        - tolerance: How much distance between faces to consider it a match (lower is stricter)
        
        Returns:
        List of dictionaries with face locations and names
        """
        # Read the input image
        unknown_image = face_recognition.load_image_file(image_path)
        
        # Find face locations and encodings in the unknown image
        face_locations = face_recognition.face_locations(unknown_image)
        face_encodings = face_recognition.face_encodings(unknown_image, face_locations)
        
        # Results to store
        recognition_results = []
        
        # Compare faces
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            # Compare with known faces
            matches = face_recognition.compare_faces(
                self.known_face_encodings, 
                face_encoding, 
                tolerance=tolerance
            )
            
            # Default name
            name = "Unknown"
            
            # Find the best match
            if True in matches:
                first_match_index = matches.index(True)
                name = self.known_face_names[first_match_index]
            
            # Store results
            recognition_results.append({
                'location': {
                    'top': top,
                    'right': right,
                    'bottom': bottom,
                    'left': left
                },
                'name': name
            })
        
        return recognition_results
    
    def draw_results(self, image_path, results):
        """
        Draw recognition results on the image
        """
        # Read the image with OpenCV
        image = cv2.imread(image_path)
        
        for result in results:
            top = result['location']['top']
            right = result['location']['right']
            bottom = result['location']['bottom']
            left = result['location']['left']
            name = result['name']
            
            # Draw rectangle
            cv2.rectangle(image, (left, top), (right, bottom), (0, 0, 255), 2)
            
            # Draw name
            cv2.putText(
                image, 
                name, 
                (left + 6, bottom - 6), 
                cv2.FONT_HERSHEY_DUPLEX, 
                0.8, 
                (255, 255, 255), 
                1
            )
        
        return image