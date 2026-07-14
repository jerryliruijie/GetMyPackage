import { useEffect, useMemo, useState } from 'react';
import { calculateEvaluation } from './calculation';
import { cityOptions, defaultEvaluation } from './defaults';
import { loadEvaluation, saveEvaluation } from './storage';
import type { EvaluationInput } from './types';
import { APP_BUILD_DATE, APP_VERSION, DATA_SCHEMA_VERSION } from './version';

type StepKey =
  | 'basic'
  | 'cash'
  | 'equity'
  | 'benefits'
  | 'costs'
  | 'risk';

const steps: { key: StepKey; label: string }[] = [
  { key: 'basic', label: '基础信息' },
  { key: 'cash', label: '现金收入' },
  { key: 'equity', label: '股票期权' },
  { key: 'benefits', label: '福利抵扣' },
  { key: 'costs', label: '工作成本' },
  { key: 'risk', label: '风险假设' },
];

const formatWan = (value: number) => {
  const abs = Math.abs(value);
  const digits = abs >= 100000 ? 1 : 2;
  return `${(value / 10000).toFixed(digits)} 万`;
};

const formatYuan = (value: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [screen, setScreen] = useState<'landing' | 'wizard'>('landing');
  const [activeStep, setActiveStep] = useState<StepKey>('basic');
  const [input, setInput] = useState<EvaluationInput>(() => {
    if (typeof window === 'undefined') return defaultEvaluation;
    return loadEvaluation() ?? defaultEvaluation;
  });

  const result = useMemo(() => calculateEvaluation(input), [input]);
  const currentStepIndex = steps.findIndex((step) => step.key === activeStep);

  useEffect(() => {
    saveEvaluation(input);
  }, [input]);

  const update = <K extends keyof EvaluationInput>(
    key: K,
    value: EvaluationInput[K],
  ) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const nextStep = () => {
    const next = steps[Math.min(currentStepIndex + 1, steps.length - 1)];
    setActiveStep(next.key);
  };

  const previousStep = () => {
    const previous = steps[Math.max(currentStepIndex - 1, 0)];
    setActiveStep(previous.key);
  };

  return (
    <main className="app">
      {screen === 'landing' ? (
        <Landing onStart={() => setScreen('wizard')} />
      ) : (
        <Wizard
          activeStep={activeStep}
          currentStepIndex={currentStepIndex}
          input={input}
          onBack={() => setScreen('landing')}
          onPrevious={previousStep}
          onNext={nextStep}
          result={result}
          setActiveStep={setActiveStep}
          update={update}
        />
      )}
    </main>
  );
}

function Brand() {
  return (
    <div className="brand" aria-label="年包包">
      <span className="brand-mark">包</span>
      <span>年包包</span>
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="landing">
      <header className="landing-header">
        <Brand />
        <span className="version-chip">v{APP_VERSION}</span>
      </header>

      <div className="hero">
        <div className="hero-copy">
          <h1>拆开 Offer，看见真实年包</h1>
          <p>
            把现金、股票、福利、通勤和工作成本放到同一张账本里，少一点猜测，多一点底气。
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={onStart}>
              开始估算
            </button>
            <span>数据只在本地浏览器保存</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img
            src="./assets/hero-ledger-v1.0.0.png"
            alt=""
            width="1586"
            height="992"
          />
        </div>
      </div>

      <div className="landing-strip">
        <span>本地优先</span>
        <span>单份 Offer/当前工作估值</span>
        <span>福利先抵扣成本</span>
      </div>
    </section>
  );
}

type WizardProps = {
  activeStep: StepKey;
  currentStepIndex: number;
  input: EvaluationInput;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  result: ReturnType<typeof calculateEvaluation>;
  setActiveStep: (step: StepKey) => void;
  update: <K extends keyof EvaluationInput>(
    key: K,
    value: EvaluationInput[K],
  ) => void;
};

function Wizard({
  activeStep,
  currentStepIndex,
  input,
  onBack,
  onPrevious,
  onNext,
  result,
  setActiveStep,
  update,
}: WizardProps) {
  return (
    <section className="wizard">
      <header className="wizard-header">
        <button className="ghost-button" type="button" onClick={onBack}>
          返回首页
        </button>
        <Brand />
        <div className="version-stack">
          <span>v{APP_VERSION}</span>
          <small>{DATA_SCHEMA_VERSION}</small>
        </div>
      </header>

      <div className="wizard-layout">
        <section className="form-panel">
          <div className="form-heading">
            <div>
              <h2>估算这一份机会</h2>
              <p>先用简化模型跑通口径，后续可以继续细化税务和城市规则。</p>
            </div>
            <span>自动本地保存</span>
          </div>

          <nav className="steps" aria-label="估算步骤">
            {steps.map((step, index) => (
              <button
                className={step.key === activeStep ? 'active' : ''}
                key={step.key}
                type="button"
                onClick={() => setActiveStep(step.key)}
              >
                <span>{index + 1}</span>
                {step.label}
              </button>
            ))}
          </nav>

          <StepFields activeStep={activeStep} input={input} update={update} />

          <div className="step-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onPrevious}
              disabled={currentStepIndex === 0}
            >
              上一步
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={onNext}
              disabled={currentStepIndex === steps.length - 1}
            >
              下一步
            </button>
          </div>
        </section>

        <ResultPanel input={input} result={result} />
      </div>

      <footer className="app-footer">
        <span>Build {APP_BUILD_DATE}</span>
        <span>计算结果仅用于个人决策参考，不构成税务、投资或法律建议。</span>
      </footer>
    </section>
  );
}

