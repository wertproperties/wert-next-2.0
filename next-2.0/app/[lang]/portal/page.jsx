import PortalPage from '@/components/pages/PortalPage';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const isGerman = lang === 'de';
  return {
    title: isGerman ? 'Kundenportal | Hausverwaltung WERT' : 'Customer Portal | Hausverwaltung WERT',
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <PortalPage />;
}
