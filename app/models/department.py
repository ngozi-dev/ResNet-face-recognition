#!/usr/bin/python3
"""a model for department"""
from models.base_model import Base, BaseModel
from models.image import Image
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Table
from sqlalchemy.orm import relationship


class Department(BaseModel, Base):
    """Department class model"""
    __tablename__ = 'departments'
    faculty = Column(String(128), nullable=False)
    department = Column(String(128), nullable=False)
    staff = relationship('Staff', backref='departments', cascade='all, delete-orphan')
