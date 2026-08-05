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
