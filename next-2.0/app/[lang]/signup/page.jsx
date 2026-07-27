import SignupPage from '@/components/pages/SignupPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isGerman = lang === 'de';
  return {
    title: isGerman ? 'Registrieren | Hausverwaltung WERT' : 'Sign Up | Hausverwaltung WERT',
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <SignupPage />;
}
