from app.core.database import engine, Base
from app.models.models import User, Steps, Exercise, Goal, ActivityData

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
