// NusaData — data statistik Indonesia.
// Setiap angka di bawah ini diambil dari publikasi resmi (BPS, Bank Indonesia,
// Kementerian Perdagangan, Dukcapil Kemendagri) dan diberi label sumber + tahun
// di sampingnya pada halaman Metodologi. Tidak ada angka estimasi di sini.
'use strict';

var DATA = {
  meta: {
    country: 'Indonesia',
    updated: '26 November 2026',
    baseYear: 2024,
    currency: 'Rp'
  },

  // Kartu angka besar di beranda (tahun dasar 2024).
  kpi: [
    {
      id: 'penduduk',
      label: 'Penduduk',
      value: '281,6 jt',
      detail: 'jiwa, pertengahan 2024',
      change: '+1,04% per tahun',
      source: 'BPS',
      year: 2024,
      href: '#/penduduk'
    },
    {
      id: 'pdb',
      label: 'PDB',
      value: 'Rp22.139 T',
      detail: 'harga berlaku, 2024',
      change: 'tumbuh 5,03%',
      source: 'BPS',
      year: 2024,
      href: '#/ekonomi'
    },
    {
      id: 'pdbkapita',
      label: 'PDB per kapita',
      value: 'Rp78,6 jt',
      detail: 'US$4.960,3 per orang, 2024',
      change: 'naik dari Rp74,9 jt (2023)',
      source: 'BPS',
      year: 2024,
      href: '#/ekonomi'
    },
    {
      id: 'inflasi',
      label: 'Inflasi',
      value: '1,57%',
      detail: 'yoy, Desember 2024',
      change: 'terendah sepanjang sejarah',
      source: 'BPS',
      year: 2024,
      href: '#/ekonomi'
    }
  ],

  // Sorotan pembaruan 2025 (angka resmi terbaru saat situs dibuat).
  updates2025: [
    {
      label: 'PDB 2025',
      value: 'Rp23.821,1 T',
      detail: 'tumbuh 5,11%; per kapita Rp83,7 jt (US$5.083,4)',
      source: 'BPS, rilis 5 Feb 2026'
    },
    {
      label: 'IPM 2025',
      value: '75,90',
      detail: 'naik 0,88 poin dari 75,02 (2024); harapan hidup 74,47 tahun',
      source: 'BPS, rilis 5 Nov 2025'
    },
    {
      label: 'Kemiskinan Mar 2025',
      value: '8,47%',
      detail: '23,85 jt orang; turun dari 8,57% (Sep 2024)',
      source: 'BPS Susenas Mar 2025'
    }
  ],

  // Tren penduduk 2020-2024 (juta jiwa, BPS).
  populationSeries: [
    { year: 2020, value: 270.20 },
    { year: 2021, value: 272.68 },
    { year: 2022, value: 275.77 },
    { year: 2023, value: 278.70 },
    { year: 2024, value: 281.60 }
  ],

  // Pertumbuhan ekonomi 2020-2024 (%, BPS).
  gdpGrowthSeries: [
    { year: 2020, value: -2.07 },
    { year: 2021, value: 3.70 },
    { year: 2022, value: 5.31 },
    { year: 2023, value: 5.05 },
    { year: 2024, value: 5.03 }
  ],

  // IPM 2020-2024 (BPS).
  hdiSeries: [
    { year: 2020, value: 72.81 },
    { year: 2021, value: 73.16 },
    { year: 2022, value: 73.77 },
    { year: 2023, value: 74.39 },
    { year: 2024, value: 75.02 }
  ],

  // Komponen IPM 2024 (BPS).
  hdiComponents2024: [
    { label: 'Umur harapan hidup', value: 74.15, unit: 'tahun' },
    { label: 'Harapan lama sekolah', value: 13.21, unit: 'tahun' },
    { label: 'Rata-rata lama sekolah', value: 8.85, unit: 'tahun' },
    { label: 'Pengeluaran riil per kapita', value: 12.34, unit: 'Rp jt/thn' }
  ],

  // Ketenagakerjaan, Agustus 2024 (BPS Sakernas).
  labour2024: {
    angkatanKerja: '152,11 jt orang',
    bekerja: '144,64 jt orang',
    penganggur: '7,47 jt orang',
    tpt: '4,91%',
    tptNote: 'di bawah level pra-pandemi 5,23% (2019)',
    formalShare: '42,05%',
    informalShare: '57,95%'
  },

  // Kemiskinan (BPS Susenas).
  povertySeries: [
    { label: 'Mar 2024', value: 9.03, people: '25,22 jt' },
    { label: 'Sep 2024', value: 8.57, people: '24,06 jt' },
    { label: 'Mar 2025', value: 8.47, people: '23,85 jt' }
  ],
  povertyLine2025: 'Rp609.160 per kapita per bulan',
  gini2025: '0,375',

  // Perdagangan luar negeri 2024 (BPS, diolah PDSI Kemendag).
  trade2024: {
    exports: 'US$264,70 miliar',
    exportsGrowth: '+2,29%',
    exportsNonOil: 'US$248,83 miliar',
    imports: 'US$233,66 miliar',
    importsGrowth: '+5,31%',
    surplus: 'US$31,04 miliar',
    reserves: 'US$155,7 miliar',
    reservesNote: 'akhir Des 2024, rekor tertinggi; setara 6,7 bulan impor',
    reservesSource: 'Bank Indonesia'
  },

  // 10 provinsi terpadat 2024 (juta jiwa, BPS). Pangsa dihitung dari total 281,60 jt.
  provinces: [
    { name: 'Jawa Barat', island: 'Jawa', pop: 50.35, share: 17.88 },
    { name: 'Jawa Timur', island: 'Jawa', pop: 41.92, share: 14.89 },
    { name: 'Jawa Tengah', island: 'Jawa', pop: 37.89, share: 13.46 },
    { name: 'Sumatera Utara', island: 'Sumatera', pop: 15.59, share: 5.54 },
    { name: 'Banten', island: 'Jawa', pop: 12.43, share: 4.41 },
    { name: 'DKI Jakarta', island: 'Jawa', pop: 10.67, share: 3.79 },
    { name: 'Sulawesi Selatan', island: 'Sulawesi', pop: 9.50, share: 3.37 },
    { name: 'Lampung', island: 'Sumatera', pop: 9.40, share: 3.34 },
    { name: 'Sumatera Selatan', island: 'Sumatera', pop: 8.80, share: 3.13 },
    { name: 'Riau', island: 'Sumatera', pop: 6.70, share: 2.38 }
  ],

  // Fakta wilayah.
  regionFacts: [
    { label: 'Provinsi', value: '38', detail: 'sejak pemekaran Papua 2022' },
    { label: 'Penduduk di Pulau Jawa', value: '55,93%', detail: 'Dukcapil, Semester I 2024' },
    { label: 'IPM tertinggi', value: 'DKI Jakarta 84,15', detail: 'IPM provinsi 2024, BPS' },
    { label: 'Provinsi terpadat', value: 'Jawa Barat', detail: '50,35 jt jiwa (2024, BPS)' }
  ],

  // Daftar sumber lengkap untuk halaman Metodologi.
  sources: [
    {
      publisher: 'Badan Pusat Statistik (BPS)',
      items: 'Jumlah penduduk & laju pertumbuhan 2024; PDB dan PDB per kapita 2024; inflasi IHK Desember 2024 (BRS No. 01/01/Th. XXVIII, 2 Jan 2025); IPM 2024 (75,02) dan komponennya; Sakernas Agustus 2024 (TPT 4,91%); Susenas Maret 2025 (kemiskinan 8,47%); penduduk menurut provinsi 2024.'
    },
    {
      publisher: 'Bank Indonesia (BI)',
      items: 'Cadangan devisa akhir Desember 2024 US$155,7 miliar (8 Jan 2025); analisis inflasi IHK 2024 dalam sasaran 2,5±1%.'
    },
    {
      publisher: 'Kementerian Perdagangan — PDSI (data BPS)',
      items: 'Perkembangan ekspor-impor Januari–Desember 2024: ekspor US$264,70 miliar, impor US$233,66 miliar, surplus US$31,04 miliar.'
    },
    {
      publisher: 'Ditjen Dukcapil, Kemendagri',
      items: 'Data Kependudukan Bersih Semester I 2024: 55,93% penduduk tinggal di Pulau Jawa; 38 provinsi.'
    }
  ],

  definitions: [
    {
      term: 'PDB',
      text: 'Produk Domestik Bruto: nilai seluruh barang dan jasa yang dihasilkan di dalam negeri selama setahun. “Harga berlaku” memakai harga tahun berjalan.'
    },
    {
      term: 'TPT',
      text: 'Tingkat Pengangguran Terbuka: persentase penganggur terhadap angkatan kerja (Sakernas, BPS).'
    },
    {
      term: 'IPM',
      text: 'Indeks Pembangunan Manusia (0–100): gabungan umur harapan hidup, pendidikan (harapan & rata-rata lama sekolah), dan pengeluaran riil per kapita.'
    },
    {
      term: 'Garis kemiskinan',
      text: 'Batas pengeluaran minimum per kapita per bulan; di bawahnya seseorang dikategorikan miskin (Susenas, BPS). Maret 2025: Rp609.160.'
    },
    {
      term: 'Inflasi yoy',
      text: 'Perubahan Indeks Harga Konsumen dibanding bulan yang sama tahun sebelumnya.'
    }
  ]
};
