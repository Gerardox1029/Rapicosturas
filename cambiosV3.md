# Specification Document: System Requirements & Refactoring - RapiCostura

## 1. Executive Summary
This document provides a comprehensive, structured, and developer-optimized specification of functional, non-functional, UI/UX, and architectural requirements for refactoring the **RapiCostura** PWA application. Designed specifically for consumption by **Codex**, this specification details view restructures, user/sede entity equivalences, voice recording label updates, PWA push notifications, storage pipeline adjustments, obsolete component removal, and WhatsApp chatbot integration logic.

---

## 2. Architecture & Global Context Management

### 2.1. Dynamic Selector: Sede de Trabajo / Usuario
- **Header Selector Restructure:**
  - Update selector title from `"Sede de trabajo"` to `"Sede de trabajo / Usuario"`.
  - Expand selector options to include both physical branches (*Dolores*, *Siglo XX*, *Cerro Colorado*, *Yanahuara*, *Cayma*) and individual user entities (e.g., `"Soy Yesenia"`, `"Soy Yolanda"`).
  - Implement immediate reactive state update upon dropdown selection (eliminate legacy `"Guardar sede"` button).
- **Dynamic Main Page Title:**
  - When a physical branch is active, set page header to `"Sede: [Nombre de Sede]"` (e.g., `"Sede: Dolores"`).
  - When a user entity is active, set page header to `"Soy [Nombre de Usuario]"` (e.g., `"Soy Yesenia"`).
  - Extend the top selector bar to span 100% full width across mobile and desktop viewports.
- **Entity Equivalence Engine (Origin / Destination):**
  - Users and Sedes must be treated as identical first-class entities in the logistics engine.
  - Both User and Sede entities can be selected as Shipment Origin (`desde`) or Shipment Destination (`a`).
  - Example shipment pairings: `Sede Cayma` → `Soy Yolanda`, `Soy Yesenia` → `Sede Siglo XX`, `Soy Yesenia` → `Soy Yolanda`.

### 2.2. User Entity Management ("Editar Usuarios")
- **UI Control:** Position a button labeled `"Editar usuarios"` with a pencil icon (`✏️`) directly adjacent to the right side of the Sede/User navigation dropdown.
- **Modal Component (`UserManagementModal`):**
  - Clicking `"Editar usuarios"` triggers a modal window restricted to non-sede user management.
  - **CRUD Capabilities:**
    1. **Create:** Add new user entity name.
    2. **Edit:** Update existing user display name.
    3. **Delete:** Remove non-sede user entity with safety confirmation dialog.

---

## 3. Worker View (Vista Trabajadora)

### 3.1. Unified Recepción & Envíos Module
- **Single Page Route (`/envios`):** Merge "Recepción" and "Envíos" into a single unified view.
- **Centered Switch Toggle:**
  - Position a prominent horizontal toggle control at the center top.
  - **Left State ("Recepción"):** Renders received/incoming packages list (purple-blue visual accent). Bypasses legacy "Recibir" pre-step, directly displaying package history.
  - **Right State ("Envíos"):** Renders outgoing shipments list (red-purple visual accent).
- **UX Scroll State Persistence:** Retain vertical scroll position (`window.scrollY`) when toggling status filters (`"Todos"`, `"En camino"`, `"Recibidos"`).

### 3.2. Voice Recording Evidence Component
- **Label & UI Terminology Standard:**
  - Update evidence modal section title from `"Nota de voz"` to `"Grabación de voz"`.
  - Update action button label from `"Eliminar nota"` to `"Eliminar grabación de voz"`.
- **Recorder Specifications:**
  - Audio recording widget supporting touch lock gesture (swipe up).
  - Real-time animated waveform display during active recording.
  - Direct upload pipeline to Cloudflare R2 storage bucket.
  - Store metadata fields in database record: `audio_url` (string) and `audio_duracion` (integer/seconds).

### 3.3. Profile Dropdown & Mode Authentication
- **Header Cleanup:** Remove the static `"Trabajadora"` text button.
- **Deprecated Profile Features:** Strip legacy profile views, "Mi forma de trabajar", "Lo que sé hacer", "Seleccionar nombre", and individual logout buttons.
- **Simplified Dropdown Options:**
  1. `"Cambiar sede / usuario"`
  2. `"Modo dueña"`
- **Authentication Pattern Modal:**
  - Selecting `"Modo dueña"` displays a 3x3 point grid pattern modal.
  - **Default Access Gesture:** Matrix stroke forming the letter **"N"**.
  - On valid stroke entry, transition application context to Owner View (`/admin`).

### 3.4. Workshop Videos Section ("Videos del Taller")
- **Header Clean-Up:** Remove all decorative welcome cards and static text banners.
- **Search Bar Placement:** Position `"Buscar un video..."` input bar directly below `"Videos del taller"` title.
- **Category Filter Dropdown:** Replace static category cards with a compact dropdown menu positioned next to the section title, containing 4 exact categories:
  1. *Recibir prendas*
  2. *Costura y acabados*
  3. *Revisar la calidad*
  4. *Empaque y entregas*
