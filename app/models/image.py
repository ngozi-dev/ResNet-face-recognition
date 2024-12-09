#!/usr/bin/python3
""" a model for file upload"""
from .base_model import Base, BaseModel
from sqlalchemy import Column, String, ForeignKey, Integer


class Image(BaseModel, Base):
    """a class for images """
    __tablename__ = 'images'
    filename = Column(String(128), nullable=False)
    student_id = Column(Integer, ForeignKey('students.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)