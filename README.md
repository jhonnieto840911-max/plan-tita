# Planta de almacenamiento y abastecimiento de agua – Pescaito

Modelo conceptual 3D e interactivo para un proyecto académico de Ingeniería del Agua y Desarrollo Sostenible, ubicado en el contexto del barrio Pescaito, Santa Marta, Colombia.

## Qué incluye esta versión

- Escena 3D navegable con Three.js.
- Caseta de control.
- Torre y tanque conceptual de 50.000 litros.
- Estación con cuatro bombas representadas.
- Tuberías conceptuales de succión, impulsión y distribución.
- Control interactivo del nivel del tanque.
- Encendido y apagado visual de cada bomba.
- Panel con datos preliminares para una población de referencia de 17.000 habitantes.

## Cómo ejecutarlo

La forma más sencilla es publicarlo con GitHub Pages:

1. Crea un repositorio en GitHub, por ejemplo `planta-agua-pescaito`.
2. Sube el contenido de esta carpeta a la raíz del repositorio.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda y espera a que GitHub Pages publique el sitio.

También puedes ejecutarlo localmente con un servidor estático, por ejemplo la extensión **Live Server** de Visual Studio Code. No abras `index.html` directamente como archivo, porque los módulos JavaScript pueden ser bloqueados por el navegador.

## Tecnologías

- HTML5 y CSS3
- JavaScript ES Modules
- Three.js 0.160.0 y OrbitControls
- GitHub Pages

## Advertencia de ingeniería

Este repositorio es un prototipo visual y educativo, no un diseño constructivo ni un modelo hidráulico validado. La capacidad de 50.000 L y los datos de población/dotación son parámetros preliminares.

Antes de dimensionar o construir deben verificarse, como mínimo:

- Población actual y horizonte de diseño.
- Dotación y demanda máxima diaria/horaria conforme al RAS vigente.
- Pérdidas reales o admisibles.
- Fuente, disponibilidad y calidad del agua.
- Topografía, cotas y presiones requeridas.
- Caudales, diámetros, velocidades y pérdidas de carga.
- Altura dinámica total y curvas de las bombas.
- Volumen de regulación, reserva y autonomía.
- Calidad sanitaria, desinfección, energía y redundancia.

Las cuatro bombas son una representación gráfica inicial. Su configuración, capacidad y lógica de operación deben definirse mediante cálculos hidráulicos y eléctricos. El valor mostrado en el panel no es telemetría real.

## Estructura

```text
planta-agua-pescaito/
├── index.html
├── style.css
├── README.md
├── js/
│   └── main.js
└── assets/
    ├── modelos/
    └── texturas/
```

## Próximas mejoras sugeridas

1. Incorporar dimensiones reales y materiales estructurales.
2. Añadir curvas de bomba, caudal y altura dinámica.
3. Modelar demanda variable por sectores y horarios.
4. Incorporar alarmas por nivel, presión y fallas.
5. Calibrar el modelo con planos, topografía y datos de operación reales.
