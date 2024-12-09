#!/usr/bin/python3
"""a module that contain user attributes"""
from models.base_model import Base, BaseModel
from models.image import Image
from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
from hashlib import md5



class Student(BaseModel, Base):
    """User class model"""
    __tablename__ = 'students'
    firstname = Column(String(128), nullable=False)
    lastname = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False, unique=True)
    password = Column(String(128), nullable=False)
    student_id = Column(String(128), nullable=False)
    programme = Column(Enum('Bsc', 'Msc', 'Phd', name='programme'), nullable=False)
    level = Column(String(50), default=100, nullable=True)
    image = relationship('Image', backref='users', cascade='all, delete-orphan')

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.password = md5(self.password.encode()).hexdigest()

    def to_dict(self):
        """ Overwriting the to_dict method in the base model"""
        new_dict = super().to_dict()
        new_dict['image'] = [image.to_dict() for image in self.image]
        return new_dict 

    def set_password(self, new_password):
        """set password"""
        self.password = new_password