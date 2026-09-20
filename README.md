# 🦉 Ambiente Virtual de Aprendizaje (AVA) — I.E. Ciudad de Tunja

[![Producción en Vivo](https://img.shields.io/badge/Producci%C3%B3n-ava.ieciudaddetunja.com-00A896?style=flat-square&logo=google-chrome)](https://ava.ieciudaddetunja.com)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start%20(SSR)-FF4154?style=flat-square)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![PM2](https://img.shields.io/badge/PM2-Online%20(Node.js)-2B037A?style=flat-square&logo=pm2)](https://pm2.keymetrics.io)

Plataforma educativa interactiva desarrollada para la **Institución Educativa Ciudad de Tunja (Cartagena de Indias, Colombia)**, sede Escilda Medina Pacheco, orientada a estudiantes de **Grado 3° de Básica Primaria**. 

El sistema alberga dos proyectos pedagógicos complementarios:
1. **Exploradores de Datos:** Fortalecimiento del pensamiento aleatorio, estadística básica y probabilidad (DBA 10 y 11 de Matemáticas).
2. **Aventura Lectora con Inteligencia Artificial:** Fortalecimiento de la comprensión lectora (niveles literal, inferencial y crítico) mediante andamiaje socrático adaptativo con IA, desarrollado en el marco de la Maestría en Educación Mediada por las TIC de la **Universidad Tecnológica de Bolívar (UTB)**.

---

## 🌐 Enlaces en Producción

- **Portal General (Exploradores de Datos - Estadística):** [https://ava.ieciudaddetunja.com/](https://ava.ieciudaddetunja.com/)
- **Portal de Comprensión Lectora con IA:** [https://ava.ieciudaddetunja.com/lectura](https://ava.ieciudaddetunja.com/lectura)
- **Diagnóstico Automatizado de Lectura:** [https://ava.ieciudaddetunja.com/diagnostico-lectura](https://ava.ieciudaddetunja.com/diagnostico-lectura)
- **Lectura Adaptativa Multinivel:** [https://ava.ieciudaddetunja.com/lectura-adaptativa](https://ava.ieciudaddetunja.com/lectura-adaptativa)
- **Tutora Socrática con IA (Bú):** [https://ava.ieciudaddetunja.com/tutor-ia](https://ava.ieciudaddetunja.com/tutor-ia)
- **Evaluación Formativa y Certificación:** [https://ava.ieciudaddetunja.com/evaluacion-formativa](https://ava.ieciudaddetunja.com/evaluacion-formativa)
- **Documentación Curricular UTB (Rúbrica 5.0):** [https://ava.ieciudaddetunja.com/proyecto-lectura](https://ava.ieciudaddetunja.com/proyecto-lectura)

---

## 📑 Documentación Oficial en PDF para Descarga

En la carpeta `documentacion/` y publicados en la plataforma en `public/docs/`:
- 🎓 **[Dossier de Sustentación Técnica y Pedagógica (UTB)](https://ava.ieciudaddetunja.com/docs/Dossier_Sustentacion_Docente_UTB_AVA_Lectura.pdf):** 6 páginas con justificación curricular, marco ético UNESCO 2023, matriz de cumplimiento de la rúbrica (5.0/5.0) y guión de sustentación para el profesor.
- 🏫 **[Manual Institucional de Implementación (I.E. Ciudad de Tunja)](https://ava.ieciudaddetunja.com/docs/Manual_Institucional_Implementacion_Colegio_Ciudad_de_Tunja.pdf):** 4 páginas con guía didáctica de 4 sesiones para el maestro de primaria, orientaciones para familias y ficha de registro imprimible para el cuaderno.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu computadora:
- **Node.js:** Versión 18.x o 20.x LTS (Recomendado Node.js 20 o superior).
- **npm:** Incluido con Node.js (o `pnpm` / `yarn`).
- **Git:** Para clonar y gestionar versiones.
- **Editor recomendado:** [Google Antigravity IDE](https://antigravity.google) o VS Code.

---

## 💻 Instalación y Ejecución Local

### 1. Clonar el repositorio
Si eres colaborador en GitHub (por ejemplo, el profesor con su propia cuenta):
```bash
git clone https://github.com/santequera1/b-s-data-explorers.git
cd b-s-data-explorers
```

### 2. Configurar tu identidad en Git (si usas otra cuenta de GitHub)
```bash
git config user.name "Tu Nombre"
git config user.email "tu-correo@ejemplo.com"
```

### 3. Instalar las dependencias
```bash
npm install
```

### 4. Iniciar el servidor de desarrollo local
```bash
npm run dev
```
Abre tu navegador en `http://localhost:3000` (o la dirección que indique la consola). Podrás ver los cambios en tiempo real con Hot Module Replacement (HMR).

### 5. Compilar para producción localmente
```bash
npm run build
```
Esto genera los archivos optimizados en `.output/`. Para probar el servidor de producción local:
```bash
node .output/server/index.mjs
```

---

## 🤖 Guía para Usar con Google Antigravity (en otra PC o del Profesor)

Si abres este proyecto en otra computadora utilizando **Antigravity**, ten en cuenta estas pautas clave:

1. **Apertura del espacio de trabajo:**
   Abre la carpeta raíz del proyecto en Antigravity. El agente detectará automáticamente el archivo `AGENTS.md`, las rutas en `src/routes/` y las funciones de servidor.
   
2. **⚠️ Regla Fundamental de Lovable (MUY IMPORTANTE):**
   > Este repositorio está vinculado con [Lovable.dev](https://lovable.dev).
   > - **NUNCA** reescribas el historial de Git publicado (`git push --force`, `git rebase` o `git commit --amend` sobre commits ya subidos).
   > - Realiza siempre **commits regulares hacia adelante** (`git commit -m "..."` y `git push origin main`).
   > - Mantén la rama `main` en un estado funcional para que la sincronización con Lovable y el despliegue al servidor VPS funcionen sin contratiempos.

3. **Preset de Nitro para Despliegue:**
   En `vite.config.ts`, el preset de Nitro está fijado como `node-server`:
   ```ts
   process.env.NITRO_PRESET = process.env.NITRO_PRESET || "node-server";
   ```
   No cambies este valor a `cloudflare-module`, ya que el servidor de producción es un VPS Linux con PM2 y Node.js.

---

## 📁 Estructura del Proyecto

```text
colegio_ciudad_de_tunja/
├── documentacion/                     # Documentos PDF oficiales
│   ├── Dossier_Sustentacion_Docente_UTB_AVA_Lectura.pdf
│   └── Manual_Institucional_Implementacion_Colegio_Ciudad_de_Tunja.pdf
├── public/
│   ├── docs/                          # PDFs servidos directamente en la web
│   └── favicon.png, og-image.png, etc.
├── src/
│   ├── assets/
│   │   └── bu-mascot.png              # Ilustración oficial de la lechuza Bú
│   ├── components/
│   │   ├── BuMascot.tsx               # Componente de la mascota con animación
│   │   ├── AutomatedQuiz.tsx          # Componente reutilizable de cuestionarios
│   │   └── ui/                        # Componentes UI (botones, tarjetas, etc.)
│   ├── lib/
│   │   ├── api.ts                     # Funciones de servidor (Server Functions TanStack)
│   │   ├── ia-tutor.ts                # Motor de tutoría socrática (Gemini + Heurístico)
│   │   ├── lectura-data.ts            # Textos adaptativos, glosario y banco de preguntas
│   │   ├── diagnostico-data.ts        # Reactivos del diagnóstico de estadística
│   │   └── store.ts                   # Gestión del estado del estudiante
│   └── routes/
│       ├── __root.tsx                 # Envoltorio raíz con layout y metadatos
│       ├── index.tsx                  # Home: Exploradores de Datos (Estadística)
│       ├── lectura.tsx                # Home: Aventura Lectora con IA
│       ├── diagnostico-lectura.tsx    # Fase 1: Diagnóstico inicial de comprensión
│       ├── lectura-adaptativa.tsx     # Fase 2: Lectura multinivel contextualizada
│       ├── tutor-ia.tsx               # Fase 3: Práctica guiada con Bú (Tutor Socrático)
│       ├── evaluacion-formativa.tsx   # Fase 4: Evaluación final y diploma digital
│       ├── proyecto.tsx               # Documentación curricular de Estadística (ADDIE)
│       ├── proyecto-lectura.tsx       # Documentación curricular de Lectura (UTB - Rúbrica 5.0)
│       ├── panel.tsx                  # Panel de seguimiento y analítica docente
│       ├── ingresar.tsx               # Acceso de usuarios
│       ├── juegos.tsx                 # Centro de juegos matemáticos
│       └── modulo-1.tsx, etc.         # Módulos de estadística y retos DBA 11
├── AGENTS.md                          # Reglas para agentes de IA (Lovable)
├── DEPLOY_Y_CREDENCIALES_PRIVADO.md   # [PRIVADO] Guía de claves SSH y despliegue (IGNORADO EN GIT)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Cómo Modificar los Contenidos del AVA

### 1. Agregar o cambiar preguntas del examen diagnóstico de lectura
Edita el archivo `src/lib/lectura-data.ts`. Busca la constante `preguntasDiagnosticoLectura`. Cada pregunta tiene:
- `id`: Identificador único.
- `dimension`: `'literal' | 'inferencial' | 'critico'`.
- `pregunta`: Texto del reactivo.
- `opciones`: Array de 4 opciones con texto y explicación pedagógica (`explicacion`).
- `correcta`: Índice de la respuesta correcta (0 a 3).

### 2. Modificar el cuento o agregar niveles de lectura
Edita `src/lib/lectura-data.ts`. Busca el objeto `historiaManglar`:
- Modifica los párrafos en `niveles.explorador`, `niveles.aventurero` o `niveles.maestro`.
- Agrega o edita términos en el `glosario` (palabra, significado infantil y ejemplo local).

### 3. Modificar las pistas o el comportamiento de la Tutora de IA (Bú)
Edita `src/lib/ia-tutor.ts`. Encontrarás:
- `evaluarRespuestaLectura()`: La lógica que analiza la redacción del niño.
- Palabras clave requeridas por reto.
- Banco de pistas progresivas socráticas (Pista 1, Pista 2, Pista 3).
- Mensajes de felicitación y profundización crítica.

### 4. Modificar rutas o páginas existentes
Cada archivo dentro de `src/routes/` corresponde automáticamente a una URL gracias a **TanStack Router**:
- `src/routes/lectura.tsx` → `/lectura`
- `src/routes/tutor-ia.tsx` → `/tutor-ia`
- Puedes agregar nuevas rutas simplemente creando un nuevo archivo `.tsx` dentro de `src/routes/`.

---

## 🚢 Despliegue en Producción (VPS)

El proyecto está en producción en un servidor VPS Ubuntu con reverse proxy Nginx y PM2 bajo el dominio `https://ava.ieciudaddetunja.com`.

> **🔒 INFORMACIÓN DE CLAVES Y ACCESO SSH:**
> Por estrictas razones de seguridad y privacidad, **las claves SSH, la contraseña del servidor y los comandos de acceso directo NO se publican en este repositorio de GitHub**.
>
> Revisa en tu copia local el archivo privado:
> 📄 **`DEPLOY_Y_CREDENCIALES_PRIVADO.md`** *(archivo local confidencial)*.
>
> Dicho documento contiene:
> - IP del servidor VPS, usuario y contraseña SSH.
> - Comandos para hacer `git pull`, `npm run build` y `pm2 restart ava-exploradores`.
> - Script en Python para despliegue automatizado en un clic.
> - Procedimiento de restauración en caso de emergencia (rollback).

---

## 👥 Equipo y Créditos Institucionales

### Institución Educativa Ciudad de Tunja
- **Sede:** Escilda Medina Pacheco (Barrio María Auxiliadora, Camino del Medio · Cartagena de Indias).
- **Comunidad:** Más de 1.800 estudiantes · Calendario A.

### Universidad Tecnológica de Bolívar (UTB)
- **Programa:** Maestría en Educación Mediada por las TIC.
- **Módulo:** Inteligencia Artificial para Educación (1032-202660).
- **Docente Tutor:** Mg. Javier Enrique Luna Marzola.
- **Equipo Investigador y Desarrollador:**
  - Sandra Jiménez Jiménez
  - Alexis Cogollo Orozco
  - Katerine Barrios Alcázar
  - Eliceth Johana Dávila Amarís
  - Ladys Zamorano Imbett

---

*Desarrollado con dedicación para los niños y docentes de la I.E. Ciudad de Tunja — Septiembre 2026.*
