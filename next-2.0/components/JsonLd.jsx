export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'Hausverwaltung WERT',
    'image': 'https://www.hausverwaltungwert.de/images/logo.png',
    '@id': 'https://www.hausverwaltungwert.de/#organization',
    'url': 'https://www.hausverwaltungwert.de',
    'telephone': '+49 151 24261124',
    'email': 'info@hausverwaltungwert.de',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Hinterm Bahnhof 4',
      'addressLocality': 'Zirndorf',
      'postalCode': '90513',
      'addressCountry': 'DE'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 49.4447,
      'longitude': 10.9575
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      'opens': '08:00',
      'closes': '17:00'
    },
    'sameAs': []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
