# Migraciones

## Regla principal
Todo cambio estructural de base de datos debe quedar en un archivo SQL versionado.

## Ubicación
supabase/migrations/

## Convención
- 001_nombre.sql
- 002_nombre.sql
- 003_nombre.sql

## Seeds
Van en:
supabase/seeds/

## Flujo
1. Crear o modificar en dev
2. Guardar SQL en migración
3. Probar en stg
4. Aplicar en producción