#!/usr/bin/python3
"""a module that contain user attributes"""
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String, Boolean
from hashlib import md5



class Staff(BaseModel, Base):
    """User class model"""
    __tablename__ = 'staffs'
    firstname = Column(String(128), nullable=False)
    lastname = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False, unique=True)
    password = Column(String(128), nullable=False)
    permission = Column(Boolean, nullable=False, default=False)

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.password = md5(self.password.encode()).hexdigest()

    def set_password(self, new_password):
        """set password"""
        self.password = new_password