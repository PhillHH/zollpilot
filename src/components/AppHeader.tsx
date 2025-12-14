import type { UiLanguage } from "./FieldInput";

type Props = {
  language: UiLanguage;
  onLanguageChange: (lang: UiLanguage) => void;
  currentStep: number;
  totalSteps: number;
};

export function AppHeader({
  language,
  onLanguageChange,
  currentStep,
  totalSteps,
}: Props) {
  const percent = totalSteps === 0 ? 0 : Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            ZP
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              ZollPilot
            </p>
            <p className="text-base font-semibold text-slate-900">
              Geführte Zollanmeldung (Demo)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Sprache</label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as UiLanguage)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
              <span>
                Schritt {currentStep} von {totalSteps}
              </span>
              <span>{percent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-[width]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

