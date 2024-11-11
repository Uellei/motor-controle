import logging
import traceback

from flask import jsonify, request, send_file
from flask_restx import Namespace, Resource
from services.motor_service import enviar_vref_e_monitorar, plot_response
from services.pid_service import (
    plot_pid_response,
    plot_pid_response_comparison,
    plot_ramp_response,
)
from utils.logging_config import LoggingConfig
from utils.middleware import middleware

LoggingConfig.setup_logging()


def setup_routes(api):
    motor_ns = Namespace("motor", description="Operations related to motors")
    motor_pid = Namespace("pid", description="Operations related to PID")

    @motor_ns.route("/set_vref")
    class MotorControl(Resource):
        def post(self):
            try:
                # Obtém o valor de `vref` da requisição JSON
                data = request.get_json()
                vref = data.get("vref")

                if not isinstance(vref, int) or vref <= 0:
                    return (
                        jsonify(
                            {
                                "error": "Valor inválido para `vref`. Deve ser um número positivo."
                            }
                        ),
                        400,
                    )

                # Envia `vref` ao Arduino e captura as mensagens até que o motor pare
                velocidades = enviar_vref_e_monitorar(vref)
                img_buf = plot_response(velocidades)
                return send_file(img_buf, mimetype="image/png")

            except Exception as e:
                return jsonify({"error": str(e)}), 500

    # @motor_ns.route("/history")
    # class MotorHistory(Resource):
    #     @middleware()
    #     def get(self, user_data):
    #         return fetch_motor_history(user_data)

    @motor_pid.route("/step_response")
    class ExecutePID(Resource):
        @middleware()
        def post(self, user_data):
            try:
                K, T, L, Kp, Ti = (
                    user_data.get(param)
                    for param in ["K", "T", "L", "Kp", "Ti"]
                )

                img_buf = plot_pid_response(K, T, L, Kp, Ti)
                return send_file(img_buf, mimetype="image/png")

            except Exception as e:
                LoggingConfig.log_error(traceback.format_exc())
                return jsonify({"error": str(e)}), 400

    @motor_pid.route("/step_comparison")
    class ExecutePID(Resource):
        @middleware()
        def post(self, user_data):
            try:
                K, T, L, Kp, Ti = (
                    user_data.get(param)
                    for param in ["K", "T", "L", "Kp", "Ti"]
                )
                img_buf = plot_pid_response_comparison(1, K, L, Kp, Ti)
                return send_file(img_buf, mimetype="image/png")

            except Exception as e:
                LoggingConfig.log_error(traceback.format_exc())
                return jsonify({"error": str(e)}), 400

    @motor_pid.route("/ramp_response")
    class Execute(Resource):
        @middleware()
        def post(self, user_data):
            try:
                K, T, L, Kp, Ti = (
                    user_data.get(param)
                    for param in ["K", "T", "L", "Kp", "Ti"]
                )

                file_path = plot_ramp_response(K, T, L, Kp, Ti)
                return send_file(file_path, mimetype="image/png")

            except Exception as e:
                LoggingConfig.log_error(traceback.format_exc())
                return jsonify({"error": str(e)}), 400

    api.add_namespace(motor_ns)
    api.add_namespace(motor_pid)
