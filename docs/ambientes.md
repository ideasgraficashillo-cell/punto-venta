# Ambientes

## DEV
Ambiente local para desarrollo.

### App
- localhost:3000

### Base de datos
- Supabase de desarrollo

### Objetivo
- programar
- probar funciones
- usar datos de prueba

---

## STG
Ambiente de staging para validar antes de producción.

### App
- proyecto Vercel de staging

### Base de datos
- Supabase de staging

### Objetivo
- QA
- validar migraciones
- probar flujos completos

---

## PROD por cliente
Cada cliente tendrá:

- un proyecto Vercel propio
- un proyecto Supabase propio
- variables de entorno propias

Ejemplos:
- pv-ideasgraficas
- pv-cliente-b