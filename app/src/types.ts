export type EvaluationInput = {
  objectType: 'offer' | 'current';
  title: string;
  city: string;
  monthlyBase: number;
  salaryMonths: number;
  annualBonusMonths: number;
  signOnBonus: number;
  rsuAnnualValue: number;
  optionAnnualValue: number;
  mealSubsidyMonthly: number;
  commuteBenefitMonthly: number;
  medicalBenefitAnnual: number;
  learningBudgetAnnual: number;
  commuteCostMonthly: number;
  rentDeltaMonthly: number;
  workExpenseAnnual: number;
  riskDiscountRate: number;
};

export type EvaluationResult = {
  cashBeforeTax: number;
  nominalPackage: number;
  estimatedAfterTaxCash: number;
  riskAdjustedEquity: number;
  totalWorkCost: number;
  totalBenefitValue: number;
  benefitOffset: number;
  workCostDeduction: number;
  realPackage: number;
};

export type PersistedEvaluation = {
  appVersion: string;
  schemaVersion: string;
  updatedAt: string;
  input: EvaluationInput;
};
