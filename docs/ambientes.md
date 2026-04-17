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

---

## Estrategia de ramas

### master
Rama estable para producción.

### develop
Rama de integración para pruebas y staging.

### feature/*
Ramas temporales para desarrollo de módulos nuevos.

Ejemplos:
- feature/login
- feature/productos
- feature/inventario
- feature/ventas

## Flujo de trabajo
1. Crear rama desde develop
2. Desarrollar funcionalidad
3. Probar localmente
4. Integrar a develop
5. Validar en staging
6. Pasar a master
7. Desplegar a producción por cliente
