/**
 * Public contact details — single source of truth.
 *
 * Referenced by HomePage, ContactPage, Footer, ImpressumPage and DatenschutzPage.
 * Keeping one constant means the address shown on the site can never drift out of
 * sync with the one printed in the Impressum, where it is legally required (§ 5 DDG).
 *
 * ⚠ Before deploying: make sure a mailbox for CONTACT_EMAIL actually exists and that
 * the domain has valid MX records. If it does not, enquiries will bounce silently.
 * To fall back, change this one line back to 'hausverwaltungwert@outlook.com'.
 */
export const CONTACT_EMAIL = 'info@hausverwaltungwert.de';

export const CONTACT_PHONE = '+49 151 24261124';
export const CONTACT_PHONE_HREF = 'tel:+4915124261124';

/**
 * Business address. Must match the address printed in the Impressum,
 * where it is legally required (§ 5 DDG).
 * The country line is translated at the point of use (Deutschland / Germany).
 */
export const CONTACT_ADDRESS = {
  street: 'Hinterm Bahnhof 4',
  city: '90513 Zirndorf',
};
