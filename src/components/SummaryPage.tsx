import type { UiLanguage } from "./FieldInput";
import type { ZollFeld } from "@/data/zollfelder";

type Props = {
  language: UiLanguage;
  fields: ZollFeld[];
  values: Record<string, string>;
  onBack: () => void;
  nextSectionTitle: string;
};

const textForLang = (obj: Record<string, string> | undefined, lang: UiLanguage) =>
  obj?.[lang] ?? obj?.de ?? "";

export function SummaryPage({
  language,
  fields,
  values,
  onBack,
  nextSectionTitle,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-emerald-900">
          Abschnitt abgeschlossen: Informationen zu den Beteiligten
        </h2>
        <p className="mt-1 text-sm text-emerald-800">
          Prüfe kurz die Angaben, bevor es weitergeht.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Zusammenfassung</h3>
        <dl className="mt-3 divide-y divide-slate-100 text-sm">
          {fields.map((field) => (
            <div key={field.feldId} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.feldId}
                </p>
                <p className="font-semibold text-slate-900">{field.feldNameDe}</p>
                <p className="text-xs text-slate-500">
                  {textForLang(field.frage, language)}
                </p>
              </div>
              <p className="text-sm text-slate-800 sm:max-w-sm">
                {values[field.feldId] && values[field.feldId].trim().length > 0
                  ? values[field.feldId]
                  : "Nicht ausgefüllt"}
              </p>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          Zurück zur Eingabe
        </button>
        <button
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          Nächster Hauptabschnitt starten: {nextSectionTitle}
        </button>
      </div>
    </div>
  );
}

