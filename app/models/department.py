#!/usr/bin/python3
"""a model for department"""
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class Department(BaseModel, Base):
    """Department class model"""
    __tablename__ = 'departments'
    faculty = Column(String(128), nullable=False)
    department = Column(String(128), nullable=False)
    staff = relationship('Staff', back_populates='department')

    def __init__(self, **kwargs):
        """initializes the department"""
        super().__init__(**kwargs)