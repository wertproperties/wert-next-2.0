export default function DatenschutzPage() {
  return (
    <div className="bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-black text-slate-900 mb-10">
          Datenschutzerklärung
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-10 space-y-10">

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Allgemeine Hinweise
            </h2>

            <p>
              Der Schutz Ihrer personenbezogenen Daten ist uns wichtig.
              Wir behandeln Ihre Daten vertraulich und entsprechend
              der gesetzlichen Datenschutzvorschriften sowie dieser
              Datenschutzerklärung.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Verantwortlicher
            </h2>

            <p>
              Wert Hausverwaltung<br />
              Denis Sözdemir<br />
              Hinterm Bahnhof 4<br />
              90513 Zirndorf
            </p>

            <div className="mt-4">
              <p>E-Mail: wertproperties@gmail.com</p>
              <p>Telefon: +49 151 24261124</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Hosting
            </h2>

            <p>
              Diese Website wird bei Hostinger gehostet.
              Der Hosting-Anbieter verarbeitet personenbezogene Daten,
              soweit dies zur Bereitstellung der Website erforderlich ist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Kontaktformular
            </h2>

            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen,
              werden Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage
              gespeichert und verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Google Fonts
            </h2>

            <p>
              Diese Website verwendet Google Fonts zur einheitlichen Darstellung
              von Schriftarten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Cookies
            </h2>

            <p>
              Unsere Website verwendet Cookies.
              Sie können Ihre Einwilligung jederzeit über den Cookie-Banner
              ändern oder widerrufen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Ihre Rechte
            </h2>

            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
              Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
              Widerspruch gemäß DSGVO.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}