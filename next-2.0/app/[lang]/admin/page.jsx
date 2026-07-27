import AdminPage from '@/components/pages/AdminPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isGerman = lang === 'de';
  return {
    title: isGerman ? 'Admin | Hausverwaltung WERT' : 'Admin | Hausverwaltung WERT',
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <AdminPage />;
}
