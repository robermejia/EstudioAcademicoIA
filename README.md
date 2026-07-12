# 🎓 Cuestionario Académico sobre IA Generativa y Efectividad del Aprendizaje

Este proyecto es una aplicación web moderna, responsiva y profesional diseñada para evaluar el impacto de las herramientas de Inteligencia Artificial Generativa (como ChatGPT, Gemini y Copilot) en la comprensión de contenidos y la creatividad de los estudiantes.

El sistema sigue una metodología de investigación de tipo **Pretest / Posttest** con una capacitación multimedia intermedia.

---

## ✨ Características Principales

### 📋 Flujo del Participante
1. **Pantalla de Bienvenida:** Introducción académica sobre el propósito del estudio y el tratamiento confidencial de los datos.
2. **Consentimiento Informado:** Aceptación obligatoria de los términos y verificación de mayoría de edad (bloqueo automático para menores de 18 años).
3. **Datos Generales:** Formulario de segmentación demográfica (Edad, Sexo, uso previo de herramientas de IA y herramienta favorita).
4. **Fase PRETEST:** Cuestionario interactivo basado en una **escala Likert (1 a 5)** con 19 preguntas divididas en 5 dimensiones académicas.
5. **Capacitación Intermedia:** Video instructivo integrado (YouTube IFrame API) con monitoreo de reproducción en tiempo real. La segunda fase se desbloquea únicamente tras visualizar al menos el 90% del video.
6. **Fase POSTEST:** Cuestionario de control final de 19 preguntas idénticas para medir el delta de aprendizaje y efectividad.
7. **Pantalla de Resultados:** Mensaje de agradecimiento y generación de un **ID Único de Participación** (`IA-STUDY-XXXXX`).

### 🎛️ Panel de Administración (Dashboard Estadístico)
- **Acceso Protegido:** Login de seguridad enlazado con Firebase Authentication.
  - **Usuario:** `admin@estudio.com`
  - **Contraseña:** `admin1234`
- **Auto-Onboarding:** Si la base de datos es nueva (sin administradores), la interfaz de login permite registrar de forma directa la primera cuenta maestra para evitar bloqueos.
- **KPIs Descriptivos:** Tarjetas con el total de encuestas, edad promedio y porcentajes de uso de IA.
- **Comparación Visual:** Gráficos comparativos de promedios de Pretest vs. Posttest por dimensión (ChatGPT, Gemini, Copilot, Comprensión de contenidos, Creatividad).
- **Control de Respuestas:** Tabla interactiva de participantes con buscador y visor modal para examinar las respuestas individuales pregunta por pregunta.
- **Exportación de Datos:** Descarga de la base de datos completa en formato **CSV codificado en UTF-8 BOM** compatible de manera directa con Excel, SPSS y R.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React.js (Vite)
- **Estilos:** Tailwind CSS v4.0 (Neutros y Azules elegantes con soporte completo de Modo Claro / Oscuro)
- **Animaciones:** Framer Motion (Transiciones fluidas entre preguntas y modales)
- **Base de Datos / Auth:** Firebase (Firestore y Authentication)
- **Iconografía:** Lucide React

---

## 🚀 Instalación y Desarrollo Local

### Requisitos Previos
- Node.js (versión 18 o superior)
- NPM

### Pasos
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/robermejia/EstudioAcademicoIA.git
   cd EstudioAcademicoIA
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173/`.

---

## 🛢️ Configuración de Firebase

La aplicación utiliza Firebase Firestore para la persistencia. La configuración se localiza en `src/lib/firebase.js`.

### Estructura de la Base de Datos
1. **`survey_responses` (Colección):**
   Almacena las participaciones enviadas. Cada documento contiene:
   - `participantId`: ID único asignado.
   - `demographics`: `{ age, gender, hasUsedAI, mostUsedTool }`
   - `pretest`: Respuestas Likert de la fase pretest (1 a 5).
   - `posttest`: Respuestas Likert de la fase posttest (1 a 5).
   - `submittedAt`: Timestamp del servidor.
   - `systemInfo`: Navegador, idioma y resolución del dispositivo.

2. **`admins` (Colección):**
   Almacena los UIDs autorizados para ingresar al panel de control.
   - Si esta colección está vacía en tu Firestore, la aplicación detectará el estado y te mostrará el formulario de **"Crear Administrador Inicial"** al entrar en el **Área del Administrador** en el footer.

---

## ☁️ Despliegue en Render

Para desplegar esta aplicación estática en Render:

1. Ve a tu Dashboard de Render y crea un nuevo **Static Site**.
2. Vincula tu repositorio de GitHub `EstudioAcademicoIA`.
3. Configura los siguientes parámetros de compilación:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Haz clic en **Create Static Site**.
