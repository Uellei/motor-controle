### Código
> pkg load control
```matlab
K = 1.875
T = 0.15
L = 0.03
Kp = T/(K*L)
Ti = L/0.3

g = tf(K, [T 1])
gp = g*atraso_transporte
gc = Kp*tf([1 1/Ti], [1 0])

FTMA = gc*gp
FTMF = feedback(FTMA, 1)

pole(FTMF)
% -14.482 + 42.473i
% -14.482 - 42.473i
% -11.036 +      0i
% Sinal estável, todos no semiplano esquerdo

step(FTMF, 1)
t = 0:0.01:1;
velocidade = step(FTMF, t);
plot(t, velocidade)

velocidade_maxima = max(velocidade)
size(velocidade) % Analisar
velocidade_ss = velocidade(101)
sobressinal_percentual = (velocidade_maxima - velocidade_ss)/velocidade_ss * 100
```

Sobressinal maior que 10%, oque fazer?
```matlab
function controle_PID(K, T, L, Kp, Ti)
  % Definindo a função de transferência da planta
  g = tf(K, [T 1]);
  
  % Definindo o atraso de transporte como exponencial ou aproximado (se preferir)
  % Aqui usamos uma aproximação de Pade de primeira ordem
  atraso_transporte = tf([-L/2 1], [L/2 1]);
  
  % Função de transferência da planta com atraso
  gp = g * atraso_transporte;
  
  % Função de transferência do controlador PID
  gc = Kp * tf([1 1/Ti], [1 0]);
  
  % Malha aberta (FTMA) e malha fechada (FTMF)
  FTMA = gc * gp;
  FTMF = feedback(FTMA, 1);
  
  % Polos do sistema em malha fechada
  disp("Polos do sistema em malha fechada:");
  disp(pole(FTMF));

   % Resposta ao degrau do sistema em malha fechada
  t = 0:0.01:1;
  velocidade = step(FTMF, t);

  % Soberssinal
  velocidade_maxima = max(velocidade)
  disp("Sobressinal");
  disp(sobressinal_percentual = (velocidade_maxima - 1)/1 * 100);
  
 
  
  % Plotando a resposta
  plot(t, velocidade);
  title("Resposta ao Degrau do Sistema em Malha Fechada");
  xlabel("Tempo (s)");
  ylabel("Velocidade");
  grid on;
end


```

Achamos os valores usando ziggler/Nichols
K = 1.875
L = 0.03
T = 0.15
Kp = 2.667
Ti = 0.1

Sobressinal ficou em 49%, oque não atende a especificação de menor que 10%.
Por tentativa, diminuimos o valor de Kp, até chegar em 0.9, onde o sobressinal foi de 9%, que atende a especificação

> Problema: Quanto menor o Kp, menor a resposta instantânea, mais lenta, pior