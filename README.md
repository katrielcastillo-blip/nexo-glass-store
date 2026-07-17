# Nexo Glass Store

Ecommerce demostrativo construido con Next.js App Router, TypeScript y Tailwind CSS. Incluye catálogo en memoria, carrito en estado React, checkout simulado, planificador de entregas por vecino más cercano y asistente de compras con Gemini.

## Desarrollo local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. No se requieren variables de entorno: la API key de Gemini de Google AI Studio se ingresa en Configuración y solo vive en el estado React de la pestaña.

## Verificación

```bash
npm run typecheck
npm run build
```

## Despliegue en Vercel

### GitHub + vercel.com

1. Crea un repositorio vacío en GitHub.
2. Desde esta carpeta ejecuta:

```bash
git init
git add .
git commit -m "Nexo ecommerce inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

3. Entra en `https://vercel.com/new` e inicia sesión.
4. Importa el repositorio de GitHub.
5. Vercel detectará Next.js. Conserva los valores predeterminados y selecciona **Deploy**.
6. No agregues variables de entorno. Cada usuario introduce su key de Gemini desde la interfaz.

### Vercel CLI

Desde la carpeta del proyecto:

```bash
npx vercel
```

Acepta el inicio de sesión y las opciones predeterminadas. Para publicar la versión de producción:

```bash
npx vercel --prod
```
