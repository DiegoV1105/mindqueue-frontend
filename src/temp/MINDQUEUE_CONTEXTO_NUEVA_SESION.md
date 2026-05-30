# MindQueue — Contexto Completo para Nueva Sesión
> Pega este archivo al inicio de cualquier nueva conversación con Claude.
> Contiene TODO lo decidido hasta ahora. No necesitas explicar nada adicional.

---

## ¿QUÉ ES MINDQUEUE?

MindQueue es una plataforma web de salud mental que conecta psicólogos independientes con sus pacientes. El diferencial no es ser un directorio de psicólogos (eso ya existe), sino ser **la herramienta de trabajo del psicólogo** y el **puente de continuidad emocional entre sesiones**.

**Problema que resuelve:**
- El paciente se queda solo entre sesiones — no hay seguimiento
- El psicólogo llega a cada sesión sin saber qué pasó esa semana
- Los primeros 15-20 min de sesión se pierden reconstruyendo la semana
- Los psicólogos independientes gestionan todo por WhatsApp + Zoom, sin sistema

**Cómo funciona:**
1. El paciente llena un diario emocional diario en 2 minutos (ánimo, estrés, sueño, energía, situación del día)
2. El backend procesa esos datos y genera automáticamente un resumen semanal con patrones detectados
3. El psicólogo recibe ese resumen antes de la sesión y llega preparado
4. El psicólogo tiene un dashboard donde ve el estado de TODOS sus pacientes ordenado por urgencia (urgent / attention / normal)

---

## QUIÉN LO CONSTRUYE

- **Desarrollador:** Heiderson Jhonatan Mora Alfaro
- **Programa:** Análisis y Desarrollo de Software (ADSO) — SENA, Ficha 3388998
- **Instructor:** Ing. Christian Andrés Barajas Vásquez
- **Estado actual:** Arquitectura base creada, base de datos configurada en Supabase, backend corriendo en localhost

---

## DECISIONES TÉCNICAS YA TOMADAS (NO CAMBIAR)

### Stack definido
| Capa | Tecnología | Razón |
|------|-----------|-------|
| Backend | Python + FastAPI | Async, Pydantic, Swagger automático |
| Base de datos | Supabase (PostgreSQL) | Gestionado, Auth incluido, Realtime, RLS |
| Frontend | React + Vite + TailwindCSS | PWA responsive |
| Estado global | Zustand | Simple, sin boilerplate |
| Fetching | TanStack Query v5 | Caché, sincronización automática |
| Formularios | React Hook Form + Zod | Validación tipada |
| Gráficas | Recharts | Integración React nativa |
| Animaciones | Framer Motion | Fluidas, profesionales |
| Deploy backend | Render.com (free tier) | |
| Deploy frontend | Vercel (free tier) | |
| Costo total | $0 | |

### Repositorios separados
- `mindqueue-backend` → Python + FastAPI
- `mindqueue-frontend` → React + Vite

### NO hay IA externa en la beta
- El análisis se hace con **pandas + numpy + scipy** (regresión lineal, detección de patrones)
- Los mensajes motivadores usan **plantillas contextuales** (35+ variantes, 9 categorías)
- Cuando haya presupuesto: Claude API reemplaza solo 2 funciones (mensaje motivador + texto narrativo del resumen)

---

## BASE DE DATOS — TABLAS CREADAS EN SUPABASE

```
profiles              → usuarios (paciente / psicólogo), extiende auth.users
therapist_profiles    → datos clínicos del psicólogo (licencia, especialidades, tarifas)
patient_therapist     → relación paciente ↔ psicólogo
journal_entries       → entradas diarias del paciente (1 por día, unique constraint)
weekly_summaries      → resúmenes generados automáticamente al completar 5+ días
sessions              → sesiones agendadas con control de conflictos
notifications         → notificaciones en tiempo real
therapist_availability → horario de trabajo del psicólogo
availability_blocks   → bloqueos manuales (vacaciones, reuniones)
```

**RLS activado en todas las tablas.** El paciente solo ve sus datos. El psicólogo solo ve los de sus pacientes asignados. Las notas clínicas son privadas — solo el psicólogo las puede leer.

**Trigger creado:** Al registrarse un usuario en Supabase Auth, se crea automáticamente su perfil en `profiles` con el rol correcto.

