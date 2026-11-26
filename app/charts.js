// NusaData — pembangun grafik SVG inline (tanpa library luar).
// Semua grafik digambar dari DATA di data.js, jadi angka di layar dan di data
// selalu sama. Grafik memakai <svg> murni: tanpa fetch, tanpa font eksternal.
'use strict';

function chartEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

// Grafik garis dengan titik + label nilai. points: [{label, value}].
// opts: {width, height, decimals, unit, color, min}
function lineChartSVG(points, opts) {
  var w = opts.width || 640;
  var h = opts.height || 260;
  var padL = 46, padR = 14, padT = 22, padB = 30;
  var iw = w - padL - padR, ih = h - padT - padB;
  var vals = points.map(function (p) { return p.value; });
  var min = opts.min !== undefined ? opts.min : Math.min.apply(null, vals);
  var max = Math.max.apply(null, vals);
  if (max === min) max = min + 1;
  var span = max - min;
  var dec = opts.decimals !== undefined ? opts.decimals : 2;
  function x(i) { return padL + (iw * i) / (points.length - 1); }
  function y(v) { return padT + ih - ((v - min) / span) * ih; }
  var out = [];
  out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Grafik garis ' + chartEsc(opts.title || '') + '">');
  // Garis grid + label sumbu Y (min dan maks saja: label tengah bertabrakan
  // dengan label titik bila nilainya berdekatan, seperti 270,20 vs 270,80).
  for (var g = 0; g <= 2; g += 2) {
    var gv = min + (span * g) / 2;
    var gy = y(gv);
    out.push('<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" stroke="#dfe7e4" stroke-width="1"/>');
    out.push('<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#5b6b68">' + gv.toFixed(dec) + '</text>');
  }
  var d = points.map(function (p, i) {
    return (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(p.value).toFixed(1);
  }).join(' ');
  out.push('<path d="' + d + '" fill="none" stroke="' + (opts.color || '#0e6b5c') + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>');
  points.forEach(function (p, i) {
    var cx = x(i), cy = y(p.value);
    out.push('<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="4.5" fill="#fff" stroke="' + (opts.color || '#0e6b5c') + '" stroke-width="2.5"/>');
    out.push('<text x="' + cx.toFixed(1) + '" y="' + (cy - 11).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#12211d">' + p.value.toFixed(dec) + (opts.unit || '') + '</text>');
    out.push('<text x="' + cx.toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="11" fill="#5b6b68">' + chartEsc(p.label) + '</text>');
  });
  out.push('</svg>');
  return out.join('');
}

// Grafik batang vertikal. points: [{label, value}]. Mendukung nilai negatif
// (batang 2020 yang kontraksi digambar ke bawah dari garis nol).
function barChartSVG(points, opts) {
  var w = opts.width || 640;
  var h = opts.height || 260;
  var padL = 46, padR = 14, padT = 26, padB = 30;
  var iw = w - padL - padR, ih = h - padT - padB;
  var vals = points.map(function (p) { return p.value; });
  var min = Math.min(0, Math.min.apply(null, vals));
  var max = Math.max.apply(null, vals);
  if (max === min) max = min + 1;
  var span = max - min;
  var dec = opts.decimals !== undefined ? opts.decimals : 2;
  var n = points.length;
  var slot = iw / n;
  var bw = Math.min(64, slot * 0.58);
  function y(v) { return padT + ih - ((v - min) / span) * ih; }
  var out = [];
  out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Grafik batang ' + chartEsc(opts.title || '') + '">');
  var zeroY = y(0);
  out.push('<line x1="' + padL + '" y1="' + zeroY.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + zeroY.toFixed(1) + '" stroke="#94a39f" stroke-width="1.5"/>');
  for (var g = 0; g <= 2; g++) {
    var gv = min + (span * g) / 2;
    if (Math.abs(gv) < 1e-9) continue;
    var gy = y(gv);
    out.push('<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" stroke="#e6edea" stroke-width="1"/>');
    out.push('<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#5b6b68">' + gv.toFixed(dec) + '</text>');
  }
  points.forEach(function (p, i) {
    var cx = padL + slot * i + slot / 2;
    var top = y(Math.max(p.value, 0));
    var bottom = y(Math.min(p.value, 0));
    var neg = p.value < 0;
    var color = neg ? '#b4452f' : (opts.color || '#0e6b5c');
    out.push('<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(2, bottom - top).toFixed(1) + '" rx="4" fill="' + color + '"/>');
    // Label nilai: di atas batang untuk nilai positif; untuk batang negatif
    // (ke bawah dari garis nol) label diletakkan tepat di atas garis nol,
    // supaya tidak bertabrakan dengan label tahun di bawah sumbu.
    var labelY = top - 8;
    out.push('<text x="' + cx.toFixed(1) + '" y="' + labelY.toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + (neg ? '#b4452f' : '#12211d') + '">' + p.value.toFixed(dec) + (opts.unit || '') + '</text>');
    out.push('<text x="' + cx.toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="11" fill="#5b6b68">' + chartEsc(p.label) + '</text>');
  });
  out.push('</svg>');
  return out.join('');
}

// Grafik batang horizontal untuk daftar provinsi (dipakai di Beranda + Wilayah).
// rows: [{name, value}] — value dalam juta jiwa.
function hbarChartSVG(rows, opts) {
  var w = opts.width || 640;
  var rowH = opts.rowHeight || 34;
  var h = rowH * rows.length + 14;
  var padL = 128, padR = 58, padT = 6;
  var iw = w - padL - padR;
  var max = Math.max.apply(null, rows.map(function (r) { return r.value; }));
  var out = [];
  out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Grafik batang provinsi">');
  rows.forEach(function (r, i) {
    var y = padT + i * rowH;
    var bw = (r.value / max) * iw;
    out.push('<text x="' + (padL - 10) + '" y="' + (y + 17) + '" text-anchor="end" font-size="12" fill="#12211d">' + chartEsc(r.name) + '</text>');
    out.push('<rect x="' + padL + '" y="' + (y + 4) + '" width="' + Math.max(2, bw).toFixed(1) + '" height="18" rx="4" fill="' + (i === 0 ? '#c98a1b' : '#0e6b5c') + '"/>');
    out.push('<text x="' + (padL + bw + 8).toFixed(1) + '" y="' + (y + 18) + '" font-size="12" font-weight="700" fill="#12211d">' + r.value.toFixed(2) + ' jt</text>');
  });
  out.push('</svg>');
  return out.join('');
}
