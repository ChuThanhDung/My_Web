from database import SessionLocal, engine
import models
from passlib.context import CryptContext
import json

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Create Admin
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin:
        hashed = pwd_context.hash("admin123")
        admin = models.User(username="admin", hashed_password=hashed)
        db.add(admin)

    # 2. Add ML Articles Metadata
    articles = [
        {
            "slug": "pca",
            "title_en": "Principal Component Analysis",
            "title_vi": "Phân tích Thành phần Chính",
            "description_en": "Dimensionality reduction technique that preserves variance.",
            "description_vi": "Kỹ thuật giảm chiều dữ liệu giữ lại phương sai.",
            "category": "Dimensionality Reduction"
        },
        {
            "slug": "kmeans",
            "title_en": "K-Means Clustering",
            "title_vi": "Phân cụm K-Means",
            "description_en": "Unsupervised learning algorithm for grouping similar data points.",
            "description_vi": "Thuật toán học không giám sát để nhóm các điểm dữ liệu tương đồng.",
            "category": "Clustering"
        },
        {
            "slug": "naive_bayes",
            "title_en": "Naive Bayes",
            "title_vi": "Naive Bayes",
            "description_en": "Probabilistic classifier based on Bayes' theorem.",
            "description_vi": "Bộ phân loại xác suất dựa trên định lý Bayes.",
            "category": "Classification"
        },
        {
            "slug": "logistic_regression",
            "title_en": "Logistic Regression",
            "title_vi": "Hồi quy Logistic",
            "description_en": "Fundamental binary classification algorithm.",
            "description_vi": "Thuật toán phân loại nhị phân cơ bản.",
            "category": "Classification"
        },
        {
            "slug": "svm",
            "title_en": "Support Vector Machine",
            "title_vi": "Máy Vector Hỗ Trợ",
            "description_en": "Powerful classifier that maximizes margin between classes.",
            "description_vi": "Bộ phân loại mạnh mẽ tối đa hóa lề giữa các lớp.",
            "category": "Classification"
        }
    ]
    
    for a in articles:
        existing = db.query(models.Article).filter(models.Article.slug == a["slug"]).first()
        if not existing:
            db.add(models.Article(**a))

    # 3. Add Quiz Questions for SVM as an example
    q1 = db.query(models.QuizQuestion).filter(models.QuizQuestion.topic == "svm").first()
    if not q1:
        questions = [
            {
                "topic": "svm",
                "question_en": "What is the main goal of SVM?",
                "question_vi": "Mục tiêu chính của SVM là gì?",
                "options_en": json.dumps(["Minimize variance", "Maximize the margin", "Minimize the margin", "Find the mean"]),
                "options_vi": json.dumps(["Tối thiểu hóa phương sai", "Tối đa hóa lề (margin)", "Tối thiểu hóa lề", "Tìm giá trị trung bình"]),
                "correct_option_index": 1
            },
            {
                "topic": "svm",
                "question_en": "Which parameter controls the margin softness?",
                "question_vi": "Tham số nào kiểm soát độ mềm của lề?",
                "options_en": json.dumps(["Gamma", "Alpha", "C", "Beta"]),
                "options_vi": json.dumps(["Gamma", "Alpha", "C", "Beta"]),
                "correct_option_index": 2
            }
        ]
        for q in questions:
            db.add(models.QuizQuestion(**q))
            
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
