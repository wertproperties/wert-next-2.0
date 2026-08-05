import PortalPage from '@/components/pages/PortalPage';
import { SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  return {
    title: `Kundenportal | ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <PortalPage />;
}
