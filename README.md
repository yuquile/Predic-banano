# 🍌 BananoSys

![BananoSys Banner](<!-- Agregar screenshot aquí -->)

**BananoSys** es una aplicación web integral de gestión agrícola diseñada específicamente para el cultivo de banano. Esta plataforma busca solucionar los problemas de seguimiento, análisis y optimización de recursos a los que se enfrentan los productores bananeros, ofreciendo un panel de control avanzado que combina gestión de datos, predicciones de IA y visualizaciones intuitivas. Está pensada para agricultores, administradores de fincas y analistas agrícolas que buscan maximizar su rendimiento y tomar decisiones basadas en datos.

## ✨ Características Principales

*   **🔐 Autenticación Segura:** Sistema de login robusto implementado con Firebase (soporte para Google Sign-In).
*   **🧠 Motor de Recomendaciones:** Recomendaciones rápidas y automáticas generadas a partir de reglas y del estado actual de la finca.
*   **📊 Visualización de Datos Avanzada:** Gráficos y análisis detallados generados con ECharts para facilitar la interpretación del rendimiento, exportaciones y costos.
*   **🎨 Diseño "BananoSys Soft Green":** Interfaz de usuario moderna y premium que emplea técnicas de *glassmorphism*. La paleta de colores destaca con tonos verdes elegantes (#164e3b y #5eead4) y tipografía "Outfit" para una legibilidad y estética superiores.
*   **📅 Gestión Integral:** Módulos dedicados para inventario, costos, exportaciones, control de plagas y calendario agrícola.

## 🛠️ Stack Tecnológico

*   **Frontend:** HTML5, CSS3 (Vanilla con diseño Soft Green/Glassmorphism), JavaScript (ES6+).
*   **Librerías de Visualización:** [ECharts](https://echarts.apache.org/) para gráficos interactivos.
*   **Backend & Cloud Services:** [Firebase](https://firebase.google.com/) (Authentication, Hosting/Configuración).
*   **Lógica de Recomendaciones:** Reglas internas para generar predicciones y recomendaciones.

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura modular y organizada:

```text
📦 BananoSys
 ┣ 📂 assets/              # Imágenes, íconos y recursos estáticos
 ┣ 📂 css/                 # Hojas de estilo
 ┃ ┣ 📂 base/              # Variables CSS y estilos globales
 ┃ ┣ 📂 components/        # Estilos para componentes reutilizables (botones, tarjetas)
 ┃ ┗ 📂 pages/             # Estilos específicos para cada vista (ej. costo.css, dashboard.css)
 ┣ 📂 js/                  # Lógica de la aplicación
 ┃ ┣ 📂 core/              # Configuración principal (firebase.js, auth.js)
 ┃ ┣ 📂 ia/                # Módulo de Recomendaciones (contexto-finca.js, reglas-motor.js, recomendaciones-ia-ui.js)
 ┃ ┣ 📂 pages/             # Controladores para cada página HTML
 ┃ ┗ 📂 services/          # Servicios adicionales y conexión a APIs
 ┣ 📂 pages/               # Vistas principales de la aplicación (HTML)
 ┃ ┣ 📜 dashboard.html
 ┃ ┣ 📜 inventario.html
 ┃ ┣ 📜 exportaciones.html
 ┃ ┣ 📜 control-plagas.html
 ┃ ┗ 📜 ...
 ┣ 📜 firebase.json        # Configuración de Firebase Hosting y reglas
 ┣ 📜 index.html           # Punto de entrada / Landing de la aplicación
 ┗ 📜 README.md            # Documentación del proyecto
```

## 📋 Requisitos Previos

Para ejecutar este proyecto en tu entorno local, asegúrate de contar con:

1.  **Node.js y npm** instalados (opcional para herramientas de desarrollo locales, aunque el frontend es estático).
2.  **Cuenta de Firebase:** Necesaria para configurar la autenticación.
3.  **Servidor Web Local:** Como *Live Server* (extensión de VS Code) o `http-server` de npm.

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

Abre tu terminal y ejecuta:

```bash
git clone https://github.com/yuquile/BananoSys.git
cd BananoSys
```
*(Nota: Reemplaza la URL con la ruta real de tu repositorio si es diferente)*

### 2. Configuración de Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
2. Habilita **Authentication** y activa el método de inicio de sesión de Google (u otros de tu preferencia).
3. Registra una aplicación web en tu proyecto de Firebase y obtén el objeto de configuración (`firebaseConfig`).
4. Abre el archivo `js/core/firebase.js` (o donde se inicialice Firebase) y reemplaza la configuración existente con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 3. Levantar el Proyecto Localmente

Al ser una aplicación basada fuertemente en HTML/JS/CSS estáticos de lado del cliente, puedes servirla fácilmente:

**Opción A: Usando Live Server (Recomendado)**
*   Abre la carpeta del proyecto en Visual Studio Code.
*   Instala la extensión "Live Server".
*   Haz clic derecho en `index.html` y selecciona "Open with Live Server".

**Opción B: Usando `npx http-server`**
```bash
npx http-server . -p 8080
```
Luego, abre tu navegador en `http://localhost:8080`.

## 📸 Capturas de Pantalla

<!-- Agregar screenshot aquí -->
*Vista del Dashboard Principal*

<!-- Agregar screenshot aquí -->
*Módulo de Recomendaciones*

## 🗺️ Roadmap (Funcionalidades Futuras)

- [ ] Integración con sensores IoT en el campo para captura de datos en tiempo real.
- [ ] Módulo avanzado de predicción meteorológica específica para la zona de cultivo.
- [ ] Exportación automática de reportes en PDF y Excel.
- [ ] Modo offline mediante Service Workers (PWA).

## 📄 Licencia

Este proyecto está bajo la licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## ✍️ Autor

**yuquile** - *Desarrollo Principal*
- GitHub: [yuquile](https://github.com/yuquile)
