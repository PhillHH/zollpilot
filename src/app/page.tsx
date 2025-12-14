"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { FieldInput, type UiLanguage } from "@/components/FieldInput";
import { SummaryPage } from "@/components/SummaryPage";
import type { ZollFeld } from "@/data/zollfelder";

const FLOW_FIELD_IDS = ["08_EMPFÄNGER", "20_LIEFERBEDINGUNG", "37_VERFAHREN"];
const SECTION_STEPS = [
  "Beteiligte",
  "Warenbeschreibung",
  "Zollwerte",
  "Dokumente",
  "Prüfen & Senden",
];

export default function Home() {
  const [language, setLanguage] = useState<UiLanguage>("de");
  const [fields, setFields] = useState<ZollFeld[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "summary">("form");

  useEffect(() => {
    const loadFields = async () => {
      try {
        const res = await fetch("/api/zollfelder");
        if (!res.ok) throw new Error("API antwortet nicht.");
        const data = (await res.json()) as { data: ZollFeld[] };
        setFields(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unbekannter Fehler beim Laden."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, []);

  const flowFields = useMemo(
    () => fields.filter((f) => FLOW_FIELD_IDS.includes(f.feldId)),
    [fields]
  );

  const totalSteps = (flowFields.length || 1) + 1; // +1 for summary step
  const filledCount = flowFields.filter((f) => (values[f.feldId] || "").length > 0).length;
  const currentStep =
    view === "summary"
      ? totalSteps
      : Math.min(flowFields.length, filledCount + 1);
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handleChange = (feldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [feldId]: value }));
  };

  const goNext = () => {
    setView("summary");
  };

  const goBack = () => {
    if (view === "summary") {
      setView("form");
    }
  };

  const activeSectionIndex = view === "summary" ? 1 : 0;
  const nextSectionTitle = SECTION_STEPS[activeSectionIndex + 1] ?? "Nächster Abschnitt";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <AppHeader
        language={language}
        onLanguageChange={setLanguage}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="mb-6 space-y-1">
            <p className="text-sm text-slate-600">
              Geführter Assistent · Import (ATLAS/ELMA)
            </p>
            <p className="text-xs text-slate-500">
              Schritte werden nacheinander angezeigt, Erklärungen sind
              umschaltbar (DE/EN).
            </p>
          </div>

          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-600">Lade Zollfelder…</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
              <p className="font-semibold">Fehler</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {view === "form" && (
                <div className="space-y-4">
                  {flowFields.map((feld) => (
                    <FieldInput
                      key={feld.feldId}
                      field={feld}
                      language={language}
                      value={values[feld.feldId] || ""}
                      onChange={(v) => handleChange(feld.feldId, v)}
                    />
                  ))}

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      onClick={goBack}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                      disabled
                    >
                      Zurück
                    </button>
                    <button
                      onClick={goNext}
                      className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      Weiter
                    </button>
                  </div>
                </div>
              )}

              {view === "summary" && (
                <SummaryPage
                  language={language}
                  fields={flowFields}
                  values={values}
                  onBack={goBack}
                  nextSectionTitle={nextSectionTitle}
                />
              )}
            </>
          )}
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                Abschnitts-Überblick
              </h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-700">
                {SECTION_STEPS.map((step, idx) => {
                  const isActive = idx === activeSectionIndex;
                  return (
                    <li
                      key={step}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 ${
                        isActive ? "bg-emerald-50 text-emerald-800 font-semibold" : ""
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-500">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 text-xs text-slate-500">
                Nach diesem Schritt benötigen wir deine Warennummer und Warenbeschreibung.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-sm">
              <p className="font-semibold">Nächste Aktion</p>
              <p className="mt-2 text-emerald-900">
                {view === "summary"
                  ? "Starte den Abschnitt Warenbeschreibung, um HS-Code und Positionsdaten zu erfassen."
                  : "Fülle die Beteiligten ab, dann geht es zur Warenbeschreibung."}
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

