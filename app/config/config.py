#!/usr/bin/python3
import os
from datetime import timedelta
from os import getenv

class Config:
    """ a class for config"""
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'exam.auth@gmail.com'
    MAIL_PASSWORD = getenv('MAIL_PASSWORD')
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'upload', 'images')
    SECRET_KEY = getenv('SECRET_KEY')
    JWT_SECRET_KEY = getenv('SECRET_KEY')
    JWT_TOKEN_LOCATION = ['headers']
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=10)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    @classmethod
    def init_app(cls, app):
        pass