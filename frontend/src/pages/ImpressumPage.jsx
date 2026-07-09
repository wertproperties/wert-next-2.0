export default function ImpressumPage() {
  return (
    <div className="bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-black text-slate-900 mb-10">
          Impressum
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-10 space-y-10">

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Angaben gemäß § 5 DDG
            </h2>

            <p>
              <strong>Wert Hausverwaltung</strong><br />
              Inhaber: Denis Sözdemir<br />
              Hinterm Bahnhof 4<br />
              90513 Zirndorf<br />
              Deutschland
            </p>

            <div className="mt-6 space-y-2">
              <p><strong>Telefon:</strong> +49 151 24261124</p>
              <p><strong>E-Mail:</strong> wertproperties@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Erlaubnis nach § 34c GewO
            </h2>

            <p>
              Erlaubnis als Wohnimmobilienverwalter gemäß
              § 34c Abs.1 Satz1 Nr.4 Gewerbeordnung (GewO).
            </p>

            <div className="mt-5">
              <strong>Zuständige Aufsichtsbehörde</strong>

              <p className="mt-2">
                Industrie- und Handelskammer für München und Oberbayern<br />
                Max-Joseph-Straße 2<br />
                80333 München
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Haftung für Inhalte
            </h2>

            <p>
              Als Diensteanbieter sind wir gemäß den gesetzlichen
              Vorschriften für eigene Inhalte auf diesen Seiten verantwortlich.
              Eine Verpflichtung zur Überwachung übermittelter oder
              gespeicherter fremder Informationen besteht nur im Rahmen der
              gesetzlichen Bestimmungen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Haftung für Links
            </h2>

            <p>
              Unsere Website enthält Links zu externen Websites Dritter.
              Für deren Inhalte übernehmen wir keine Gewähr.
              Für die Inhalte der verlinkten Seiten ist ausschließlich
              der jeweilige Anbieter oder Betreiber verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Urheberrecht
            </h2>

            <p>
              Die auf dieser Website veröffentlichten Inhalte und Werke
              unterliegen dem deutschen Urheberrecht.
              Jede Vervielfältigung, Bearbeitung oder Verwertung außerhalb
              der Grenzen des Urheberrechts bedarf der vorherigen
              schriftlichen Zustimmung des jeweiligen Rechteinhabers.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}