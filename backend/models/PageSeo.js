const mongoose = require('mongoose');

const ALLOWED_SLUGS = [
  'home',
  'services',
  'contact',
  'objects',
  'impressum',
  'datenschutz',
  'locations',
];

const pageSeoSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      enum: ALLOWED_SLUGS,
    },
    titleDe: { type: String, default: '', trim: true },
    descriptionDe: { type: String, default: '', trim: true },
    titleEn: { type: String, default: '', trim: true },
    descriptionEn: { type: String, default: '', trim: true },
    ogImage: { type: String, default: '', trim: true },
    canonical: { type: String, default: '', trim: true },
    noIndex: { type: Boolean, default: false },
  },
  { timestamps: true }
);

pageSeoSchema.statics.ALLOWED_SLUGS = ALLOWED_SLUGS;

module.exports = mongoose.model('PageSeo', pageSeoSchema);
