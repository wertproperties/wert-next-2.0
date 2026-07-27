import LoginPage from '@/components/pages/LoginPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isGerman = lang === 'de';
  return {
    title: isGerman ? 'Anmelden | Hausverwaltung WERT' : 'Sign In | Hausverwaltung WERT',
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <LoginPage />;
}
