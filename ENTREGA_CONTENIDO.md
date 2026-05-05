# CONTENIDO PARA DOCUMENTO DE ENTREGA - CatLin Studio

## 1. INTRODUCCIÓN DEL PROYECTO

**Nombre del sitio:** CatLin Studio

**Tipo de sitio:** Institucional (Negocio de servicios de belleza)

**Objetivo:** Brindar una presencia web profesional para un estudio de belleza que ofrece servicios de manicura, diseño de cejas, extensiones de pestañas y masajes relajantes. El sitio permite a las clientas conocer los servicios, precios, equipo y contactar fácilmente.

**Público objetivo:** Mujeres de 18 a 55 años interesadas en cuidado personal, belleza y bienestar.

**Descripción:** CatLin Studio es un sitio web estático desarrollado con HTML5 semántico, SASS y Bootstrap 5. Cuenta con 5 secciones: Inicio, Servicios, Nosotros, Contacto y Galería. El diseño utiliza una paleta de colores suaves (rosas y tonos neutros) que transmiten elegancia y confianza. Se implementaron animaciones AOS para mejorar la experiencia de usuario.

---

## 2. ESTRUCTURA HTML

### Estructura de carpetas:
```
CatLin-Studio/
├── index.html
├── pagina1.html (Servicios)
├── pagina2.html (Nosotros)
├── pagina3.html (Contacto)
├── pagina4.html (Galería)
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── images/
├── scss/
│   ├── abstracts/ (_variables.scss, _mixins.scss, _placeholders.scss)
│   ├── base/ (_reset.scss, _typography.scss)
│   ├── components/ (_nav.scss, _card.scss, _button.scss)
│   ├── layout/ (_header.scss, _footer.scss, _grid.scss)
│   ├── pages/ (_home.scss, _services.scss, _about.scss, _contact.scss)
│   └── main.scss
└── package.json
```

### Características HTML implementadas:
- **Etiquetas semánticas:** `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- **SEO:** Meta tags descriptivos, Open Graph, títulos únicos por página
- **Accesibilidad:** Atributos `aria-label` en iconos sociales
- **Navegación:** Menú consistente en las 5 páginas con clase `active` en la página actual
- **Bootstrap 5:** Uso de grillas, cards, formularios y componentes responsivos
- **AOS (Animate On Scroll):** Atributos `data-aos` para animaciones al hacer scroll

### Código destacado - index.html (estructura):
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="CatLin Studio - Estudio de belleza...">
    <meta property="og:title" content="CatLin Studio - Belleza y Bienestar">
    <title>CatLin Studio | Estudio de Belleza y Bienestar</title>
    <!-- Preconnect para performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <!-- Fuentes Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins...&display=swap" rel="stylesheet">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- AOS Animations -->
    <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet">
    <!-- CSS generado desde SASS -->
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
            <!-- Navegación con enlaces a las 5 páginas -->
        </nav>
    </header>
    <main>
        <!-- Secciones semánticas: hero, services-preview, about-preview, testimonials -->
    </main>
    <footer class="footer">
        <!-- Footer con 4 columnas: logo, enlaces, servicios, contacto -->
    </footer>
    <!-- Scripts: Bootstrap, AOS, main.js -->
</body>
</html>
```

---

## 3. ESTILOS CSS / SASS

### Arquitectura SASS (7-1 Pattern):
Se utilizó la estructura estándar 7-1: 7 carpetas para partials + 1 archivo main.scss

### Uso de Variables (_variables.scss):
```scss
$color-primary: #e8b4b8;
$color-primary-dark: #d4919b;
$font-primary: 'Poppins', sans-serif;
$font-secondary: 'Playfair Display', serif;
$bp-mobile: 576px;
$bp-tablet: 768px;
```

### Uso de Mixins (_mixins.scss):
```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == tablet {
    @media (max-width: $bp-tablet) { @content; }
  }
}

@mixin card-hover {
  @include transition(transform, 0.3s, ease);
  &:hover { transform: translateY(-8px); }
}

@mixin button-style($bg-color: $color-primary) {
  background-color: $bg-color;
  &:hover { background-color: color.adjust($bg-color, $lightness: -10%); }
}
```

### Uso de Nesting:
```scss
.navbar-custom {
  background-color: $color-white;
  padding: $spacing-sm 0;
  
  .navbar-brand {
    font-family: $font-secondary;
    color: $color-primary-dark;
  }
  
  .nav-link {
    &::after {
      content: '';
      transform: scaleX(0);
    }
    &:hover::after {
      transform: scaleX(1);
    }
  }
}
```

