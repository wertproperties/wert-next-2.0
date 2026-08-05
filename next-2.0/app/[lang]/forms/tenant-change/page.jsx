import translations from '@/lib/translations';
import TenantChangePage from '@/components/pages/TenantChangePage';
import { SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  const tc = translations.de.pages.forms.tenant;
  return {
    title: `${tc.title} | ${SITE_NAME}`,
    description: tc.heroDesc,
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return <TenantChangePage />;
}