- **Real-Time Filter:** Client-side state filtering of video items upon category selection without triggering route reloads.

---

## 4. Owner View (Vista Dueña)

### 4.1. Global Sede & User Filtering
- **Selector Options:** Display all 5 physical sedes (*Dolores*, *Siglo XX*, *Cerro Colorado*, *Yanahuara*, *Cayma*), user entities, plus a consolidated `"Todas las sedes"` option.
- **Dashboard Layout:**
  - Apply the unified **Switch Toggle** (Recepción / Envíos).
  - Move motivation card ("Cada entrega cuenta...") to bottom of feed.
  - Position key metric cards ("En camino", "Recibidos") at top of feed for instant visibility.

### 4.2. Video Administration
- Maintain `" + Subir un video "` purple accent card at top.
- Increase max file size upload limit from **300 MB to 1 GB**, backed by multipart upload streams to Cloudflare R2.
- Remove legacy tutorial cards ("Tutorial 1", "Tutorial 2").

### 4.3. Deprecated Components & Cleared Routes
- **Removed Navigation Tabs:** `"Compañeras"`, `"Mis trabajos"`, `"Equipo"`, `"Actividad de trabajo"`.
- **Removed Widgets & Banners:** `"Necesita tu atención"`, `"Prendas de clientes"`, `"Las sedes del taller"`, `"Trabajos activos"`, `"Por revisar"`, `"Apoyo por responder"`, `"Sede responsable"`.

---

## 5. PWA Push Notification System

### 5.1. Trigger Conditions & Targeting
- **Event:** Fired immediately upon successful submission of a new shipment record.
- **Target Recipient:** Restricted **exclusively** to the active destination entity (`destino`) assigned to the shipment (Sede or User).

### 5.2. Notification Payload Format
- **Dynamic Content Template:**
  ```text
  Se te envió un [paquete / material / trabajo] desde [Remitente]. ¡Haz la recepción! 📦✨
  ```
- **Styling & Assets:** Bold key entity labels, dynamic contextual emojis (e.g., 📦, 😊, ⚡), and deep-link click action redirecting straight to the `/envios?tab=recepcion` route.

---

## 6. WhatsApp Bot Module & Applicant Inbox

### 6.1. Module Navigation & Renaming
- Rename navigation entry `"Resumen"` to `"Bot WhatsApp"` with custom Bot/WhatsApp vector icon.
- Retain primary card `"Chatbot de WhatsApp / Configurar chatbot próximamente"`.

### 6.2. Pre-approved Applicant Inbox ("Bandeja de Postulantes")
- **Clean Initial State:** Section header `"Postulantes y visitas"` initialized as empty list (no dummy/sample data).
- **Applicant Card Component:**
  - **Full Name:** Extracted during chatbot conversational intake.
  - **Score Badge:** Experience suitability percentage (e.g., `75%`).
  - **Technical Test Date/Time:** Calendar/clock icon displaying assigned appointment slot.
  - **Test Location:** Map icon showing designated branch (*Dolores*, *Siglo XX*, *Cerro Colorado*, *Yanahuara*, *Cayma*).
  - **Action Button (`"Ver detalles"`):** Opens modal with full responses from the recruitment survey.

### 6.3. Non-AI Rule Engine Architecture
- **Keyword & Intent Matching:** Evaluate required and optional terms (e.g., `cierre` AND [`pantalón` OR `jeans`]).
- **Fuzzy Matching (Levenshtein Distance):** String similarity threshold (>75%) for spelling variation tolerance.
- **Text Normalization Pipeline:** Lowercase conversion, accent removal, punctuation stripping, stop-word filtering, and synonym mapping.
- **Post-Reply Information Dispatch:**
  - **Trigger Rule:** Do NOT attach on initial greeting. Fire strictly AFTER answering user query.
  - **Content Bundle:** Re-send 3 informational posts (1. Addresses & Google Maps links for 5 sedes, 2. Direct contact phone/WhatsApp numbers, 3. Complete service catalog) with warm emojis (🥰, 😊, 👋, ✅).

---

## 7. Non-Functional & Technical Requirements Matrix

| Requirement Area | Specification | Implementation Guidelines |
| :--- | :--- | :--- |
| **Media Storage** | Cloudflare R2 Integration | Direct client/API presigned upload URLs for audio notes and 1 GB video files. |
| **Data Retention** | Automated Record Purge | Cron Worker script executing daily to purge completed shipments closed for > 3 calendar days. |
| **Shipment Security** | Conditional 3-Dots Menu | Edit/Delete shipment actions visible exclusively to emitting origin entity. |
| **PWA Capability** | Service Worker Push APIs | Web Push API integration with payload formatting and targeted entity messaging. |
| **State Management** | Client-side Reactivity | Local state filtering for video categories and inventory search without full page refreshes. |