---

## ARQUITECTURA DEL BACKEND

```
mindqueue-backend/
├── app/
│   ├── main.py           ← FastAPI app, CORS, routers
│   ├── config.py         ← Settings con pydantic-settings
│   ├── database.py       ← Cliente Supabase (service key)
│   ├── dependencies.py   ← get_current_user, require_therapist, require_patient
│   ├── routers/
│   │   ├── auth.py       ← register, login, logout, refresh, /me
│   │   ├── journal.py    ← CRUD diario emocional + racha
│   │   ├── sessions.py   ← agendamiento, disponibilidad, bloqueos, pacientes
│   │   └── analytics.py  ← resúmenes, tendencias, comparación semanal
│   ├── models/           ← Esquemas Pydantic
│   └── services/
│       ├── analytics_service.py   ← pandas + scipy, genera resúmenes
│       └── motivation_service.py  ← mensajes motivadores por plantillas
```

### Endpoints implementados
```
POST  /auth/register
POST  /auth/login                → retorna access_token + refresh_token
POST  /auth/logout
POST  /auth/refresh
GET   /auth/me
PUT   /auth/me
POST  /auth/therapist-profile

POST  /journal/entry             → crea entrada + genera mensaje motivador
PUT   /journal/entry/{date}
GET   /journal/entries
GET   /journal/entries/patient/{id}
GET   /journal/streak

POST  /sessions/                 → verifica conflicto, inserta, notifica
GET   /sessions/my-sessions
GET   /sessions/patients         → lista pacientes con último estado emocional
PUT   /sessions/{id}
GET   /sessions/available-slots/{therapist_id}
POST  /sessions/availability
POST  /sessions/block

GET   /analytics/summary/current
GET   /analytics/summary/history
GET   /analytics/summary/patient/{id}
POST  /analytics/summary/generate
GET   /analytics/trends/{user_id}
GET   /analytics/comparison/{user_id}
GET   /analytics/therapist-insight   ← análisis global de todos los pacientes

GET   /health
```

---

## SISTEMA DE ANÁLISIS (sin IA, puro Python)

El `analytics_service.py` hace:

1. **Estadísticas base:** promedios, máximos, mínimos, desviación estándar
2. **Tendencias:** regresión lineal con `scipy.stats.linregress` sobre los días de la semana. Detecta si el estrés/ánimo/energía sube, baja o está estable con significancia estadística
3. **8 patrones detectados:**
   - Alta frecuencia de estrés elevado
   - Ánimo bajo persistente
   - Correlación sueño–energía
   - Variabilidad emocional alta (inestabilidad)
   - Estrés laboral (semana vs fin de semana)
   - Estrés escalante
   - Recuperación positiva
   - Fatiga acumulada
4. **Días críticos:** estrés ≥ 8 O ánimo ≤ 3 O energía ≤ 2, con severidad media/alta
5. **Nivel de alerta:** algoritmo de puntuación → normal / attention / urgent
6. **Texto narrativo:** plantillas condicionales que generan un párrafo legible para el psicólogo
7. **Comparación semanal:** deltas vs semana anterior (↑2.1 estrés, ↓1.3 ánimo)

---

## SISTEMA DE AGENDAMIENTO (doble barrera anti-conflicto)

- **Barrera 1 (código):** antes de insertar, verifica si el slot está ocupado → retorna 409 con los 3 próximos horarios disponibles
- **Barrera 2 (BD):** `UNIQUE INDEX no_overlap_therapist ON sessions(therapist_id, scheduled_at) WHERE status NOT IN ('cancelled')` — la BD nunca deja pasar un duplicado aunque el código falle

---

## ARQUITECTURA DEL FRONTEND

