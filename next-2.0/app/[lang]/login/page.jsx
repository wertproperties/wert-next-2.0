import LoginPage from '@/components/pages/LoginPage';
import { SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  return {
    title: `Anmelden | ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <LoginPage />;
}
