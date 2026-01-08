const DATA_URL = "data/rock.csv";

let rows = [];
let yearMinGlobal = 0;
let yearMaxGlobal = 0;

function toYear(v) {
  // En tu CSV release_date ya viene como año (ej. 1991)
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function decadeOf(year) {
  return Math.floor(year / 10) * 10;
}

function filteredRows() {
  const yMin = Number(document.getElementById("yearMin").value);
  const yMax = Number(document.getElementById("yearMax").value);
  return rows.filter(r => r.year >= yMin && r.year <= yMax);
}

function buildYearlySeries(metric, data) {
  // promedio anual por métrica
  const byYear = new Map();
  for (const r of data) {
    const val = r[metric];
    if (val === null || val === undefined) continue;
    const key = r.year;
    if (!byYear.has(key)) byYear.set(key, { sum: 0, n: 0 });
    const obj = byYear.get(key);
    obj.sum += val;
    obj.n += 1;
  }
  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  const values = years.map(y => byYear.get(y).sum / byYear.get(y).n);
  return { years, values };
}

function renderLine() {
  const metric = document.getElementById("metric").value;
  const data = filteredRows();
  const { years, values } = buildYearlySeries(metric, data);

  const trace = {
    x: years,
    y: values,
    type: "scatter",
    mode: "lines+markers",
    hovertemplate: "Año %{x}<br>" + metric + " (media): %{y:.3f}<extra></extra>"
  };

  const layout = {
    margin: { t: 25, r: 10, b: 45, l: 55 },
    xaxis: { title: "Año" },
    yaxis: { title: `${metric} (media anual)` },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: "#e9eef5" }
  };

  Plotly.newPlot("lineChart", [trace], layout, { responsive: true });
}

function renderScatter() {
  const xM = document.getElementById("xMetric").value;
  const yM = document.getElementById("yMetric").value;
  const data = filteredRows();

  // Agrupar por década para colorear
  const groups = new Map();
  for (const r of data) {
    const x = r[xM], y = r[yM];
    if (x === null || y === null) continue;
    const d = decadeOf(r.year);
    if (!groups.has(d)) groups.set(d, []);
    groups.get(d).push(r);
  }

  const traces = Array.from(groups.keys())
    .sort((a, b) => a - b)
    .map(d => {
      const g = groups.get(d);
      return {
        name: `${d}s`,
        x: g.map(r => r[xM]),
        y: g.map(r => r[yM]),
        type: "scatter",
        mode: "markers",
        marker: { size: 7, opacity: 0.75 },
        text: g.map(r => `${r.name} — ${r.artist} (${r.year})`),
        hovertemplate:
          "%{text}<br>" +
          xM + ": %{x:.3f}<br>" +
          yM + ": %{y:.3f}<extra></extra>"
      };
    });

  const layout = {
    margin: { t: 25, r: 10, b: 50, l: 55 },
    xaxis: { title: xM },
    yaxis: { title: yM },
    legend: { orientation: "h" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: "#e9eef5" }
  };

  Plotly.newPlot("scatterChart", traces, layout, { responsive: true });
}

function renderTopTable() {
  const data = filteredRows();

  const metric = document.getElementById("topMetric")?.value || "popularity";
  let topN = Number(document.getElementById("topN")?.value ?? 10);
  if (!Number.isFinite(topN) || topN < 1) topN = 10;
  topN = Math.min(topN, 100);

  // Filtrar filas que tengan la métrica
  const filtered = data.filter(r => r[metric] !== null && r[metric] !== undefined);

  // Orden descendente (top = valores más altos)
  filtered.sort((a, b) => (b[metric] ?? -Infinity) - (a[metric] ?? -Infinity));

  const top = filtered.slice(0, topN);

  const html = `
    <p class="hint">
      Mostrando Top ${top.length} por <b>${metric}</b> (rango años aplicado).
    </p>
    <table class="top">
      <thead>
        <tr>
          <th>#</th>
          <th>Canción</th>
          <th>Artista</th>
          <th>Año</th>
          <th>${metric}</th>
        </tr>
      </thead>
      <tbody>
        ${top.map((r, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${r.name ?? ""}</td>
            <td>${r.artist ?? ""}</td>
            <td>${r.year ?? ""}</td>
            <td>${(r[metric] ?? "").toString()}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  document.getElementById("topTable").innerHTML = html;
}


function hookUI() {
  document.getElementById("apply").addEventListener("click", () => {
    renderLine();
    renderScatter();
    renderTopTable();
  });

  document.getElementById("updateScatter").addEventListener("click", () => {
    renderScatter();
  });

  document.getElementById("updateTop").addEventListener("click", () => {
    renderTopTable();
  });

  // actualizar el top automáticamente al cambiar selector/cantidad
  document.getElementById("topMetric").addEventListener("change", renderTopTable);
  document.getElementById("topN").addEventListener("change", renderTopTable);
}

function setYearInputs(minY, maxY) {
  const yMin = document.getElementById("yearMin");
  const yMax = document.getElementById("yearMax");
  yMin.value = minY;
  yMax.value = maxY;
}

function loadData() {
  Papa.parse(DATA_URL, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      // Normalizamos filas
      rows = results.data
        .map(r => ({
          name: r.name,
          artist: r.artist,
          year: toYear(r.release_date),
          popularity: toNum(r.popularity),

          // métricas Spotify
          danceability: toNum(r.danceability),       // ignoramos danceability.1
          energy: toNum(r.energy),
          tempo: toNum(r.tempo),
          loudness: toNum(r.loudness),
          acousticness: toNum(r.acousticness),
          valence: toNum(r.valence),
          speechiness: toNum(r.speechiness),
          liveness: toNum(r.liveness),
          instrumentalness: toNum(r.instrumentalness),
        }))
        .filter(r => r.year !== null);

      yearMinGlobal = Math.min(...rows.map(r => r.year));
      yearMaxGlobal = Math.max(...rows.map(r => r.year));
      setYearInputs(yearMinGlobal, yearMaxGlobal);

      hookUI();
      renderLine();
      renderScatter();
      renderTopTable();
    }
  });
}

loadData();
