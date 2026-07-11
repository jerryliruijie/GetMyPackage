import { APP_VERSION, DATA_SCHEMA_VERSION, STORAGE_KEY } from './version';
import type { EvaluationInput, PersistedEvaluation } from './types';

export const loadEvaluation = (): EvaluationInput | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedEvaluation;
    if (parsed.schemaVersion !== DATA_SCHEMA_VERSION) return null;

    return parsed.input;
  } catch {
    return null;
  }
};

export const saveEvaluation = (input: EvaluationInput) => {
  const payload: PersistedEvaluation = {
    appVersion: APP_VERSION,
    schemaVersion: DATA_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    input,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};
