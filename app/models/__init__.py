#!/usr/bin/python3
"""a module for db storage"""
from .engine.db_manager import DBStorage


storage = DBStorage()
storage.reload()