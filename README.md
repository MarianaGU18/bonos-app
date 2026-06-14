# 📊 NeoInvest (Bono App)

Aplicación web tipo SaaS diseñada para la gestión y simulación de activos financieros, enfocada en instrumentos de renta fija como CETES y Bonos.

🚀 **Demo en vivo:** [https://bonos-app-mu.vercel.app/](https://bonos-app-mu.vercel.app/)

---

### Tech Stack

- **Frontend:** Next.js 14/15 (App Router) + Material UI (MUI).
- **Backend:** Spring Boot 3 (Java) + Spring Security + JWT.
- **Base de Datos:** MySQL 8 (Persistencia atómica de activos y transacciones).
- **Infraestructura:** Docker & Docker Compose.

---

### 🚀 Funcionalidades Principales

NeoInvest es una plataforma donde los usuarios pueden:

- **Autenticación y Perfil:** Registro con validación de mayoría de edad, login seguro (JWT) y gestión de perfil de usuario con persistencia en `localStorage` (compatible con modo incógnito).
- **Motor Financiero:** Cálculo preciso de rendimientos (CETES/Bonos) basado en modelos reales, incluyendo proyecciones de interés, retención de ISR (0.90% anualizado) y gestión de remanentes.
- **Módulo de Bonos:** Gestión de activos de renta fija a largo plazo (Tasa Fija) con seguimiento de cupones y vencimientos.
- **Gestión de Portafolio:** Creación automática de portafolio al registro. Visualización dinámica del balance total, efectivo disponible e historial de movimientos.
- **Análisis Visual:** Gráficas interactivas para analizar la composición del portafolio y el crecimiento proyectado de las inversiones.
- **Operaciones de Mercado:**
  - Depósitos de efectivo al portafolio.
  - Compra de títulos con validación de fondos y actualización de balances atómica (Transactional).
  - Venta anticipada con cálculo de **interés devengado** y valuación a mercado.
  - Estimación de venta en tiempo real sin compromiso de ejecución.
- **Perfil de Usuario:** Gestión de información personal y seguridad.

---

### 🏗️ Arquitectura del Proyecto

```text
     bono-app/
    │
    ├── bono-ui/      # Frontend (Next.js + Context API para gestión de estado)
    ├── backend/      # API RESTful (Spring Boot + JPA Hibernate)
    ├── db/           # Scripts de inicialización de base de datos
    └── docker-compose.yml
```

# Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/MarianaGU18/bonos-app.git
   ```

2. **Levantar el entorno con Docker:**

   ```bash
   docker-compose up --build
   ```

3. **Acceso:**

- **Frontend Local:** http://localhost:3000
- **API Backend Local:** http://localhost:8080/api/v1
- **API Producción:** https://bonos-app-production.up.railway.app/api/v1

# Estado del proyecto

✅ **Finalizado / Implementado:**

- 🏗️ **Infraestructura:** Dockerización completa y entorno de producción en Railway/Vercel.
- 🔐 **Seguridad:** JWT, encriptación BCrypt y sistema robusto de manejo de errores (401/403/409).
- 🧮 **Lógica Financiera:** Motor de cálculo de precios, ISR fiscal y venta anticipada con interés devengado.
- 💼 **Portafolio:** Gestión transaccional de activos, depósitos y actualización de balances en tiempo real.
- 📊 **Visualización:** Dashboard con gráficas dinámicas de composición de activos.
- 📄 **UX/UI:** Flujo completo de usuario, páginas de soporte (About/Contact) y Dashboard funcional.

⏳ **En Desarrollo / Próximas mejoras:**

- Generación de reportes en PDF de los movimientos del portafolio.
- Optimización de la UI para modo oscuro.
- Notificaciones automáticas para vencimientos de activos.
