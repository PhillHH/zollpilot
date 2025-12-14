import { useState } from "react";
import type { ZollFeld } from "@/data/zollfelder";

export type UiLanguage = "de" | "en";

type Props = {
  field: ZollFeld;
  language: UiLanguage;
  value: string;
  onChange: (value: string) => void;
};

const textForLang = (obj: Record<string, string> | undefined, lang: UiLanguage) =>
  obj?.[lang] ?? obj?.de ?? "";

export function FieldInput({ field, language, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const explanation = textForLang(field.erklaerung, language);
  const frage = textForLang(field.frage, language);
  const beispiel = textForLang(field.beispiele, language);
  const isHsCode = field.feldId.startsWith("33");
  const explanationLines = explanation
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {field.feldId}
          </p>
          <h2 className="text-sm font-semibold text-slate-900">{field.feldNameDe}</h2>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          aria-expanded={open}
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
            i
          </span>
          Hilfe
        </button>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900">{frage}</h3>

      <input
        className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
        placeholder={frage}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {open && (
        <div className="mt-3 space-y-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-700 shadow-inner">
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">Erklärung</p>
            <ul className="list-disc space-y-1 pl-4">
              {explanationLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          {beispiel && (
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">Beispiel</p>
              <p className="text-slate-700">{beispiel}</p>
            </div>
          )}
          <p className="text-xs text-slate-500">Validierung: {field.validierungsRegeln}</p>
          {isHsCode && (
            <p className="text-xs text-emerald-700">
              Tipp: Suche den Code im Elektronischen Zolltarif (EZT) oder TARIC:{" "}
              <a
                className="underline"
                href="https://auskunft.ezt-online.de/ezto/Welcome.do"
                target="_blank"
                rel="noreferrer"
              >
                EZT Online
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

