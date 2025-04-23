# Instrucciones de Despliegue: Portfolio Analyzer

Este documento proporciona instrucciones detalladas para desplegar la aplicación Portfolio Analyzer tanto en desarrollo como en producción.

## Estructura del Proyecto

El proyecto ha sido dividido en dos repositorios separados:
- `portfolio-analyzer-frontend`: Aplicación Next.js para el frontend
- `portfolio-analyzer-backend`: API FastAPI para el backend

## Pasos para el Despliegue

### 1. Despliegue del Backend (Railway, Render, o similar)

1. **Crear una cuenta** en [Railway](https://railway.app) (recomendado), [Render](https://render.com) u otro servicio similar.

2. **Conectar el repositorio** `portfolio-analyzer-backend` desde GitHub:
   - En Railway, haz clic en "New Project" → "Deploy from GitHub repo"
   - Selecciona el repositorio `portfolio-analyzer-backend`

3. **Configurar el despliegue**:
   - **Railway**: 
     - Se detectará automáticamente como Python
     - Define el comando de inicio: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Render**:
     - Selecciona "Web Service"
     - Runtime: Python 3.9 o superior
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`

4. **Obtener la URL del backend** una vez completado el despliegue:
   - Algo como: `https://portfolio-analyzer-backend-xxxx.railway.app`
   - Esta URL la necesitarás para configurar el frontend

### 2. Despliegue del Frontend (Vercel)

1. **Crear una cuenta** en [Vercel](https://vercel.com) si aún no tienes una.

2. **Conectar el repositorio** `portfolio-analyzer-frontend` desde GitHub:
   - En Vercel, haz clic en "Add New" → "Project"
   - Selecciona el repositorio `portfolio-analyzer-frontend`

3. **Configurar el despliegue**:
   - Framework Preset: Next.js
   - Build and Output Settings: (usar valores predeterminados)
   - Root Directory: `./` (o déjalo en blanco)
   - Variables de entorno:
     - Añade una nueva variable: `NEXT_PUBLIC_API_URL` = URL completa del backend (del paso 1.4)

4. **Desplegar** haciendo clic en "Deploy".

5. **Verificar el despliegue** visitando la URL proporcionada por Vercel.

### 3. Configuración de CORS (si es necesario)

Si experimentas problemas de CORS después del despliegue:

1. Actualiza el archivo `api.py` en el repositorio backend para incluir la URL específica de tu frontend:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://tu-url-de-vercel.vercel.app"  # Actualiza esto
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. Despliega nuevamente el backend.

## Desarrollo Local

### Frontend
```bash
cd portfolio-analyzer-frontend
npm install
npm run dev
```

### Backend
```bash
cd portfolio-analyzer-backend
pip install -r requirements.txt
uvicorn api:app --reload
```

## Solución de Problemas

1. **Error de CORS**: Verifica que la URL del frontend esté correctamente configurada en el backend.
2. **Problemas con gráficos**: Asegúrate de que el directorio `static/plots` exista y tenga permisos de escritura.
3. **Error de conexión**: Verifica que la variable de entorno `NEXT_PUBLIC_API_URL` esté configurada correctamente.

Si persisten los problemas, revisa los logs de despliegue en Railway/Render y Vercel para obtener más información. 