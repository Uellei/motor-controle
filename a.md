```py
import asyncio

import pyfirmata2

# Configuração dos pinos do Arduino
ENABLE_PIN = 2
DIR_PIN_1 = 3
DIR_PIN_2 = 4
PWM_PIN = 5
ADC_PIN = 0  # Usado para leitura do ADC no pino A0
SAMPLING_PERIOD = 0.05  # 50 ms (em segundos para asyncio.sleep)

# Coeficientes e constantes de controle
a = 10.168
b = 52.946
vref = 1000  # Setpoint de velocidade desejada em RPM
Kp = 1.69  # Constante Proporcional
Ki = 1.127  # Constante Integral

# Variáveis globais para o controlador PI
pwm_value = 0
integral = 0
erro = 0
adc_value = 0  # Armazena o valor lido do ADC

# Variáveis para acumular a média do ADC
adc_sum = 0
adc_count = 0


# Função para calcular a velocidade em RPM com base no valor do ADC
def calcular_velocidade(adc):
    return a * adc + b


# Função para definir o sentido de rotação do motor
def set_motor_direction(direction):
    direction_pin_1.write(direction)
    direction_pin_2.write(0 if direction else 1)


# Função do controlador PI para calcular o PWM com base no erro
async def aplicar_controlador_pi():
    global pwm_value, integral, erro

    # Calcula a velocidade atual com base no ADC e o erro
    velocidade_atual = calcular_velocidade(adc_value)
    erro = vref - velocidade_atual

    # Termos proporcional e integral
    proporcional = Kp * erro
    integral += Ki * erro * SAMPLING_PERIOD

    # Saída do controlador
    output_rpm = proporcional + integral

    # Converte de RPM para PWM e limita entre 0 e 255
    pwm_value = int(output_rpm / 20.377 + 10.9)
    pwm_value = max(0, min(255, pwm_value))

    # Aplica o PWM no pino do motor
    motor.write(pwm_value / 255.0)  # Converte para valor entre 0 e 1

    # Exibe informações para monitoramento
    print(
        f"PWM: {pwm_value} | Velocidade (RPM): {velocidade_atual:.2f} | Erro: {erro:.2f} | Integral: {integral:.2f} | ADC: {adc_value}"
    )


# Função assíncrona para ler o valor do ADC e atualizar o valor global
async def atualizar_adc():
    global adc_value, adc_sum, adc_count

    while True:
        await asyncio.sleep(SAMPLING_PERIOD)
        board.iterate()  # Atualiza as leituras dos pinos

        # Checa se temos 4 leituras acumuladas para calcular a média
        if adc_count >= 4:
            adc_value = (
                adc_sum / adc_count
            ) - 512  # Calcula a média e ajusta o ponto central
            adc_sum = 0  # Reseta a soma
            adc_count = 0  # Reseta a contagem


# Função que executa o controlador PI periodicamente
async def controlador_loop():
    while True:
        await aplicar_controlador_pi()
        await asyncio.sleep(SAMPLING_PERIOD)


# Callback para o valor do ADC
def adc_callback(value):
    global adc_sum, adc_count
    adc_sum += value * 1023  # Converte para escala de 0 a 1023 e acumula
    adc_count += 1


# Conexão com a placa Arduino
board = pyfirmata2.Arduino("COM5")
print("Conectando ao Arduino...")

# Configuração dos pinos
board.digital[ENABLE_PIN].write(1)  # Habilita o driver do motor
direction_pin_1 = board.digital[DIR_PIN_1]
direction_pin_2 = board.digital[DIR_PIN_2]
motor = board.get_pin(f"d:{PWM_PIN}:p")  # PWM no pino 5
adc = board.analog[ADC_PIN]
adc.register_callback(adc_callback)  # Callback para leitura do ADC
adc.enable_reporting()

# Define a direção inicial do motor
set_motor_direction(1)


# Função principal para executar o asyncio
async def main():
    # Inicia tarefas assíncronas para controle PI e atualização do ADC
    await asyncio.gather(controlador_loop(), atualizar_adc())


# Executa o programa por 10 segundos e depois para o motor
try:
    asyncio.run(main())
finally:
    motor.write(0)  # Para o motor
    board.exit()  # Finaliza a conexão com o Arduino
    print("Programa finalizado.")
```

