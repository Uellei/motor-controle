import os


class Config:
    FLASK_ENV = os.getenv("FLASK_ENV")
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
    MONGODB_URI = os.getenv("MONGODB_URI")