function StepFields({
  activeStep,
  input,
  update,
}: {
  activeStep: StepKey;
  input: EvaluationInput;
  update: WizardProps['update'];
}) {
  if (activeStep === 'basic') {
    return (
      <div className="field-grid">
        <label className="field field-wide">
          <span>评估对象</span>
          <input
            value={input.title}
            onChange={(event) => update('title', event.target.value)}
          />
        </label>
        <label className="field">
          <span>类型</span>
          <select
            value={input.objectType}
            onChange={(event) =>
              update('objectType', event.target.value as EvaluationInput['objectType'])
            }
          >
            <option value="offer">新 Offer</option>
            <option value="current">当前工作</option>
          </select>
        </label>
        <label className="field">
          <span>城市</span>
          <select
            value={input.city}
            onChange={(event) => update('city', event.target.value)}
          >
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (activeStep === 'cash') {
    return (
      <div className="field-grid">
        <NumberField
          label="月薪 base"
          suffix="元"
          value={input.monthlyBase}
          onChange={(value) => update('monthlyBase', value)}
        />
        <NumberField
          label="固定发薪月数"
          suffix="个月"
          value={input.salaryMonths}
          onChange={(value) => update('salaryMonths', value)}
        />
        <NumberField
          label="年终奖月数"
          suffix="个月"
          value={input.annualBonusMonths}
          onChange={(value) => update('annualBonusMonths', value)}
        />
        <NumberField
          label="签字费/安家费"
          suffix="元"
          value={input.signOnBonus}
          onChange={(value) => update('signOnBonus', value)}
        />
      </div>
    );
  }

  if (activeStep === 'equity') {
    return (
      <div className="field-grid">
        <NumberField
          label="RSU 年化价值"
          suffix="元"
          value={input.rsuAnnualValue}
          onChange={(value) => update('rsuAnnualValue', value)}
        />
        <NumberField
          label="期权年化价值"
          suffix="元"
          value={input.optionAnnualValue}
          onChange={(value) => update('optionAnnualValue', value)}
        />
      </div>
    );
  }

  if (activeStep === 'benefits') {
    return (
      <div className="field-grid">
        <NumberField
          label="餐补/餐食月价值"
          suffix="元"
          value={input.mealSubsidyMonthly}
          onChange={(value) => update('mealSubsidyMonthly', value)}
        />
        <NumberField
          label="班车/交通福利月价值"
          suffix="元"
          value={input.commuteBenefitMonthly}
          onChange={(value) => update('commuteBenefitMonthly', value)}
        />
        <NumberField
          label="补充医疗年价值"
          suffix="元"
          value={input.medicalBenefitAnnual}
          onChange={(value) => update('medicalBenefitAnnual', value)}
        />
        <NumberField
          label="学习/设备预算"
          suffix="元"
          value={input.learningBudgetAnnual}
          onChange={(value) => update('learningBudgetAnnual', value)}
        />
      </div>
    );
  }

  if (activeStep === 'costs') {
    return (
      <div className="field-grid">
        <NumberField
          label="通勤现金成本/月"
          suffix="元"
          value={input.commuteCostMonthly}
          onChange={(value) => update('commuteCostMonthly', value)}
        />
        <NumberField
          label="住房差异/月"
          suffix="元"
          value={input.rentDeltaMonthly}
          onChange={(value) => update('rentDeltaMonthly', value)}
        />
        <NumberField
          label="工作必要支出/年"
          suffix="元"
          value={input.workExpenseAnnual}
          onChange={(value) => update('workExpenseAnnual', value)}
        />
      </div>
    );
  }

  return (
    <div className="risk-section">
      <label className="range-field">
        <span>股票/期权风险折扣</span>
        <strong>{input.riskDiscountRate}%</strong>
        <input
          type="range"
          min="0"
          max="70"
          step="1"
          value={input.riskDiscountRate}
          onChange={(event) =>
            update('riskDiscountRate', Number(event.target.value))
          }
        />
      </label>
      <p>
        折扣越高，代表对股价波动、归属周期、离职损失和兑现不确定性越保守。
      </p>
    </div>
  );
}

function NumberField({
  label,
  onChange,
  suffix,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  suffix: string;
  value: number;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-with-suffix">
        <input
          inputMode="decimal"
          min="0"
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <em>{suffix}</em>
      </div>
    </label>
  );
}

function ResultPanel({
  input,
  result,
}: {
  input: EvaluationInput;
  result: ReturnType<typeof calculateEvaluation>;
}) {
  return (
    <aside className="result-panel">
      <div className="result-top">
        <span>{input.city}</span>
        <h2>{formatWan(result.realPackage)}</h2>
        <p>{input.title} 的真实年包估算</p>
      </div>

      <div className="result-list">
        <ResultRow label="名义年包" value={formatWan(result.nominalPackage)} />
        <ResultRow label="税后现金估算" value={formatWan(result.estimatedAfterTaxCash)} />
        <ResultRow label="风险后股票/期权" value={formatWan(result.riskAdjustedEquity)} />
        <ResultRow label="福利抵扣成本" value={formatYuan(result.benefitOffset)} />
        <ResultRow label="剩余成本扣减" value={`-${formatYuan(result.workCostDeduction)}`} />
      </div>

      <div className="formula-note">
        <strong>当前口径</strong>
        <p>
          真实年包 = 税后现金估算 + 风险后股权 - 工作成本净扣减。
          福利优先抵扣成本，不直接当作额外收入。
        </p>
      </div>
    </aside>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="result-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
