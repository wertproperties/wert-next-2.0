const PageSeo = require('../models/PageSeo');

const BASE_URL = 'https://www.hausverwaltungwert.de';
const OG_IMAGE = `${BASE_URL}/images/logo.png`;
const SITE_NAME = 'Hausverwaltung WERT';

/** Default SEO entries for public pages (DE + EN). */
const SEO_DEFAULTS = [
  {
    slug: 'home',
    titleDe: `Hausverwaltung Nürnberg | WEG, Wohn- & Gewerbeverwaltung | ${SITE_NAME}`,
    descriptionDe:
      'Professionelle Hausverwaltung für WEG, Mietwohnungen und Gewerbeimmobilien in Nürnberg und der Metropolregion. Hausverwaltung WERT steht für persönlichen Service, transparente Kommunikation und zuverlässige Verwaltung.',
    titleEn:
      'Property Management Nuremberg | HOA, Residential & Commercial Management | Hausverwaltung WERT',
    descriptionEn:
      'Professional property management for HOAs, residential rentals, and commercial properties in Nuremberg and the surrounding area. Hausverwaltung WERT stands for personalized service, transparent communication, and reliable management.',
    ogImage: OG_IMAGE,
    canonical: `${BASE_URL}/de`,
    noIndex: false,
  },
  {
    slug: 'services',
    titleDe: `Hausverwaltung Leistungen Nürnberg | WEG, Miet- & Gewerbeverwaltung | ${SITE_NAME}`,
    descriptionDe:
      'Professionelle Hausverwaltung in Nürnberg und der Metropolregion: WEG-Verwaltung, Sondereigentum, Mietverwaltung und Gewerbeverwaltung — persönlich, transparent und zuverlässig.',
    titleEn: `Property Management Services Nuremberg | HOA, Rental & Commercial | ${SITE_NAME}`,
    descriptionEn:
      'Professional property management services in Nuremberg and the metro region: HOA management, individual units, rentals and commercial properties.',
    ogImage: OG_IMAGE,
    canonical: `${BASE_URL}/de/leistungen`,
    noIndex: false,
  },
  {
    slug: 'contact',
    titleDe: `Kontakt Hausverwaltung Nürnberg | ${SITE_NAME}`,
    descriptionDe:
      'Kontaktieren Sie Hausverwaltung WERT in Zirndorf bei Nürnberg — persönliche Beratung zu WEG-, Miet- und Gewerbeverwaltung in der Metropolregion.',
    titleEn: `Contact Property Management Nuremberg | ${SITE_NAME}`,
    descriptionEn:
      'Get in touch with Hausverwaltung WERT in Zirndorf near Nuremberg — personal advice on HOA, rental and commercial management.',
    ogImage: OG_IMAGE,
    canonical: `${BASE_URL}/de/kontakt`,
    noIndex: false,
  },
  {
    slug: 'objects',
    titleDe: `Verwaltete Objekte Nürnberg | Wohn- & Gewerbeimmobilien | ${SITE_NAME}`,
    descriptionDe:
      'Einblick in Wohn- und Gewerbeimmobilien unter Verwaltung von Hausverwaltung WERT in Nürnberg und der Metropolregion Nürnberg.',
    titleEn: `Managed Properties Nuremberg | Residential & Commercial | ${SITE_NAME}`,
    descriptionEn:
      'A selection of residential and commercial properties managed by Hausverwaltung WERT in Nuremberg and the metro region.',
    ogImage: OG_IMAGE,
    canonical: `${BASE_URL}/de/objekte`,
    noIndex: false,
  },
  {
    slug: 'impressum',
    titleDe: `Impressum | ${SITE_NAME}`,
    descriptionDe: 'Impressum und rechtliche Informationen von Hausverwaltung WERT, Zirndorf / Nürnberg.',
    titleEn: `Legal Notice (Impressum) | ${SITE_NAME}`,
    descriptionEn: 'Legal notice and company information for Hausverwaltung WERT, Zirndorf / Nuremberg.',
    ogImage: OG_IMAGE,
    canonical: `${BASE_URL}/de/impressum`,
    noIndex: false,
  },
  {
    slug: 'datenschutz',
    titleDe: `Datenschutzerklärung | ${SITE_NAME}`,
    descriptionDe:
      'Datenschutzerklärung von Hausverwaltung WERT – Informationen zum Schutz Ihrer personenbezogenen Daten.',
    titleEn: `Privacy Policy | ${SITE_NAME}`,
    descriptionEn: 'Privacy policy of Hausverwaltung WERT – information on how we protect your personal data.',
    ogImage: OG_IMAGE,
    canonical: `${BASE_URL}/de/datenschutz`,
    noIndex: false,
  },
  {
    slug: 'locations',
    titleDe: `Standorte & Servicegebiet | Hausverwaltung Metropolregion Nürnberg | ${SITE_NAME}`,
    descriptionDe:
      'Hausverwaltung WERT betreut Immobilien in Nürnberg und der gesamten Metropolregion — inkl. Fürth, Erlangen, Schwabach, Zirndorf und Umgebung.',
    titleEn: `Locations & Service Area | Property Management Nuremberg Metro | ${SITE_NAME}`,
    descriptionEn:
      'Hausverwaltung WERT manages properties in Nuremberg and the entire metropolitan region — including Fürth, Erlangen, Schwabach, Zirndorf and surrounding areas.',
    ogImage: OG_IMAGE,
    canonical: `${BASE_URL}/de/standorte`,
    noIndex: false,
  },
];

