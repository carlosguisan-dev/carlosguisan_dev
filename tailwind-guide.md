# 🎨 Guía de Tailwind CSS - CarlosGuisan Dev

Esta guía documenta las clases personalizadas y la configuración de Tailwind CSS v4 utilizada en este proyecto de HubSpot.

## 🌈 Paleta de Colores de Marca

Usa estas clases para fondos (`bg-{color}`), texto (`text-{color}`) y bordes (`border-{color}`).

| Color            | Clase Tailwind       | Hex (Ref) | Uso Principal                         |
| :--------------- | :------------------- | :-------- | :------------------------------------ |
| **Brand Green**  | `brand-green`        | `#2D5016` | Fondos principales (Footer, Hero)     |
| **Brand Lime**   | `brand-lime`         | `#A3D977` | Acentos, iconos, títulos secundarios  |
| **Lime Vibrant** | `brand-lime-vibrant` | `#BEF264` | Estados hover, llamadas a la acción   |
| **Brand Orange** | `brand-orange`       | `#EC5B13` | Alertas, acentos puntuales            |
| **Forest**       | `forest`             | `#2D5016` | Variaciones de verde profundo         |
| **Slate 200**    | `slate-200`          | `#E2E8F0` | Texto secundario sobre fondos oscuros |

### 🔡 Clases de Texto (Ejemplos rápidos)

- `text-brand-lime`: Para títulos o palabras clave destacadas.
- `text-brand-green`: Para texto sobre fondos claros.
- `text-brand-lime-vibrant`: Para estados activos o links.
- `text-slate-200`: Ideal para párrafos sobre fondos oscuros.

> [!TIP] > **Opacidad**: Puedes combinar cualquier color con opacidad usando `/`.
> Ejemplo: `text-brand-lime/80` (Verde lima al 80% de opacidad).

---

## 🔘 Componentes: Botones

Hemos estandarizado los botones para mantener la coherencia visual.

| Tipo         | Clases Base                                                       | Efectos                                 |
| :----------- | :---------------------------------------------------------------- | :-------------------------------------- |
| **Primario** | `bg-brand-green text-white px-6 py-2.5 rounded-lg font-bold`      | `transition-transform active:scale-95`  |
| **Acento**   | `bg-brand-lime text-brand-green px-6 py-2.5 rounded-lg font-bold` | `hover:bg-brand-lime-vibrant shadow-lg` |

### Ejemplo:

```html
<button class="bg-brand-green text-white px-6 py-2.5 rounded-lg font-bold transition-transform active:scale-95 shadow-md hover:shadow-lg">Agendar Discovery Call</button>
```

---

## 🌑 Sombras (Shadows)

Usa sombras para dar profundidad y elevar elementos sobre el fondo.

- `shadow-sm`: Sombra muy sutil para tarjetas.
- `shadow-md`: Elevación estándar.
- `shadow-lg`: Para elementos que deben destacar (CTAs, Modales).
- `shadow-brand-green/20`: Usa sombras con color para un efecto más integrado.

---

## 🎬 Animaciones y Transiciones

El tema utiliza transiciones suaves para una experiencia premium.

- **Transición Base**: `transition-all duration-300 ease-in-out`
- **Escala al click**: `active:scale-95` (excelente para botones).
- **Desplazamiento Horizontal**: `hover:translate-x-1` (usado en navegación del footer).
- **Elevación Vertical**: `hover:-translate-y-1` (usado en iconos sociales).

### Animaciones Custom (si se requieren):

- `animate-pulse`: Para estados de carga sutiles.
- `animate-bounce`: Para llamar la atención sobre un elemento (use con moderación).

---

## ✍️ Tipografía

| Tipo        | Clase Tailwind | Variable CSS     | Fuente                        |
| :---------- | :------------- | :--------------- | :---------------------------- |
| **Display** | `font-display` | `--font-display` | Work Sans (Títulos)           |
| **Mono**    | `font-mono`    | `--font-mono`    | Fira Code (Código, Copyright) |
| **Base**    | `font-sans`    | `--font-sans`    | Work Sans (Cuerpo)            |

### Utilidades de Texto comunes:

- `text-xs`: 12px - Copyright y detalles.
- `text-sm`: 14px - Navegación y párrafos pequeños.
- `text-base`: 16px - Cuerpo de texto estándar.
- `text-xl`: 20px - Subtítulos.
- `text-3xl`: 30px - Títulos de sección.

---

## 🌙 Dark Mode

- **Prefijo `dark:`**: Siempre disponible para adaptar cualquier componente.
  ```html
  <div class="border-slate-200 dark:border-white/10 p-4 rounded shadow">Contenido con borde y sombra adaptable.</div>
  ```

---

## 🛠️ Utilidades Globales de Tailwind v4

Además de los colores de marca, tienes acceso a **toda la biblioteca estándar de Tailwind v4**. Aquí tienes lo más útil para HubSpot:

### 📱 Responsividad (Breakpoints)

- `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px).

### 📐 Layout & Flexbox

- `flex`, `flex-col`, `items-center`, `justify-between`
- `grid`, `grid-cols-12`, `gap-6`
- `hidden`, `block`, `inline-block`

### 📏 Espaciado (Padding/Margin)

- `p-0` hasta `p-96` (ej: `p-6` = 1.5rem / 24px)
- `m-auto` para centrar bloques.
- `space-x-4` o `space-y-4` para espaciar hijos automáticamente.

### 🖼️ Filtros & Efectos Premium

- `backdrop-blur-md`: Para el efecto de cristal.
- `opacity-50`: Transparencia.
- `z-50`: Para asegurar que elementos queden encima de otros.

---

## 🏗️ Grid de HubSpot (D&D)

En secciones de Drag & Drop de HubSpot, el sistema usa clases `spanX`. Hemos creado un puente de compatibilidad:

- `.span1` a `.span12`: Puedes usar estas clases dentro de un `.row-fluid` para emular el grid nativo de HubSpot mientras sigues usando Tailwind para lo demás.

---

## 🛠️ Cómo agregar más utilidades

Si necesitas ampliar el sistema, el archivo central es:
`tailwind/input.css` -> Sección `@theme`.
