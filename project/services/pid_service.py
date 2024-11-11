import io

import control as ctrl
import matplotlib.pyplot as plt
import numpy as np
from flask import send_file

plt.switch_backend("Agg")


def create_system(K, T, L, Kp, Ti):
    g = ctrl.TransferFunction([K], [T, 1])
    atraso_transporte = ctrl.TransferFunction([-L / 2, 1], [L / 2, 1])
    gp = g * atraso_transporte
    gc = Kp * ctrl.TransferFunction([1, 1 / Ti], [1, 0])
    FTMA = gc * gp
    FTMF = ctrl.feedback(FTMA, 1)

    return FTMF


def plot_pid_response(K, T, L, Kp, Ti):
    # plt.style.use("dark_background")

    fig, ax = plt.subplots()
    ax.set_title("Resposta ao Degrau do Sistema em Malha Fechada")
    ax.set_xlabel("Tempo (s)")
    ax.set_ylabel("Velocidade")
    ax.grid(True)

    t = np.linspace(0, 1, 100)
    FTMF = create_system(K, T, L, Kp, Ti)

    # Resposta ao degrau
    _, velocidade = ctrl.step_response(1000 * FTMF, t)
    ax.plot(t, velocidade, lw=2, label=f"Degrau: K = {K}")
    ax.legend()

    # plt.show()

    fig.savefig("saida_degrau.png")
    # plt.close(fig)
    img_buf = io.BytesIO()
    fig.savefig(img_buf, format="png")
    plt.close(fig)
    img_buf.seek(0)

    return img_buf


def plot_pid_response_comparison(K, T, L, Kp, Ti):

    fig, ax = plt.subplots()
    ax.set_title("Resposta ao Degrau do Sistema em Malha Fechada")
    ax.set_xlabel("Tempo (s)")
    ax.set_ylabel("Velocidade")
    ax.grid(True)

    t = np.linspace(0, 1, 100)
    FTMF = create_system(K, T, L, Kp, Ti)

    # Resposta ao degrau
    _, velocidade = ctrl.step_response(1000 * FTMF, t)
    ax.plot(t, velocidade, lw=2, label=f"Degrau: K = {K}")
    ax.legend()

    # plt.show()

    fig.savefig("saida_degrau.png")
    # plt.close(fig)
    img_buf = io.BytesIO()
    fig.savefig(img_buf, format="png")
    plt.close(fig)
    img_buf.seek(0)

    return img_buf


def plot_ramp_response(K, T, L, Kp, Ti):
    fig, ax = plt.subplots()
    ax.set_title("Resposta à Rampa do Sistema em Malha Fechada")
    ax.set_xlabel("Tempo (s)")
    ax.set_ylabel("Velocidade")
    ax.grid(True)

    t = np.linspace(
        0, 10, 1000
    )  # Período maior para ver melhor a resposta à rampa
    rampa = t  # Sinal de entrada tipo rampa

    FTMF = create_system(K, T, L, Kp, Ti)

    # Resposta à rampa
    _, velocidade = ctrl.forced_response(FTMF, t, rampa)
    ax.plot(t, velocidade, lw=2, label=f"Rampa: K = {K}")
    ax.legend()

    plt.show()

    fig.savefig("saida_rampa.png")
    plt.close(fig)
    return "saida_rampa.png"


# Seguimento da Inclinação da Rampa:
# A saída parece seguir bem a inclinação da rampa. Indica que o sistema é capaz de acompanhar a entrada sem um erro significativo ao longo do tempo.

# Ausência de Overshoot:
# Não há um pico inicial (overshoot), oque é desejável em muitos sistemas de controle, pois evita oscilações indesejadas.

# Resposta suave e sem ruídos visíveis:
# Não apresenta oscilações ou ruído. Indica que o sistema está bem ajustado e que não há necessidade de uma filtragem adicional para suavizar o sinal.

# Erro em regime permanente: Aparentemente, não há erro em regime permanten, pois a resposta está bem alinhada com a rampa.
