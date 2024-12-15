#!/usr/bin/python3
"""a module that contain user attributes"""
from models.base_model import Base, BaseModel
from models.image import Image
from sqlalchemy import Column, String, Enum, Integer, ForeignKey
from sqlalchemy.orm import relationship
from hashlib import md5
from uuid import uuid4



class Student(BaseModel, Base):
    """User class model"""
    __tablename__ = 'students'
    firstname = Column(String(128), nullable=False)
    lastname = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False, unique=True)
    student_id = Column(String(128), nullable=False)
    programme = Column(Enum('Bsc', 'Msc', 'Phd', name='programme'), nullable=False, default='Bsc')
    level = Column(String(50), default=100, nullable=True)
    mode = Column(Enum('online', 'offline', name="mode"), nullable=False)
    department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    token = Column(String(128), nullable=True, default=str(uuid4()))
    department = relationship(
        'Department', 
        primaryjoin='Student.department_id == Department.id',
        backref='students',
        lazy='joined'
    )
    image = relationship('Image', backref='students', cascade='all, delete-orphan')

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)

    def to_dict(self):
        """ Overwriting the to_dict method in the base model"""
        new_dict = super().to_dict()
        new_dict['image'] = [image.to_dict() for image in self.image]
        new_dict['department'] = self.department.department if self.department else None,

        return new_dict 