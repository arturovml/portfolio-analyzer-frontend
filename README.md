# Portfolio Analyzer Frontend

Este repositorio contiene el frontend para la aplicación de análisis de portafolios financieros.

## Despliegue en Vercel

### Prerrequisitos
- Una cuenta en [Vercel](https://vercel.com)
- El backend desplegado en algún servicio como Railway, Render o Fly.io

### Pasos para el despliegue
1. Conecta este repositorio a tu cuenta de Vercel
2. Durante la configuración de despliegue:
   - Framework preestablecido: Next.js
   - Directorio raíz: `./`
   - Comando de construcción: `npm run build`
   - Directorio de salida: `.next`
   - Variables de entorno: Agrega `NEXT_PUBLIC_API_URL` con el URL de tu API backend

### Variables de entorno
- `NEXT_PUBLIC_API_URL`: URL completa del backend (ej. 'https://mi-api-portfolio.railway.app')

## Desarrollo local
```bash
# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Nota importante
Asegúrate de que el backend esté configurado con el dominio de Vercel en las configuraciones CORS. 