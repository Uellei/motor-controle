import functools
import logging
import traceback

from flask import jsonify, request


def middleware():
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                user_data = request.json
                return func(user_data=user_data, *args, **kwargs)
            except Exception as e:
                logging.error(traceback.format_exc())
                return jsonify({"error": str(e)}), 400

        return wrapper

    return decorator
