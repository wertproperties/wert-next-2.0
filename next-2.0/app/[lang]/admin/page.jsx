import AdminPage from '@/components/pages/AdminPage';
import { SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  return {
    title: `Admin | ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <AdminPage />;
}
