# Plan de Migración: Plantillas de Sistema

Este documento detalla el plan para personalizar las plantillas de sistema del tema `carlosguisan_dev` basándonos en los diseños de `carlosguisan_dev_assets/templates/system`.

## Objetivos

- [ ] Migrar los estilos y layouts de los diseños de Stitch a las plantillas de HubSpot.
- [ ] Mantener el **Header** y **Footer** ya definidos en el theme (`base.html`).
- [ ] Integrar los estilos de Tailwind (adaptando de CDN a Tailwind 4 del theme).
- [ ] Asegurar que los formularios nativos de HubSpot (membresía, suscripciones, etc.) se integren correctamente en el nuevo diseño.
- [ ] **Nota:** No se utilizarán áreas DnD (Drag and Drop), ya que no son compatibles con las plantillas de sistema de HubSpot. Se utilizará código HubL estático.

## Mapeo de Archivos

| Diseño (Asset)                   | Plantilla del Tema (Destino)                              | Estado         |
| :------------------------------- | :-------------------------------------------------------- | :------------- |
| `404.html`                       | `templates/system/404.html`                               | [x] Completado |
| `500.html`                       | `templates/system/500.html`                               | [x] Completado |
| `Search-Results.html`            | `templates/system/search-results.html`                    | [x] Completado |
| `membership-login.html`          | `templates/system/membership-login.html`                  | [x] Completado |
| `membership-register.html`       | `templates/system/membership-register.html`               | [x] Completado |
| `membership-reset-password.html` | `templates/system/membership-reset-password.html`         | [x] Completado |
| `reset-password-request.html`    | `templates/system/membership-reset-password-request.html` | [x] Completado |
| `password-prompt.html`           | `templates/system/password-prompt.html`                   | [x] Completado |
| `subscription-confirmation.html` | `templates/system/subscriptions-confirmation.html`        | [x] Completado |
| `suscription-preferences.html`   | `templates/system/subscription-preferences.html`          | [x] Completado |

## Notas Técnicas

- **Estilos:** Se extraerán los gradientes, patrones de wireframe y configuraciones de color de los assets para integrarlos en `css/templates/system.css` o directamente en las plantillas según corresponda.
- **Fuentes:** Se mantendrán las definidas en `base.html` (Public Sans y Fira Code).
- **Layouts:** Se usará el bloque `{% block body %}` para inyectar el contenido, omitiendo el header y footer del asset.

## Progreso de Implementación

- [x] Análisis de Assets completado.
- [x] Definición de estructura base por template.
- [x] Implementación de templates de error (404/500).
- [x] Implementación de templates de membresía.
- [x] Implementación de templates de búsqueda y suscripción.
- [ ] Verificación final.