### Uso de Extend/Placeholders (_placeholders.scss):
```scss
%section-padding {
  padding: $spacing-xxl 0;
  @include respond-to(tablet) { padding: $spacing-xl 0; }
}

%heading-style {
  font-family: $font-secondary;
  color: $color-dark;
  font-weight: 700;
}

// Uso en páginas:
.hero { @extend %section-padding; }
.services-preview { @extend %section-padding; }
```

### Decisiones de diseño:
- **Paleta de colores:** Rosas suaves (#e8b4b8) que evocan feminidad y belleza, combinados con grises neutros
- **Tipografía:** Poppins (sans-serif moderna) para texto general, Playfair Display (serif elegante) para títulos
- **Bootstrap personalizado:** Se sobrescriben estilos de Bootstrap mediante SASS para mantener identidad propia
- **Espaciado:** Sistema de espaciado consistente usando variables ($spacing-xs a $spacing-xxl)

---

## 4. RESPONSIVE DESIGN Y ESTILOS AVANZADOS

### Adaptación a dispositivos:
- **Mobile-first:** Diseño base para móviles, luego se adapta a tablets y desktop
- **Media queries:** Implementadas via mixin `respond-to()` en SASS
- **Bootstrap Grid:** Sistema de grillas responsivo (col-md-6, col-lg-3, etc.)

### Ejemplos de responsive:
```scss
// Grid responsivo
&.grid-4 {
  grid-template-columns: repeat(4, 1fr);
  @include respond-to(desktop) { grid-template-columns: repeat(2, 1fr); }
  @include respond-to(mobile) { grid-template-columns: 1fr; }
}

// Tipografía responsiva
html {
  font-size: 16px;
  @include respond-to(tablet) { font-size: 15px; }
  @include respond-to(mobile) { font-size: 14px; }
}
```

### Animaciones y transiciones:
1. **AOS (Animate On Scroll):** Animaciones al hacer scroll (fade-up, fade-left, zoom-in)
2. **Transiciones CSS:** Hover effects en cards, botones y enlaces
3. **Transformaciones:** `transform: translateY(-8px)` en cards al hacer hover
4. **Animación hero:** Keyframes `float` para el fondo animado

```scss
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.service-card {
  @include card-hover; // Transform translateY en hover
  .card-img-top { @include transition(transform, 0.5s); }
  &:hover .card-img-top { transform: scale(1.05); }
}
```

### Capturas sugeridas para el documento:
1. **Desktop:** Página completa de index.html (1920x1080)
2. **Tablet:** Página de servicios (768x1024)
3. **Mobile:** Página de contacto (375x667)

---

## 5. REPOSITORIO DE GITHUB

### Pasos para subir a GitHub:
1. Crear repositorio en GitHub (vacío, sin README)
2. Ejecutar:
```bash
git remote add origin https://github.com/TU_USUARIO/catlin-studio.git
git branch -M main
git push -u origin main
```

### Capturas necesarias:
1. **Página principal del repositorio** en GitHub (mostrando archivos)
2. **Historial de commits** (git log o página de commits en GitHub)
3. **Estructura de carpetas** visible en GitHub

### Commits realizados:
- "Initial commit: Proyecto CatLin Studio con HTML, SASS y Bootstrap"
- "Add .gitignore to exclude node_modules"
- "Remove node_modules from tracking"
- "Update project files and .gitignore"

---

## 6. DEMO DEL SITIO WEB

### Despliegue en Vercel (recomendado):
1. Ir a [vercel.com](https://vercel.com)
2. Importar repositorio de GitHub
3. Configuración: Framework Preset = "Other", Build Command = `npm run build-css`, Output Directory = `.`
4. Deploy

### O alternativa Netlify:
1. Ir a [netlify.com](https://netlify.com)
2. Drag & drop de la carpeta del proyecto
3. O conectar repositorio de GitHub

### URL del sitio publicado:
[INSERTAR URL AQUÍ DESPUÉS DEL DEPLOY]

### Capturas necesarias del sitio publicado:
1. **Desktop:** Home page completa
2. **Tablet:** Página de servicios
3. **Mobile:** Página de contacto con formulario

---

## REFLEXIÓN FINAL

El desarrollo de CatLin Studio permitió aplicar de manera integral los conocimientos de HTML5 semántico, preprocesadores SASS y frameworks CSS como Bootstrap. La principal dificultad encontrada fue la configuración correcta de los módulos SASS (uso de `@use` en lugar de `@import`) y la compilación correcta respetando la arquitectura 7-1. 

Otro desafío fue personalizar Bootstrap manteniendo la identidad visual propia, logrando un sitio que no parece un template genérico. La implementación de AOS para animaciones mejoró significativamente la experiencia de usuario, haciendo que el sitio se sienta dinámico y moderno.

El resultado es un sitio web institucional profesional, totalmente responsive y con un código mantenible gracias a la estructura de SASS.
