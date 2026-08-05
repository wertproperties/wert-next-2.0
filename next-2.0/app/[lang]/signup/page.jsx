import SignupPage from '@/components/pages/SignupPage';
import { SITE_NAME } from '@/lib/seo';

export async function generateMetadata() {
  return {
    title: `Registrieren | ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <SignupPage />;
}
