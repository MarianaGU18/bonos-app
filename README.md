# 📊 Bono App

Aplicación web tipo SaaS para la gestión de activos financieros (bonos).


### Tech Stack
* Fronted en Next.js
* Backend con Spring Boot
* Base de datos relacional
* Orquestación con Docker

###  ¿Qué es este proyecto?
Bono App es una plataforma donde los usuarios pueden:
* Solicitar su registro
* Autenticarse
* Visualizar un dashboard financiero
* Gestionar sus activos (bonos)
* Analizar rendimiento
* Obtener reportes


###  Arquitectura
     bono-app/
    │ 
    ├── bono-ui/ # Frontend (Next.js + MUI) 
    ├── backend/ # API (Spring Boot)
    ├── db/ # Scripts de base de datos 
    ├── docker-compose.yml


## Stack Tecnología
###  Frontend
* Next.js 16 (App Router)
* Material UI (MUI)

### Backend
* Spring Boot
* REST API
* Maven

### Base de Datos
* MySQL

### DevOps
* Docker

# Instalación
1. Clonar repositorio
2. Levantar todo con Docker
docker-compose up --build

3. Acceder a la aplicacion
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080


# Estado del proyecto

Este proyecto se encuentra actualmente en desarrollo:

- Frontend en construcción
- Backend en desarrollo
- Integración completa en progreso

## Próximas mejoras

* Completar el desarrollo del frontend (UI y flujo de usuario)
* Finalizar la implementación del backend (lógica y endpoints)
* Implementar autenticación segura con JWT
* Conectar completamente el frontend con el backend
* Construir un dashboard dinámico con datos reales
* Integrar gráficas para visualización de rendimiento
* Desplegar la aplicación en la nube (entorno de producción)
