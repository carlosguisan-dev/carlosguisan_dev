# carlosguisan.dev - HubSpot Portfolio Custom Theme

Este es el tema personalizado desarrollado para mi portafolio profesional en [www.carlosguisan.dev](https://www.carlosguisan.dev).

## Sobre el Proyecto

Este tema ha sido diseñado utilizando **Google Stitch** y adaptado meticulosamente para el ecosistema de **HubSpot** utilizando HubL y las mejores prácticas de desarrollo web.

## Características

- **Diseño Premium:** Estética moderna y funcional.
- **Optimizado para HubSpot:** Aprovecha al máximo las capacidades del Design Manager.
- **Responsive:** Adaptabilidad total a dispositivos móviles y tablets.
- **Integración con Git:** Flujo de trabajo moderno con control de versiones en GitHub.

## Tailwind 4 & HubL Build System

Este tema utiliza **Tailwind CSS v4** integrado directamente en la estructura de HubSpot mediante un sistema de "Puente" (Bridge Pattern) para evitar conflictos con HubL.

### Estructura de Archivos

- **`/tailwind`**: Contiene los archivos fuente de Tailwind (`input.css`, `_layout.css`, etc.). Estos archivos son procesados localmente y están ocultos para HubSpot vía `.hsignore`.
- **`css/base.css`**: Actúa como el "Puente". Define variables CSS utilizando HubL (Theme Settings) que luego son consumidas por las clases de Tailwind.
- **`css/tailwind-built.css`**: El archivo final compilado que contiene todas las utilidades de Tailwind listas para producción.

### Procesamiento de Estilos

Para actualizar los estilos, realiza cambios en la carpeta `/tailwind` y ejecuta los comandos de build correspondientes.

#### Comandos NPM

Desde la carpeta raíz del tema:

- **Build (Producción):** `npm run build`
- **Watch (Desarrollo):** `npm run watch`

---

_Diseñado por Carlos Guillermo Sánchez Cabezas_
