# La evolución del rock en Spotify 🎸

Visualización interactiva que explora cómo han cambiado distintos rasgos musicales del rock a lo largo del tiempo, utilizando datos de Spotify.

El proyecto forma parte de la **Parte II: Proyecto de Visualización** de la asignatura **M2.859**, y está orientado a contar una historia a partir de los datos, más allá de un simple dashboard.

## 🌐 Visualización online

La visualización está disponible públicamente en GitHub Pages, sin necesidad de registro:

👉 https://marioarocapaez.github.io/M2.859_Practica/

---

## 🎯 Objetivo del proyecto

El objetivo principal es analizar y comunicar la evolución del sonido del rock a lo largo de las décadas, permitiendo responder preguntas como:

- ¿Cómo ha cambiado la energía, el tempo o la sonoridad del rock con el tiempo?
- ¿Qué relaciones existen entre distintos rasgos musicales?
- ¿Qué canciones destacan según distintos criterios (popularidad, energía, tempo, etc.)?
- ¿Cómo influyen las décadas en el estilo musical del rock?

La visualización combina análisis temporal, comparación de variables e interactividad para facilitar la exploración.

---

## 📊 Conjunto de datos

- **Fuente**: Spotify  
- **Dataset**: *History of Rock – Spotify*
- **Contenido**:
  - Información de canciones y artistas
  - Año de lanzamiento
  - Popularidad
  - Rasgos musicales como `energy`, `tempo`, `loudness`, `danceability`, `acousticness`, `valence`, entre otros

### Preparación de datos
- Conversión de campos a valores numéricos
- Eliminación de valores no válidos
- Uso del año de lanzamiento como eje temporal
- Selección de métricas relevantes para el análisis

---

## 🧩 Funcionalidades principales

- 📈 **Evolución temporal**: promedio anual de distintos rasgos musicales.
- 🔎 **Relación entre variables**: gráficos de dispersión interactivos con color por década.
- 🏆 **Top canciones configurable**:
  - Selección del criterio (popularidad, energía, tempo, etc.)
  - Selección del número de canciones a mostrar.
- 🎛️ **Interactividad**:
  - Filtros por rango de años
  - Selectores de métricas
  - Tooltips informativos
- ♿ **Accesibilidad**:
  - Alto contraste visual
  - No depender únicamente del color
  - Controles claros y etiquetados

---

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Plotly.js
- PapaParse
- GitHub Pages
- Prettier

---

## ▶️ Ejecución en local

Para ejecutar la visualización en un servidor web local:

```bash
git clone https://github.com/marioarocapaez/M2.859_Practica.git
cd M2.859_Practica
python -m http.server 8000
```

Abrir en el navegador:

```
http://localhost:8000
```

> ⚠️ No abrir `index.html` directamente con doble click, ya que el navegador bloquearía la carga del CSV por CORS.

---

## 📄 Licencia

Este proyecto se publica bajo licencia **MIT**.

---

## ✍️ Autor

**Mario Aroca Páez**

Proyecto académico realizado en el contexto de la asignatura **M2.859 – Visualización de datos**.
