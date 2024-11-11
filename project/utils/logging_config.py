import logging
import os
from logging.handlers import RotatingFileHandler


class LoggingConfig:
    LOG_FILE = "app.log"
    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    @classmethod
    def setup_logging(cls, level=logging.INFO):
        logger = logging.getLogger()
        logger.setLevel(level)

        formatter = logging.Formatter(cls.LOG_FORMAT)

        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        if not os.path.exists("logs"):
            os.makedirs("logs")
        file_handler = RotatingFileHandler(
            os.path.join("logs", cls.LOG_FILE),
            maxBytes=5 * 1024 * 1024,
            backupCount=5,
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        logging.info("Logging configured")

    @staticmethod
    def log_error(error):
        logging.error("Erro: %s", error)

    @staticmethod
    def log_warning(warning):
        logging.warning("Aviso: %s", warning)

    @staticmethod
    def log_info(info):
        logging.info("Info: %s", info)