```py
import threading
import time

import pyfirmata2

# Configuração dos pinos do Arduino
ENABLE_PIN = 2
DIR_PIN_1 = 3
DIR_PIN_2 = 4
PWM_PIN = 5
ADC_PIN = 0  # Usado para leitura do ADC no pino A0
SAMPLING_PERIOD = 0.02  # 20 ms

# Coeficientes e constantes de controle
a = 10.168
b = 52.946
vref = 1000  # Setpoint de velocidade desejada em RPM
Kp = 1.69  # Constante Proporcional
Ki = 1.127  # Constante Integral

# Variáveis globais para o controlador PI
pwm_value = 0
integral = 0
erro = 0
adc_value = 0  # Armazena o valor lido do ADC


# Função para calcular a velocidade em RPM com base no valor do ADC
def calcular_velocidade(adc):
    return a * adc + b


# Função para ler o ADC e ajustar o ponto central
def read_adc():
    soma_adc = 0
    for _ in range(4):  # Faz uma média de 4 leituras do ADC
        soma_adc += adc_value
    return soma_adc / 4 - 512  # Ajuste do ponto central do ADC


# Função para definir o sentido de rotação do motor
def set_motor_direction(direction):
    direction_pin_1.write(direction)
    direction_pin_2.write(0 if direction else 1)


# Função do controlador PI para calcular o PWM com base no erro
def aplicar_controlador_pi():
    global pwm_value, integral, erro

    # Lê o valor do ADC e calcula a velocidade atual
    adc_atual = read_adc()
    velocidade_atual = calcular_velocidade(adc_atual)

    # Calcula o erro entre a velocidade desejada e a velocidade atual
    erro = vref - velocidade_atual

    # Termo Proporcional
    proporcional = Kp * erro

    # Termo Integral
    integral += Ki * erro * SAMPLING_PERIOD

    # Calcula o valor de saída em RPM
    output_rpm = proporcional + integral

    # Converte de RPM para PWM e limita de 0 a 255
    pwm_value = int(output_rpm / 20.377 + 10.9)
    pwm_value = max(0, min(255, pwm_value))

    # Aplica o PWM no pino do motor
    motor.write(pwm_value / 255.0)  # Converte para valor entre 0 e 1

    # Exibe informações para monitoramento
    print(
        f"PWM: {pwm_value} | Velocidade (RPM): {velocidade_atual:.2f} | Erro: {erro:.2f} | Integral: {integral:.2f} | ADC: {adc_atual}"
    )


# Função que roda o controlador PI periodicamente (substituindo a interrupção do Timer)
def controlador_loop():
    while True:
        aplicar_controlador_pi()
        time.sleep(SAMPLING_PERIOD)


# Callback para o valor do ADC
def adc_callback(value):
    global adc_value
    adc_value = value * 1023  # Converte para escala de 0 a 1023


# Conexão com a placa Arduino
board = pyfirmata2.Arduino("COM5")
print("Conectando ao Arduino...")

# Configuração dos pinos
board.digital[ENABLE_PIN].write(1)  # Habilita o driver do motor
direction_pin_1 = board.digital[DIR_PIN_1]
direction_pin_2 = board.digital[DIR_PIN_2]
motor = board.get_pin(f"d:{PWM_PIN}:p")  # PWM no pino 5
adc = board.analog[ADC_PIN]
adc.register_callback(adc_callback)  # Callback para leitura do ADC
adc.enable_reporting()

# Define a direção inicial do motor
set_motor_direction(1)


# Função para manter o board.iterate rodando continuamente
def board_iteration_loop():
    while True:
        board.iterate()  # Atualiza as leituras dos pinos
        time.sleep(SAMPLING_PERIOD)  # Tempo de atualização


# Inicia a thread do controlador PI
controlador_thread = threading.Thread(target=controlador_loop, daemon=True)
controlador_thread.start()

# Inicia a thread de iteração do board para atualizar as leituras do ADC
iteration_thread = threading.Thread(target=board_iteration_loop, daemon=True)
iteration_thread.start()

# Mantém o programa rodando por 10 segundos e depois para o motor
time.sleep(20)
motor.write(0)  # Para o motor
print("Motor parado após 10 segundos.")

# Finaliza a conexão com o Arduino
board.exit()
print("Programa finalizado.")

```