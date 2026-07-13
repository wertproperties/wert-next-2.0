import { useLang } from "../context/LangContext";

export default function DatenschutzPage() {
  const { lang } = useLang();
  const isGerman = lang === "de";

  return (
    <div className="bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-black text-slate-900 mb-10">
          {isGerman ? "Datenschutzerklärung" : "Privacy Policy"}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-10 space-y-10">

          {/* General */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Allgemeine Hinweise" : "General Information"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Der Schutz Ihrer personenbezogenen Daten ist uns wichtig.
                  Wir behandeln Ihre Daten vertraulich und entsprechend der
                  gesetzlichen Datenschutzvorschriften sowie dieser
                  Datenschutzerklärung.
                </>
              ) : (
                <>
                  The protection of your personal data is important to us.
                  We treat your personal data confidentially and in accordance
                  with the applicable data protection regulations and this
                  Privacy Policy.
                </>
              )}
            </p>
          </section>

          {/* Controller */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Verantwortlicher" : "Data Controller"}
            </h2>

            <p>
              <strong>Hausverwaltung WERT </strong><br />
              Denis Sözdemir<br />
              Hinterm Bahnhof 4<br />
              90513 Zirndorf<br />
              {isGerman ? "Deutschland" : "Germany"}
            </p>

            <div className="mt-4">
              <p>
                <strong>E-Mail:</strong> hausverwaltungwert@outlook.com
              </p>

              <p>
                <strong>{isGerman ? "Telefon" : "Phone"}:</strong> +49 151 24261124
              </p>
            </div>
          </section>

          {/* Hosting */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Hosting" : "Hosting"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Diese Website wird bei Hostinger gehostet.
                  Der Hosting-Anbieter verarbeitet personenbezogene Daten,
                  soweit dies zur Bereitstellung der Website erforderlich ist.
                </>
              ) : (
                <>
                  This website is hosted by Hostinger.
                  The hosting provider processes personal data only as
                  necessary to provide and maintain this website.
                </>
              )}
            </p>
          </section>

          {/* Contact Form */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Kontaktformular" : "Contact Form"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen,
                  werden Ihre Angaben ausschließlich zur Bearbeitung Ihrer
                  Anfrage gespeichert und verarbeitet.
                </>
              ) : (
                <>
                  If you contact us using the contact form, the information
                  you provide will only be stored and processed for the
                  purpose of handling your request.
                </>
              )}
            </p>
          </section>

          {/* Google Fonts */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Google Fonts
            </h2>

            <p>
              {isGerman ? (
                <>
                  Diese Website verwendet Google Fonts zur einheitlichen
                  Darstellung von Schriftarten.
                </>
              ) : (
                <>
                  This website uses Google Fonts to provide a consistent
                  display of fonts.
                </>
              )}
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Cookies" : "Cookies"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Unsere Website verwendet Cookies.
                  Sie können Ihre Einwilligung jederzeit über den
                  Cookie-Banner ändern oder widerrufen.
                </>
              ) : (
                <>
                  Our website uses cookies.
                  You may change or withdraw your consent at any time
                  through the cookie banner.
                </>
              )}
            </p>
          </section>

          {/* Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman ? "Ihre Rechte" : "Your Rights"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Sie haben das Recht auf Auskunft,
                  Berichtigung, Löschung,
                  Einschränkung der Verarbeitung,
                  Datenübertragbarkeit sowie Widerspruch
                  gemäß DSGVO.
                </>
              ) : (
                <>
                  You have the right to access,
                  rectify, erase and restrict the processing
                  of your personal data, as well as the
                  right to data portability and to object
                  to processing in accordance with the GDPR.
                </>
              )}
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}