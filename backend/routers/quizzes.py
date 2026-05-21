from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

router = APIRouter(prefix="/api/quizzes", tags=["Quizzes"])

@router.get("/{topic}", response_model=list[schemas.QuizQuestionPublic])
def get_quiz_questions(topic: str, db: Session = Depends(get_db)):
    questions = db.query(models.QuizQuestion).filter(models.QuizQuestion.topic == topic).all()
    return questions

@router.post("/{topic}/submit")
def submit_quiz(topic: str, submission: schemas.QuizSubmit, db: Session = Depends(get_db)):
    questions = db.query(models.QuizQuestion).filter(models.QuizQuestion.topic == topic).all()
    score = 0
    results = {}
    for q in questions:
        selected = submission.answers.get(str(q.id)) or submission.answers.get(q.id)
        is_correct = selected == q.correct_option_index
        if is_correct:
            score += 1
        results[q.id] = {
            "is_correct": is_correct,
            "correct_option": q.correct_option_index
        }
    return {"score": score, "total": len(questions), "results": results}
