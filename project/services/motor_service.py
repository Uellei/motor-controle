import io
import re
import time
from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np
import serial

# Configurações para a conexão serial (ajuste conforme necessário)
arduino_port = "COM5"  # Porta do Arduino
baud_rate = 115200
timeout = 1  # Timeout de 1 segundo


def plot_response(data: list[float]):
    """
    Gera um gráfico da velocidade do motor ao longo do tempo com base nos valores de RPM.
    """
    tempo = np.arange(
        0, len(data) * 0.05, 0.05
    )  # Ajuste o intervalo de tempo conforme necessário
    fig, ax = plt.subplots()
    ax.plot(tempo, data, label="Velocidade (RPM)")
    ax.set_title("Velocidade do Motor ao Longo do Tempo")
    ax.set_xlabel("Tempo (s)")
    ax.set_ylabel("Velocidade (RPM)")
    ax.legend()
    ax.grid(True)

    # Salva o gráfico em um buffer para retornar como imagem
    img_buf = io.BytesIO()
    fig.savefig(img_buf, format="png")
    plt.close(fig)
    img_buf.seek(0)

    return img_buf


def enviar_vref_e_monitorar(vref):
    """
    Envia o valor de vref para o Arduino pela Serial e monitora as mensagens até a parada do motor.
    Retorna uma lista com os valores de velocidade (RPM) extraídos das mensagens do monitor serial.
    """
    mensagens = []
    velocidades = []  # Lista para armazenar os valores de RPM

    try:
        # Abre a conexão serial dentro da função
        with serial.Serial(arduino_port, baud_rate, timeout=timeout) as arduino:
            time.sleep(2)  # Aguarda a inicialização do Arduino

            # Envia o valor de vref para o Arduino
            comando = f"{vref}\n"
            arduino.write(comando.encode())
            print(f"Enviado vref: {vref}")

            # Monitoramento do serial até detectar a mensagem de parada
            while True:
                if arduino.in_waiting > 0:
                    linha = arduino.readline().decode().strip()
                    if linha:
                        mensagens.append(linha)
                        print("Arduino:", linha)

                        # Extrai o valor de velocidade (RPM) da linha
                        match = re.search(
                            r"Velocidade \(RPM\): ([\d.]+)", linha
                        )
                        if match:
                            velocidade = float(match.group(1))
                            velocidades.append(
                                velocidade
                            )  # Adiciona o RPM à lista

                        # Verifica se o motor foi parado
                        if (
                            "Motor parado automaticamente por estabilidade."
                            in linha
                        ):
                            print("\nMotor foi parado automaticamente.")
                            break
                else:
                    time.sleep(0.1)  # Pausa para evitar loop excessivo de CPU
    except serial.SerialException as e:
        print(f"Erro de conexão serial: {e}")
        mensagens.append(f"Erro de conexão serial: {e}")

    return velocidades


def receive_motor_data(data):
    """
    Função para simular o recebimento e armazenamento de dados do motor.
    """
    motor_data = {
        "rpm": data.get("rpm"),
        "pwm": data.get("pwm"),
        "dir": data.get("dir"),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    return {"message": motor_data}


def fetch_motor_history():
    """
    Função para simular a recuperação do histórico de dados do motor.
    """
    return {"history": "Histórico de dados do motor"}
