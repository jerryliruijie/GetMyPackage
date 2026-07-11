import type { EvaluationInput } from './types';

export const defaultEvaluation: EvaluationInput = {
  objectType: 'offer',
  title: '新 Offer',
  city: '上海',
  monthlyBase: 50000,
  salaryMonths: 12,
  annualBonusMonths: 3,
  signOnBonus: 50000,
  rsuAnnualValue: 180000,
  optionAnnualValue: 0,
  mealSubsidyMonthly: 1200,
  commuteBenefitMonthly: 600,
  medicalBenefitAnnual: 3000,
  learningBudgetAnnual: 3000,
  commuteCostMonthly: 900,
  rentDeltaMonthly: 2200,
  workExpenseAnnual: 6000,
  riskDiscountRate: 15,
};

export const cityOptions = ['北京', '上海', '深圳', '杭州', '广州', '成都', '南京'];