```
mindqueue-frontend/
├── src/
│   ├── lib/
│   │   ├── supabase.js       ← cliente Supabase + subscribeToNotifications()
│   │   ├── axios.js          ← HTTP client con interceptors (auto refresh token)
│   │   └── queryClient.js    ← TanStack Query config
│   ├── store/
│   │   ├── authStore.js      ← Zustand: user, tokens, rol, isTherapist(), isPatient()
│   │   └── notificationStore.js
│   ├── hooks/
│   │   ├── useAuth.js        ← useLogin, useRegister, useLogout
│   │   ├── useJournal.js     ← useMyEntries, useCreateEntry, useStreak, useCurrentSummary
│   │   ├── useSessions.js    ← useMySessions, useMyPatients, useCreateSession, usePatientSummaries, useTrends, useAvailableSlots, useTherapistInsight
│   │   └── useAnalytics.js
│   ├── components/
│   │   ├── ui/               ← Button, Card, Badge, Avatar, Modal, Spinner, EmptyState
│   │   ├── layout/           ← AppShell, Sidebar, TopBar, MobileNav
│   │   ├── patient/          ← JournalForm (3 pasos), MoodSlider, EmotionTags, WeekCalendar, StreakCard, MoodChart, JournalSuccess
│   │   └── therapist/        ← PatientCard, WeeklySummaryView, PatternChips, SessionCard
│   └── pages/
│       ├── auth/             ← LoginPage, RegisterPage
│       ├── patient/          ← PatientDashboard, JournalPage, HistoryPage, SessionsPage
│       └── therapist/        ← TherapistDashboard, PatientDetailPage, SchedulePage, ProfilePage
```

### Rutas
```
/login                    → público
/register                 → público
/patient/dashboard        → home paciente
/patient/journal          → llenar diario de hoy
/patient/history          → entradas pasadas
/patient/sessions         → mis sesiones
/therapist/dashboard      → home psicólogo (lista pacientes por urgencia)
/therapist/patients/:id   → detalle paciente (resumen + tendencias + sesiones)
/therapist/schedule       → calendario semanal de agendamiento
/therapist/profile        → perfil del psicólogo
```

---

## DISEÑO VISUAL — REGLAS DEFINIDAS

**Identidad:** "Soft Professional" — ni app de meditación ni sistema médico frío

**Colores:**
```
Primario:    #2D6A4F  (verde bosque)
Secundario:  #52B788  (verde menta)
Acento:      #F4A261  (naranja suave — alertas atención)
Urgente:     #E76F51  (coral — solo alertas críticas)
Fondo:       #FAFAF8  (casi blanco, nunca blanco puro)
Superficie:  #FFFFFF  (cards)
```

**Tipografía:**
- UI / labels / botones: `DM Sans`
- Headings emocionales / bienvenida: `Playfair Display`

**Componentes:**
- Cards: `border-radius: 16px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)`
- Inputs: `border-radius: 12px`
- Animaciones: Framer Motion, `duration: 0.3s`, `ease-out`

