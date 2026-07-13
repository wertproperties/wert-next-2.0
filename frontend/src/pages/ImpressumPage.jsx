import { useLang } from "../context/LangContext";

export default function ImpressumPage() {
  const { lang } = useLang();
  const isGerman = lang === "de";

  return (
    <div className="bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-black text-slate-900 mb-10">
          {isGerman ? "Impressum" : "Legal Notice"}
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-10 space-y-10">

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman
                ? "Angaben gemäß § 5 DDG"
                : "Information according to Section 5 DDG"}
            </h2>

            <p>
              <strong>Hausverwaltung WERT </strong><br />

              {isGerman ? "Inhaber" : "Owner"}: Denis Sözdemir<br />

              Hinterm Bahnhof 4<br />

              90513 Zirndorf<br />

              {isGerman ? "Deutschland" : "Germany"}
            </p>

            <div className="mt-6 space-y-2">
              <p>
                <strong>{isGerman ? "Telefon" : "Phone"}:</strong> +49 151 24261124
              </p>

              <p>
                <strong>E-Mail:</strong> hausverwaltungwert@outlook.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {isGerman
                ? "Erlaubnis nach § 34c GewO"
                : "License according to Section 34c GewO"}
            </h2>

            <p>
              {isGerman
                ? (
                  <>
                    Erlaubnis als Wohnimmobilienverwalter gemäß
                    § 34c Abs.1 Satz1 Nr.4 Gewerbeordnung (GewO).
                  </>
                )
                : (
                  <>
                    License as a residential property manager pursuant to
                    Section 34c Paragraph 1 Sentence 1 No. 4 of the German Trade Regulation Act (GewO).
                  </>
                )}
            </p>

            <div className="mt-5">

              <strong>
                {isGerman
                  ? "Zuständige Aufsichtsbehörde"
                  : "Supervisory Authority"}
              </strong>

              <p className="mt-2">
                {isGerman ? (
                  <>
                    Industrie- und Handelskammer für München und Oberbayern<br />
                    Max-Joseph-Straße 2<br />
                    80333 München
                  </>
                ) : (
                  <>
                    Chamber of Industry and Commerce for Munich and Upper Bavaria<br />
                    Max-Joseph-Straße 2<br />
                    80333 Munich, Germany
                  </>
                )}
              </p>

            </div>
          </section>

          <section>

            <h2 className="text-2xl font-bold mb-4">
              {isGerman
                ? "Haftung für Inhalte"
                : "Liability for Content"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Als Diensteanbieter sind wir gemäß den gesetzlichen
                  Vorschriften für eigene Inhalte auf diesen Seiten
                  verantwortlich. Eine Verpflichtung zur Überwachung
                  übermittelter oder gespeicherter fremder Informationen
                  besteht nur im Rahmen der gesetzlichen Bestimmungen.
                </>
              ) : (
                <>
                  As a service provider, we are responsible for our own
                  content on these pages in accordance with applicable
                  laws. We are not obliged to monitor transmitted or
                  stored third-party information except where required
                  by law.
                </>
              )}
            </p>

          </section>

          <section>

            <h2 className="text-2xl font-bold mb-4">
              {isGerman
                ? "Haftung für Links"
                : "Liability for Links"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Unsere Website enthält Links zu externen Websites
                  Dritter. Für deren Inhalte übernehmen wir keine
                  Gewähr. Für die Inhalte der verlinkten Seiten ist
                  ausschließlich der jeweilige Anbieter oder Betreiber
                  verantwortlich.
                </>
              ) : (
                <>
                  Our website contains links to external third-party
                  websites. We assume no liability for their content.
                  The respective provider or operator is solely
                  responsible for the content of linked websites.
                </>
              )}
            </p>

          </section>

          <section>

            <h2 className="text-2xl font-bold mb-4">
              {isGerman
                ? "Urheberrecht"
                : "Copyright"}
            </h2>

            <p>
              {isGerman ? (
                <>
                  Die auf dieser Website veröffentlichten Inhalte und
                  Werke unterliegen dem deutschen Urheberrecht. Jede
                  Vervielfältigung, Bearbeitung oder Verwertung
                  außerhalb der Grenzen des Urheberrechts bedarf der
                  vorherigen schriftlichen Zustimmung des jeweiligen
                  Rechteinhabers.
                </>
              ) : (
                <>
                  The content and works published on this website are
                  subject to German copyright law. Any reproduction,
                  editing, distribution or use beyond the limits of
                  copyright law requires the prior written consent of
                  the respective copyright holder.
                </>
              )}
            </p>

          </section>

        </div>

      </div>
    </div>
  );
}