# Checklist de nuevo cliente

## 1. Crear base de datos
- [ ] Crear proyecto Supabase
- [ ] Guardar URL
- [ ] Guardar publishable key

## 2. Aplicar estructura
- [ ] Ejecutar migración 001_create_profiles.sql
- [ ] Ejecutar migración 002_profiles_policies.sql
- [ ] Validar tabla profiles

## 3. Crear proyecto web
- [ ] Crear proyecto en Vercel
- [ ] Conectar mismo repositorio
- [ ] Definir nombre del proyecto

## 4. Variables de entorno
- [ ] Configurar NEXT_PUBLIC_SUPABASE_URL
- [ ] Configurar NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Configurar NEXT_PUBLIC_APP_NAME
- [ ] Configurar NEXT_PUBLIC_CLIENT_NAME
- [ ] Configurar NEXT_PUBLIC_SUPPORT_EMAIL
- [ ] Configurar NEXT_PUBLIC_CURRENCY
- [ ] Configurar NEXT_PUBLIC_TIMEZONE
- [ ] Configurar NEXT_PUBLIC_ENABLE_KITCHEN
- [ ] Configurar NEXT_PUBLIC_ENABLE_INVENTORY

## 5. Usuario inicial
- [ ] Crear usuario admin en Authentication
- [ ] Crear perfil en profiles
- [ ] Asignar role = admin
- [ ] Validar is_active = true

## 6. Pruebas
- [ ] Probar /login
- [ ] Probar acceso por rol
- [ ] Validar carga de app
- [ ] Validar conexión a base de datos

## 7. Entrega
- [ ] Compartir URL
- [ ] Compartir accesos
- [ ] Documentar cliente en docs/cliente-template.md
