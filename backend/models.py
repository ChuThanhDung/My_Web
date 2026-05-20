from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Article(Base):
    __tablename__ = "articles"
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title_en = Column(String)
    title_vi = Column(String)
    description_en = Column(String)
    description_vi = Column(String)
    content = Column(Text, nullable=True) # Used if content is stored in DB
    category = Column(String)
    thumbnail = Column(String, nullable=True)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String)
    title_vi = Column(String)
    description_en = Column(String)
    description_vi = Column(String)
    link = Column(String)
    tech_stack = Column(String) # Comma separated
    thumbnail = Column(String, nullable=True)

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True) # e.g., 'pca', 'kmeans'
    question_en = Column(String)
    question_vi = Column(String)
    options_en = Column(String) # JSON string
    options_vi = Column(String) # JSON string
    correct_option_index = Column(Integer)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
