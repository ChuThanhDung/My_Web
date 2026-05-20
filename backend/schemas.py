from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- Articles ---
class ArticleBase(BaseModel):
    slug: str
    title_en: str
    title_vi: str
    description_en: str
    description_vi: str
    content: Optional[str] = None
    category: str
    thumbnail: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    class Config:
        from_attributes = True

# --- Projects ---
class ProjectBase(BaseModel):
    title_en: str
    title_vi: str
    description_en: str
    description_vi: str
    link: str
    tech_stack: str
    thumbnail: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    class Config:
        from_attributes = True

# --- Quizzes ---
class QuizQuestionBase(BaseModel):
    topic: str
    question_en: str
    question_vi: str
    options_en: str
    options_vi: str
    correct_option_index: int

class QuizQuestionCreate(QuizQuestionBase):
    pass

class QuizQuestion(QuizQuestionBase):
    id: int
    class Config:
        from_attributes = True

class QuizSubmit(BaseModel):
    answers: dict[int, int]  # question_id -> selected_option_index

# --- Contact ---
class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

class ContactMessage(ContactMessageCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str
