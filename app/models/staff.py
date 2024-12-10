#!/usr/bin/python3
"""a module that contain user attributes"""
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from hashlib import md5



class Staff(BaseModel, Base):
    """User class model"""
    __tablename__ = 'staffs'
    fullname = Column(String(128), nullable=False)
    email = Column(String(128), nullable=False, unique=True)
    password = Column(String(128), nullable=False)
    permission = Column(Boolean, nullable=False, default=False)
    role = Column(String(128), nullable=False)
    department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    department = relationship(
        'Department', 
        primaryjoin='Staff.department_id == Department.id',
        back_populates='staff',
        lazy='joined'
    )

    def __init__(self, **kwargs) -> None:
        super().__init__(**kwargs)
        self.password = md5(self.password.encode()).hexdigest()

    def set_password(self, new_password):
        """set password"""
        self.password = new_password
    
    def to_dict(self):
        """ Return a dictionary representation of the staff"""
        staff_dict = {
            'id': self.id,
            'email': self.email,
            'fullname': self.fullname,
            'role': self.role,
            'department': self.department.department if self.department else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        return staff_dict