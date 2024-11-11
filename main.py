import time

import serial

# Configuração da conexão serial (ajuste a porta COM para a correta)
arduino_port = "COM5"  # Exemplo de porta, ajuste conforme necessário
baud_rate = 115200
arduino = serial.Serial(
    arduino_port, baud_rate, timeout=1
)  # Timeout de 1 segundo
time.sleep(2)  # Aguarda a inicialização do Arduino


def enviar_vref(vref):
    """
    Envia o valor de vref para o Arduino pela Serial.
    """
    comando = (
        f"{vref}\n"  # Valor seguido de nova linha para o parseInt do Arduino
    )
    arduino.write(comando.encode())  # Envia o comando em bytes
    print(f"Enviado vref: {vref}")


def ler_monitor_serial():
    """
    Lê e armazena as mensagens do monitor serial do Arduino até detectar a mensagem de parada.
    """
    mensagens = []
    while True:
        if arduino.in_waiting > 0:
            linha = arduino.readline().decode().strip()
            if linha:
                mensagens.append(linha)
                print("Arduino:", linha)  # Exibe cada linha recebida
                # Verifica se a mensagem indica a parada do motor
                if "Motor parado automaticamente por estabilidade." in linha:
                    print("\nMotor foi parado automaticamente.")
                    return mensagens
        else:
            time.sleep(0.1)  # Pausa para evitar consumo excessivo de CPU


def main():
    try:
        while True:
            # Enviar um valor de `vref` baseado na entrada do usuário
            vref = input(
                "Digite o valor de vref para o motor (ou 'sair' para encerrar): "
            )
            if vref.lower() == "sair":
                print("Encerrando o programa.")
                break

            if vref.isdigit():
                enviar_vref(int(vref))
                print("Monitorando Serial do Arduino...\n")

                # Captura todas as mensagens até que o motor pare
                mensagens = ler_monitor_serial()

                # Exibe as mensagens recebidas até o momento da parada
                print("\nResumo das mensagens recebidas:")
                for msg in mensagens:
                    print(msg)
                print("\nO motor foi estabilizado e parado automaticamente.")

    except KeyboardInterrupt:
        print("Encerrando a comunicação.")

    finally:
        arduino.close()
        print("Conexão com Arduino encerrada.")


# Executa o programa principal
if __name__ == "__main__":
    main()