/**
 * Upsert default SEO rows for any missing slugs (idempotent).
 */
async function ensureSeoDefaults() {
  for (const entry of SEO_DEFAULTS) {
    await PageSeo.updateOne(
      { slug: entry.slug },
      { $setOnInsert: entry },
      { upsert: true }
    );
  }
}

const CSV_HEADERS = [
  'slug',
  'titleDe',
  'descriptionDe',
  'titleEn',
  'descriptionEn',
  'ogImage',
  'canonical',
  'noIndex',
];

function escapeCsv(value) {
  const s = String(value ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowsToCsv(rows) {
  const lines = [CSV_HEADERS.join(',')];
  for (const row of rows) {
    lines.push(
      CSV_HEADERS.map((h) => {
        if (h === 'noIndex') return row.noIndex ? 'true' : 'false';
        return escapeCsv(row[h]);
      }).join(',')
    );
  }
  return `${lines.join('\n')}\n`;
}

/** RFC-4180 style CSV parse (supports quoted commas/newlines). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let i = 0;
  let inQuotes = false;
  const input = String(text || '').replace(/^\uFEFF/, '');

  while (i < input.length) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i += 1;
      row.push(field);
      field = '';
      if (row.some((c) => String(c).trim() !== '')) rows.push(row);
      row = [];
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }

  row.push(field);
  if (row.some((c) => String(c).trim() !== '')) rows.push(row);
  return rows;
}

function parseBool(value) {
  const v = String(value ?? '').trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes' || v === 'y';
}

function csvRowsToSeoRecords(csvText) {
  const matrix = parseCsv(csvText);
  if (!matrix.length) {
    return { records: [], errors: ['CSV is empty'] };
  }

  const header = matrix[0].map((h) => String(h).trim());
  const missing = CSV_HEADERS.filter((h) => !header.includes(h));
  if (missing.length) {
    return {
      records: [],
      errors: [`Missing required columns: ${missing.join(', ')}`],
    };
  }

  const index = Object.fromEntries(header.map((h, i) => [h, i]));
  const records = [];
  const errors = [];

  for (let r = 1; r < matrix.length; r += 1) {
    const cols = matrix[r];
    const slug = String(cols[index.slug] || '')
      .trim()
      .toLowerCase();
    if (!slug) {
      errors.push(`Row ${r + 1}: empty slug — skipped`);
      continue;
    }
    if (!PageSeo.ALLOWED_SLUGS.includes(slug)) {
      errors.push(
        `Row ${r + 1}: invalid slug "${slug}" — allowed: ${PageSeo.ALLOWED_SLUGS.join(', ')}`
      );
      continue;
    }

    records.push({
      slug,
      titleDe: String(cols[index.titleDe] ?? '').trim(),
      descriptionDe: String(cols[index.descriptionDe] ?? '').trim(),
      titleEn: String(cols[index.titleEn] ?? '').trim(),
      descriptionEn: String(cols[index.descriptionEn] ?? '').trim(),
      ogImage: String(cols[index.ogImage] ?? '').trim(),
      canonical: String(cols[index.canonical] ?? '').trim(),
      noIndex: parseBool(cols[index.noIndex]),
    });
  }

  return { records, errors };
}

// GET /api/seo
exports.getAllSeo = async (req, res) => {
  try {
    await ensureSeoDefaults();
    const entries = await PageSeo.find().sort({ slug: 1 });
    res.json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/seo/export  (admin) — download CSV of all SEO rows
exports.exportSeoCsv = async (req, res) => {
  try {
    await ensureSeoDefaults();
    const entries = await PageSeo.find().sort({ slug: 1 }).lean();
    const csv = rowsToCsv(entries);
    const filename = `seo-export-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(`\uFEFF${csv}`);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/seo/template  (admin) — example CSV matching import format
exports.downloadSeoTemplate = async (req, res) => {
  try {
    const csv = rowsToCsv(SEO_DEFAULTS);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="seo-import-example.csv"'
    );
    res.send(`\uFEFF${csv}`);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/seo/import  (admin) — upload CSV and upsert rows
exports.importSeoCsv = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is required (field name: file)',
      });
    }

    const text = req.file.buffer.toString('utf8');
    const { records, errors } = csvRowsToSeoRecords(text);

    if (!records.length) {
      return res.status(400).json({
        success: false,
        message: 'No valid SEO rows found in CSV',
        errors,
      });
    }

    let updated = 0;
    for (const record of records) {
      await PageSeo.findOneAndUpdate(
        { slug: record.slug },
        { $set: record },
        { upsert: true, runValidators: true, new: true }
      );
      updated += 1;
    }

    const entries = await PageSeo.find().sort({ slug: 1 });
    res.json({
      success: true,
      message: `Imported ${updated} SEO row(s)`,
      count: updated,
      errors,
      data: entries,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/seo/:slug
exports.getSeoBySlug = async (req, res) => {
  try {
    await ensureSeoDefaults();
    const entry = await PageSeo.findOne({ slug: req.params.slug.toLowerCase() });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'SEO entry not found' });
    }
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/seo/:slug  (admin)
exports.updateSeo = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    if (!PageSeo.ALLOWED_SLUGS.includes(slug)) {
      return res.status(400).json({
        success: false,
        message: `Invalid slug. Allowed: ${PageSeo.ALLOWED_SLUGS.join(', ')}`,
      });
    }

    const allowed = [
      'titleDe',
      'descriptionDe',
      'titleEn',
      'descriptionEn',
      'ogImage',
      'canonical',
      'noIndex',
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const entry = await PageSeo.findOneAndUpdate(
      { slug },
      { $set: updates, $setOnInsert: { slug } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/seo/seed  (admin) — force re-seed missing defaults
exports.seedSeo = async (req, res) => {
  try {
    await ensureSeoDefaults();
    const entries = await PageSeo.find().sort({ slug: 1 });
    res.json({
      success: true,
      message: 'SEO defaults ensured',
      count: entries.length,
      data: entries,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.SEO_DEFAULTS = SEO_DEFAULTS;
exports.ensureSeoDefaults = ensureSeoDefaults;
exports.rowsToCsv = rowsToCsv;
exports.CSV_HEADERS = CSV_HEADERS;
