// NusaData — logika situs: rute hash, tabel provinsi, pencarian, filter, unduh CSV.
// Semua data berasal dari DATA (data.js); tidak ada permintaan jaringan.
'use strict';

var SECTIONS = ['beranda', 'penduduk', 'ekonomi', 'kesehatan', 'pendidikan', 'wilayah', 'metodologi'];

function $(id) { return document.getElementById(id); }

function fmtID(n) {
  return n.toFixed(2).replace('.', ',');
}

// --- Router hash: #/beranda, #/penduduk, dst. Setiap seksi dicapai lewat tautan.
function currentRoute() {
  var hash = (location.hash || '#/beranda').replace(/^#\/?/, '');
  return SECTIONS.indexOf(hash) >= 0 ? hash : 'beranda';
}

function showSection(route) {
  SECTIONS.forEach(function (name) {
    var el = $('section-' + name);
    if (el) el.hidden = name !== route;
  });
  var links = document.querySelectorAll('.nav-link');
  for (var i = 0; i < links.length; i++) {
    var on = links[i].getAttribute('data-route') === route;
    links[i].classList.toggle('active', on);
    if (on) links[i].setAttribute('aria-current', 'page');
    else links[i].removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', function () {
  showSection(currentRoute());
});

// --- Kartu KPI beranda.
function renderKpi() {
  var wrap = $('kpi-grid');
  if (!wrap) return;
  wrap.innerHTML = DATA.kpi.map(function (k) {
    return '<a class="kpi-card" href="' + k.href + '">' +
      '<span class="kpi-label">' + k.label + '</span>' +
      '<span class="kpi-value">' + k.value + '</span>' +
      '<span class="kpi-detail">' + k.detail + '</span>' +
      '<span class="kpi-change">' + k.change + '</span>' +
      '<span class="kpi-source">Sumber: ' + k.source + ' ' + k.year + ' &rsaquo;</span>' +
      '</a>';
  }).join('');
}

// --- Sorotan 2025.
function renderUpdates() {
  var wrap = $('updates-list');
  if (!wrap) return;
  wrap.innerHTML = DATA.updates2025.map(function (u) {
    return '<li><strong>' + u.label + ' — ' + u.value + '</strong><br>' +
      u.detail + '<br><span class="src">Sumber: ' + u.source + '</span></li>';
  }).join('');
}

// --- Grafik: dipasang sekali saat muat.
function renderCharts() {
  var pop = $('chart-population');
  var popDup = $('chart-population-dup');
  var popSVG = lineChartSVG(
    DATA.populationSeries.map(function (p) { return { label: String(p.year), value: p.value }; }),
    { title: 'Penduduk Indonesia 2020-2024', decimals: 2, unit: '', color: '#0e6b5c', min: 260 }
  );
  if (pop) pop.innerHTML = popSVG;
  if (popDup) popDup.innerHTML = popSVG;
  var prov = $('chart-provinces');
  var provDup = $('chart-provinces-dup');
  var provSVG = hbarChartSVG(
    DATA.provinces.slice(0, 5).map(function (p) { return { name: p.name, value: p.pop }; }),
    {}
  );
  if (prov) prov.innerHTML = provSVG;
  if (provDup) provDup.innerHTML = provSVG;
  var gdp = $('chart-gdp');
  if (gdp) {
    gdp.innerHTML = barChartSVG(
      DATA.gdpGrowthSeries.map(function (p) { return { label: String(p.year), value: p.value }; }),
      { title: 'Pertumbuhan ekonomi 2020-2024', decimals: 2, unit: '%', color: '#0e6b5c' }
    );
  }
  var pov = $('chart-poverty');
  if (pov) {
    pov.innerHTML = barChartSVG(
      DATA.povertySeries.map(function (p) { return { label: p.label, value: p.value }; }),
      { title: 'Tingkat kemiskinan', decimals: 2, unit: '%', color: '#b4452f' }
    );
  }
  var hdi = $('chart-hdi');
  if (hdi) {
    hdi.innerHTML = lineChartSVG(
      DATA.hdiSeries.map(function (p) { return { label: String(p.year), value: p.value }; }),
      { title: 'IPM Indonesia 2020-2024', decimals: 2, unit: '', color: '#c98a1b', min: 70 }
    );
  }
  var hdiBars = $('chart-hdi-home');
  if (hdiBars) {
    hdiBars.innerHTML = lineChartSVG(
      DATA.hdiSeries.map(function (p) { return { label: String(p.year), value: p.value }; }),
      { title: 'IPM Indonesia 2020-2024', decimals: 2, unit: '', color: '#c98a1b', min: 70 }
    );
  }
}

// --- Tabel provinsi: pencarian + filter pulau + urutan + unduh CSV.
var provinceState = { query: '', island: 'Semua', sort: 'pop-desc' };

function filteredProvinces() {
  var rows = DATA.provinces.filter(function (p) {
    var okIsland = provinceState.island === 'Semua' || p.island === provinceState.island;
    var okQuery = provinceState.query === '' ||
      p.name.toLowerCase().indexOf(provinceState.query.toLowerCase()) >= 0;
    return okIsland && okQuery;
  });
  var s = provinceState.sort;
  rows.sort(function (a, b) {
    if (s === 'pop-desc') return b.pop - a.pop;
    if (s === 'pop-asc') return a.pop - b.pop;
    if (s === 'name') return a.name < b.name ? -1 : 1;
    if (s === 'share-desc') return b.share - a.share;
    return 0;
  });
  return rows;
}

function renderProvinceTable() {
  var body = $('province-rows');
  var count = $('province-count');
  if (!body) return;
  var rows = filteredProvinces();
  if (rows.length === 0) {
    body.innerHTML = '<tr><td colspan="4" class="empty">Tidak ada provinsi yang cocok dengan pencarian atau filter.</td></tr>';
  } else {
    body.innerHTML = rows.map(function (p, i) {
      return '<tr><td>' + (i + 1) + '</td><td>' + p.name + '</td><td>' + p.island +
        '</td><td class="num">' + fmtID(p.pop) + '</td><td class="num">' + fmtID(p.share) + '%</td></tr>';
    }).join('');
  }
  if (count) count.textContent = rows.length + ' dari 10 provinsi terpadat ditampilkan.';
}

function downloadProvincesCSV() {
  var rows = filteredProvinces();
  var lines = ['Provinsi,Pulau,Penduduk 2024 (juta jiwa),Pangsa (%)'];
  rows.forEach(function (p) {
    lines.push('"' + p.name + '",' + p.island + ',' + p.pop.toFixed(2) + ',' + p.share.toFixed(2));
  });
  var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'provinsi-terpadat-indonesia-2024.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}

function bindProvinceControls() {
  var q = $('province-search');
  if (q) q.addEventListener('input', function () {
    provinceState.query = q.value.trim();
    renderProvinceTable();
  });
  var f = $('province-island');
  if (f) f.addEventListener('change', function () {
    provinceState.island = f.value;
    renderProvinceTable();
  });
  var s = $('province-sort');
  if (s) s.addEventListener('change', function () {
    provinceState.sort = s.value;
    renderProvinceTable();
  });
  var dl = $('province-download');
  if (dl) dl.addEventListener('click', downloadProvincesCSV);
}

// --- Fakta wilayah.
function renderRegionFacts() {
  var wrap = $('region-facts');
  if (!wrap) return;
  wrap.innerHTML = DATA.regionFacts.map(function (f) {
    return '<div class="fact"><span class="fact-value">' + f.value + '</span>' +
      '<span class="fact-label">' + f.label + '</span>' +
      '<span class="fact-detail">' + f.detail + '</span></div>';
  }).join('');
}

// --- Sumber & definisi di Metodologi.
function renderSources() {
  var wrap = $('sources-list');
  if (!wrap) return;
  wrap.innerHTML = DATA.sources.map(function (s) {
    return '<li><strong>' + s.publisher + '</strong><br>' + s.items + '</li>';
  }).join('');
  var defs = $('definitions-list');
  if (defs) {
    defs.innerHTML = DATA.definitions.map(function (d) {
      return '<li><strong>' + d.term + '.</strong> ' + d.text + '</li>';
    }).join('');
  }
}

// --- Muat.
document.addEventListener('DOMContentLoaded', function () {
  renderKpi();
  renderUpdates();
  renderCharts();
  renderRegionFacts();
  renderSources();
  bindProvinceControls();
  renderProvinceTable();
  showSection(currentRoute());
});
