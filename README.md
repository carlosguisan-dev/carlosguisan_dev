# carlosguisan.dev - HubSpot Portfolio Custom Theme

Este es el tema personalizado desarrollado para mi portafolio profesional en [www.carlosguisan.dev](https://www.carlosguisan.dev).

---

## 🏗️ Arquitectura del Tema

Este tema utiliza **Tailwind CSS v4** integrado directamente en la estructura de HubSpot mediante un sistema de "Puente" (Bridge Pattern) para evitar conflictos con HubL y permitir cambios en tiempo real.

### The Bridge Pattern (Patrón de Puente)
Para asegurar que los cambios realizados en el Panel de Diseño de HubSpot se reflejen sin necesidad de herramientas de línea de comandos en producción:

1.  **HubL Variable Map (`css/base.css`)**: Mapea los campos de `fields.json` a variables CSS estándar (ej. `--color-primary`).
2.  **Tailwind Theme Injection (`tailwind/input.css`)**: Tailwind v4 consume estas variables CSS en el bloque `@theme`.
3.  **Compiled Utils (`css/tailwind-built.css`)**: El resultado es un archivo CSS que contiene clases como `bg-primary` que son dinámicas.

---

## 🎨 Sistema de Diseño

### Paleta de Colores
Los colores principales están definidos en HubSpot y son accesibles vía clases de Tailwind:

| Token | Clase Tailwind | Variable CSS |
| :--- | :--- | :--- |
| **Brand Green** | `bg-brand-green` | `--color-brand-green` |
| **Brand Lime** | `bg-brand-lime` | `--color-brand-lime` |
| **Lime Vibrant** | `text-brand-lime-vibrant` | `--color-brand-lime-vibrant` |
| **Forest** | `bg-forest` | `--color-forest` |
| **Dark Slate** | `text-dark-slate` | `--color-dark-slate` |

### Tipografía
| Uso | Clase Tailwind | Fuente |
| :--- | :--- | :--- |
| **Títulos** | `font-display` | Work Sans |
| **Cuerpo** | `font-sans` | Work Sans |
| **Código/Mono** | `font-mono` | Fira Code |

---

## 🧩 Estructura y Módulos

El tema cuenta con **35 módulos personalizados**, organizados por áreas:

- **Homepage**: `homepage_hero`, `homepage_feature_cards`, `homepage_philosophy`, `homepage_portfolio_item`.
- **Servicios**: `services-ladder`, `services-methodology`, `services-requirements`.
- **Pricing**: `pricing-cards`, `pricing-terms` (con estética "terminal").
- **Portfolio**: `portfolio-cards`, `portfolio-hero`.
- **Global**: `menu`, `button`, `social-links`.

---

## 🌙 Dark Mode

El tema soporta Dark Mode nativo usando la clase `.dark` en el tag `<html>`. 
- Se activa mediante el script `js/theme-toggle.js`.
- Los módulos DND de HubSpot usan clases de soporte (`js-dark-section`) para manejar fondos que HubSpot no permite controlar dinámicamente.

---

## 🚀 Optimización para Producción

### SEO & AEO (AI Engine Optimization)
- **JSON-LD**: Implementado en `templates/partials/schema-metadata.html` para mejorar la visibilidad en buscadores y motores de IA.
- **Semantic HTML**: Uso riguroso de `header`, `main`, `footer`, y `article`.

### Performance
- **Font Preloading**: Work Sans se precarga en `base.html` para evitar layout shifts.
- **Minified Styles**: `tailwind-built.css` se entrega minificado.

---

## 🛠️ Flujo de Trabajo Local (Mantenimiento)

### Procesamiento de Estilos con Tailwind 4
Para actualizar los estilos, realiza cambios en la carpeta `/tailwind` y ejecuta los comandos de build.

#### Comandos NPM
Desde la carpeta raíz del tema:
- **Build (Producción):** `npm run build`
- **Watch (Desarrollo):** `npm run watch`

### Estructura de Archivos Críticos
- **`/tailwind`**: Archivos fuente de Tailwind (`input.css`, `_layout.css`, etc.). Ignorados por HubSpot vía `.hsignore`.
- **`css/base.css`**: Puente HubL -> CSS Variables.
- **`css/tailwind-built.css`**: Archivo compilado final.

---
_Diseñado por Carlos Guillermo Sánchez Cabezas - 2026_
