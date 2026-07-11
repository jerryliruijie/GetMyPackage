import type { EvaluationInput, EvaluationResult } from './types';

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
};

export const calculateEvaluation = (input: EvaluationInput): EvaluationResult => {
  const salaryMonths = clamp(input.salaryMonths, 0, 24);
  const bonusMonths = clamp(input.annualBonusMonths, 0, 24);
  const riskDiscountRate = clamp(input.riskDiscountRate, 0, 95) / 100;

  const cashBeforeTax =
    input.monthlyBase * (salaryMonths + bonusMonths) + input.signOnBonus;
  const equityBeforeRisk = input.rsuAnnualValue + input.optionAnnualValue;
  const riskAdjustedEquity = equityBeforeRisk * (1 - riskDiscountRate);

  const totalBenefitValue =
    input.mealSubsidyMonthly * 12 +
    input.commuteBenefitMonthly * 12 +
    input.medicalBenefitAnnual +
    input.learningBudgetAnnual;
  const totalWorkCost =
    input.commuteCostMonthly * 12 +
    input.rentDeltaMonthly * 12 +
    input.workExpenseAnnual;
  const benefitOffset = Math.min(totalBenefitValue, totalWorkCost);
  const workCostDeduction = Math.max(0, totalWorkCost - benefitOffset);

  return {
    cashBeforeTax,
    nominalPackage: cashBeforeTax + equityBeforeRisk,
    estimatedAfterTaxCash: cashBeforeTax * 0.78,
    riskAdjustedEquity,
    totalWorkCost,
    totalBenefitValue,
    benefitOffset,
    workCostDeduction,
    realPackage: cashBeforeTax * 0.78 + riskAdjustedEquity - workCostDeduction,
  };
};