**Reglas no negociables:**
- Fondo de página siempre `bg-bg` (#FAFAF8), nunca blanco puro
- Cards siempre en `bg-white` con `shadow-card`
- Alertas urgentes: coral, NUNCA rojo puro
- Mobile-first para paciente, desktop-first para psicólogo
- Sin modales innecesarios para flujos importantes
- Siempre mostrar empty states, nunca pantalla en blanco

---

## EXPERIENCIA DEL PACIENTE — FLUJO PRINCIPAL

El diario emocional es el componente más importante. Flujo en 3 pasos:

**Paso 1:** 4 sliders visuales (no `input[range]` — son filas de círculos clickeables)
- Sueño (1-5), Estrés (1-10), Energía (1-10), Ánimo (1-10)
- Colores dinámicos: verde = bueno, naranja = medio, coral = malo

**Paso 2:** Chips de emociones (16 opciones con colores por categoría) + situación del día (texto libre, opcional)

**Paso 3:** Texto libre (totalmente opcional, "Puedes saltarte esto")

**Al finalizar:** Pantalla de confirmación con checkmark animado + mensaje motivador personalizado en cursiva (Playfair Display) + racha actualizada

---

## EXPERIENCIA DEL PSICÓLOGO — DASHBOARD

El psicólogo entra y en 30 segundos debe saber:
1. Qué pacientes tienen alerta urgente (badge rojo coral)
2. Quién tiene resumen nuevo sin revisar (dot verde pulsante)
3. Cuántas sesiones tiene esta semana

PatientCard muestra: avatar + nombre + badge alerta + métricas (estrés/ánimo) + "Nuevo resumen" si no fue revisado

PatientDetailPage (antes de la sesión) tiene tabs:
- "Esta semana": métricas + días críticos + patrones + emociones frecuentes + gráfica 7 días
- "Historial": gráfica tendencias 6 semanas (Recharts, 3 líneas: estrés, ánimo, energía)
- "Sesiones": historial y próximas

---

## DOCUMENTOS ACADÉMICOS GENERADOS

Para el programa ADSO del SENA:

1. **MindQueue_Propuesta_Conceptual.docx** — documento teórico completo (sin tecnicismos): título, descripción, problema, justificación, objetivos, alcance, caracterización, beneficios, impacto, restricciones, riesgos, resultados esperados

2. **MindQueue_Mapa_Procesos_APA.docx** — mapa de procesos adaptado de la plantilla del SENA:
   - Procesos Estratégicos (azul): Dashboard clínico + Planeación de sesiones
   - Procesos Misionales (verde): Registro emocional → Análisis → Resúmenes → Entrega al psicólogo
   - Procesos de Apoyo (amarillo): Gestión usuarios → Agendamiento → Notificaciones
   - Referencias en formato APA 7 con sangría francesa, títulos en cursiva, orden alfabético

**Normas APA 7 aplicadas** en todos los documentos académicos.

---

## ESTADO ACTUAL DEL PROYECTO

| Componente | Estado |
|-----------|--------|
| Proyecto Supabase | ✅ Creado con RLS automático activado |
| Tablas SQL + RLS | ✅ Ejecutadas en Supabase |
| Repos GitHub | ✅ Creados y separados (backend / frontend) |
| Estructura carpetas backend | ✅ Creada |
| Backend corriendo | ✅ `localhost:8000/docs` funciona |
| Swagger UI | ✅ Visible con los 4 routers |
| Routers vacíos | ✅ Declarados (auth, journal, sessions, analytics) |
| Código de routers | 🔲 Pendiente de implementar |
| Servicios analytics | 🔲 Pendiente |
| Frontend | 🔲 Pendiente de iniciar |

---

## PRÓXIMOS PASOS (en orden)

1. Implementar `app/routers/auth.py` completo (register, login, logout, refresh, /me)
2. Probar auth en Swagger — verificar que crea perfil en Supabase automáticamente
3. Implementar `app/routers/journal.py` + `app/services/motivation_service.py`
4. Implementar `app/services/analytics_service.py` (pandas + scipy)
5. Implementar `app/routers/analytics.py`
6. Implementar `app/routers/sessions.py` con sistema de disponibilidad
7. Iniciar frontend: `npm create vite@latest mindqueue-frontend -- --template react`
8. Configurar Tailwind + fuentes + colores en `tailwind.config.js`
9. Implementar auth store (Zustand) + axios interceptors
10. Construir JournalForm (3 pasos con MoodSlider y EmotionTags)
11. Construir dashboards (paciente y psicólogo)
12. Deploy: Render (backend) + Vercel (frontend)

---

## ARCHIVOS DE REFERENCIA DISPONIBLES

Si necesitas el código completo de algún componente, pide el archivo específico:

- `MINDQUEUE_BACKEND_PROMPT.md` → código completo de todos los routers y modelos
- `MINDQUEUE_BACKEND_V2_PROMPT.md` → sistema de agendamiento + IA (para cuando haya presupuesto)
- `MINDQUEUE_BACKEND_V3_ANALYTICS_PROMPT.md` → analytics_service.py y motivation_service.py completos (sin IA)
- `MINDQUEUE_FRONTEND_PROMPT.md` → código completo de páginas, componentes y hooks
- `MINDQUEUE_FRONTEND_V2_PROMPT.md` → JournalSuccess, SchedulePage, PatientDetailPage completos

---

## CONTEXTO ACADÉMICO IMPORTANTE

Este es un proyecto de portafolio de un estudiante de ADSO en el SENA. El objetivo es triple:
1. Aprender tecnologías modernas (FastAPI, React, Supabase, pandas)
2. Construir algo real que pueda mostrar a empleadores
3. Potencialmente lanzarlo como producto real con psicólogos independientes en Colombia

El estudiante tiene conocimiento previo de: Python, Flask, SQLAlchemy, JWT manual, arquitectura factory. MindQueue es su transición hacia un stack más moderno y profesional.
