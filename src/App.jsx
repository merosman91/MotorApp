import { useState } from "react";

export default function App() {
  const [lang, setLang] = useState("ar");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Header lang={lang} setLang={setLang} />
      <Dashboard />
      <MotorCalculators lang={lang} />
    </div>
  );
}

function Header({ lang, setLang }) {
  return (
    <header className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-blue-700">
        {lang === "ar" ? "حاسبات المحرك الحثي" : "Induction Motor Calculators"}
      </h1>
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded"
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      >
        {lang === "ar" ? "EN" : "AR"}
      </button>
    </header>
  );
}

function Dashboard() {
  return (
    <section className="grid grid-cols-2 gap-3 mb-6">
      <Card title="تيار المحرك" icon="⚡" />
      <Card title="السرعة والعزم" icon="🔄" />
      <Card title="الكفاءة والطاقة" icon="📊" />
      <Card title="ستار–دلتا" icon="🔺" />
    </section>
  );
}

function MotorCalculators({ lang }) {
  return (
    <>
      <RatedCurrentCalculator lang={lang} />
      <SpeedTorqueCalculator lang={lang} />
      <EfficiencyCalculator lang={lang} />
      <ProtectionCalculator lang={lang} />
      <StarDeltaCalculator lang={lang} />
      <PowerUnitConverter lang={lang} />
    </>
  );
}

function PowerUnitConverter({ lang }) {
  const [hp, setHp] = useState(10);
  const [kw, setKw] = useState(7.46);

  const hpToKw = (value) => (value * 0.746).toFixed(2);
  const kwToHp = (value) => (value / 0.746).toFixed(2);

  return (
    <CalculatorCard title={lang === "ar" ? "التحويل بين HP و kW" : "HP ↔ kW Converter"}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            label={lang === "ar" ? "القدرة بالحصان (HP)" : "Power (HP)"}
            value={hp}
            onChange={(v) => {
              setHp(v);
              setKw(hpToKw(v));
            }}
          />
        </div>
        <div>
          <Input
            label={lang === "ar" ? "القدرة بالكيلوواط (kW)" : "Power (kW)"}
            value={kw}
            onChange={(v) => {
              setKw(v);
              setHp(kwToHp(v));
            }}
          />
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        ℹ️ العلاقة القياسية: 1 HP = 0.746 kW
      </div>
    </CalculatorCard>
  );
}
({ lang }) {
  return (
    <>
      <RatedCurrentCalculator lang={lang} />
      <SpeedTorqueCalculator lang={lang} />
      <EfficiencyCalculator lang={lang} />
      <ProtectionCalculator lang={lang} />
    </>
  );
}

function ProtectionCalculator({ lang }) {
  const [current, setCurrent] = useState(10);

  const mcb = Math.ceil(current * 1.25);
  const overloadMin = (current * 1.05).toFixed(1);
  const overloadMax = (current * 1.15).toFixed(1);
  const fuse = Math.ceil(current * 1.6);

  return (
    <CalculatorCard title={lang === "ar" ? "حاسبة الحماية الكهربائية" : "Motor Protection Calculator"}>
      <Input label="تيار المحرك (A)" value={current} onChange={setCurrent} />
      <div className="space-y-2">
        <Result value={`القاطع المناسب ≈ ${mcb} A`} />
        <Result value={`نطاق الأوفرلود: ${overloadMin} – ${overloadMax} A`} />
        <Result value={`الفيوز المقترح ≈ ${fuse} A`} />
      </div>
      <div className="mt-3 text-sm text-red-600">
        ⚠️ القيم إرشادية – راجع كتالوج الشركة المصنعة
      </div>
    </CalculatorCard>
  );
}

function StarDeltaCalculator({ lang }) {
  const [ratedCurrent, setRatedCurrent] = useState(15);
  const [ratedTorque, setRatedTorque] = useState(100);
  const [loadType, setLoadType] = useState("fan");
  const [motorPower, setMotorPower] = useState(7.5); // kW

  const starCurrent = (ratedCurrent / 3).toFixed(2);
  const deltaCurrent = ratedCurrent.toFixed(2);
  const reduction = ((1 - starCurrent / deltaCurrent) * 100).toFixed(0);
  const starTorque = (ratedTorque / 3).toFixed(1);

  // Transition time logic (industrial rules)
  let transitionTime;
  if (motorPower <= 5.5) transitionTime = 3;
  else if (motorPower <= 11) transitionTime = 5;
  else if (motorPower <= 22) transitionTime = 8;
  else transitionTime = 10;

  let warning = "";
  if (loadType !== "fan") {
    warning = lang === "ar"
      ? "⚠️ تحذير: ستار–دلتا غير مناسبة لهذا الحمل بسبب عزم البدء"
      : "⚠️ Warning: Star–Delta not suitable for this load";
  } else {
    warning = lang === "ar"
      ? "✅ ستار–دلتا مناسبة والحسابات آمنة"
      : "✅ Star–Delta suitable and safe";
  }

  return (
    <CalculatorCard title={lang === "ar" ? "ستار–دلتا (تحليل + تايمر)" : "Star–Delta (Torque & Timer)"}>
      <Input label="قدرة المحرك (kW)" value={motorPower} onChange={setMotorPower} />
      <Input label="تيار التشغيل المباشر (A)" value={ratedCurrent} onChange={setRatedCurrent} />
      <Input label="العزم الاسمي (Nm)" value={ratedTorque} onChange={setRatedTorque} />

      <div className="mb-3">
        <label className="block text-sm mb-1">{lang === "ar" ? "نوع الحمل" : "Load Type"}</label>
        <select className="w-full border rounded px-3 py-2" value={loadType} onChange={(e) => setLoadType(e.target.value)}>
          <option value="fan">مروحة / مضخة</option>
          <option value="compressor">ضاغط</option>
          <option value="conveyor">سير ناقل</option>
          <option value="crusher">كسارة</option>
        </select>
      </div>

      <div className="space-y-2">
        <Result value={`Iᵧ (Star) ≈ ${starCurrent} A`} />
        <Result value={`Tᵧ (Star) ≈ ${starTorque} Nm`} />
        <Result value={`IΔ (Delta) ≈ ${deltaCurrent} A`} />
        <Result value={`زمن الانتقال المقترح ≈ ${transitionTime} ثانية`} />
      </div>

      <div className={`mt-3 text-sm ${warning.includes("⚠️") ? "text-red-600" : "text-green-600"}`}>
        {warning}
      </div>
    </CalculatorCard>
  );
}
({ lang }) {
  const [ratedCurrent, setRatedCurrent] = useState(15);
  const [ratedTorque, setRatedTorque] = useState(100); // Nm
  const [loadType, setLoadType] = useState("fan");

  const starCurrent = (ratedCurrent / 3).toFixed(2);
  const deltaCurrent = ratedCurrent.toFixed(2);
  const reduction = ((1 - starCurrent / deltaCurrent) * 100).toFixed(0);

  // Torque relations
  const starTorque = (ratedTorque / 3).toFixed(1);

  let warning = "";
  if (loadType === "compressor" || loadType === "conveyor") {
    warning = lang === "ar"
      ? "⚠️ تحذير: ستار–دلتا غير مناسبة للأحمال ذات عزم البدء العالي"
      : "⚠️ Warning: Star–Delta not suitable for high starting torque loads";
  } else {
    warning = lang === "ar"
      ? "✅ ستار–دلتا مناسبة لهذا النوع من الأحمال"
      : "✅ Star–Delta is suitable for this load type";
  }

  return (
    <CalculatorCard title={lang === "ar" ? "ستار–دلتا (تحليل العزم الذكي)" : "Star–Delta (Smart Torque Analysis)"}>
      <Input
        label={lang === "ar" ? "تيار التشغيل المباشر DOL (A)" : "DOL Current (A)"}
        value={ratedCurrent}
        onChange={setRatedCurrent}
      />

      <Input
        label={lang === "ar" ? "العزم الاسمي للمحرك (Nm)" : "Rated Torque (Nm)"}
        value={ratedTorque}
        onChange={setRatedTorque}
      />

      <div className="mb-3">
        <label className="block text-sm mb-1">
          {lang === "ar" ? "نوع الحمل" : "Load Type"}
        </label>
        <select
          className="w-full border rounded px-3 py-2"
          value={loadType}
          onChange={(e) => setLoadType(e.target.value)}
        >
          <option value="fan">مروحة / مضخة</option>
          <option value="compressor">ضاغط</option>
          <option value="conveyor">سير ناقل</option>
          <option value="crusher">كسارة</option>
        </select>
      </div>

      <div className="space-y-2">
        <Result value={`Iᵧ (Star) ≈ ${starCurrent} A`} />
        <Result value={`Tᵧ (Star Torque) ≈ ${starTorque} Nm`} />
        <Result value={`IΔ (Delta) ≈ ${deltaCurrent} A`} />
        <Result value={`تخفيض التيار ≈ ${reduction}%`} />
      </div>

      <div className={`mt-3 text-sm ${warning.includes("⚠️") ? "text-red-600" : "text-green-600"}`}>
        {warning}
      </div>
    </CalculatorCard>
  );
}
({ lang }) {
  const [ratedCurrent, setRatedCurrent] = useState(15);

  const starCurrent = (ratedCurrent / 3).toFixed(2);
  const deltaCurrent = ratedCurrent.toFixed(2);
  const reduction = ((1 - starCurrent / deltaCurrent) * 100).toFixed(0);

  return (
    <CalculatorCard title={lang === "ar" ? "حاسبة ستار – دلتا الاحترافية" : "Star–Delta Calculator"}>
      <Input
        label={lang === "ar" ? "تيار التشغيل المباشر (A)" : "DOL Current (A)"}
        value={ratedCurrent}
        onChange={setRatedCurrent}
      />

      <div className="space-y-2">
        <Result value={`تيار البدء (Star) ≈ ${starCurrent} A`} />
        <Result value={`تيار التشغيل (Delta) ≈ ${deltaCurrent} A`} />
        <Result value={`نسبة تخفيض التيار ≈ ${reduction}%`} />
      </div>

      <div className="mt-3 text-sm text-orange-700">
        ℹ️ تُستخدم ستار–دلتا فقط إذا كان المحرك مصمم للعمل دلتا على جهد الشبكة
      </div>
    </CalculatorCard>
  );
}
({ lang }) {
  const [current, setCurrent] = useState(10);

  const mcb = Math.ceil(current * 1.25);
  const overloadMin = (current * 1.05).toFixed(1);
  const overloadMax = (current * 1.15).toFixed(1);
  const fuse = Math.ceil(current * 1.6);

  return (
    <CalculatorCard title={lang === "ar" ? "حاسبة الحماية الكهربائية" : "Motor Protection Calculator"}>
      <Input label="تيار المحرك (A)" value={current} onChange={setCurrent} />
      <div className="space-y-2">
        <Result value={`القاطع المناسب ≈ ${mcb} A`} />
        <Result value={`نطاق الأوفرلود: ${overloadMin} – ${overloadMax} A`} />
        <Result value={`الفيوز المقترح ≈ ${fuse} A`} />
      </div>
      <div className="mt-3 text-sm text-red-600">
        ⚠️ القيم إرشادية – راجع كتالوج الشركة المصنعة
      </div>
    </CalculatorCard>
  );
}
({ lang }) {
  return (
    <>
      <RatedCurrentCalculator lang={lang} />
      <SpeedTorqueCalculator lang={lang} />
      <EfficiencyCalculator lang={lang} />
    </>
  );
}

/* ================= CALCULATORS ================= */

function RatedCurrentCalculator({ lang }) {
  const [power, setPower] = useState(5);
  const [voltage, setVoltage] = useState(400);
  const [pf, setPf] = useState(0.8);
  const [eff, setEff] = useState(0.9);

  const current = (
    (power * 1000) /
    (Math.sqrt(3) * voltage * pf * eff)
  ).toFixed(2);

  return (
    <CalculatorCard title={lang === "ar" ? "التيار الاسمي" : "Rated Current"}>
      <Input label="القدرة (kW)" value={power} onChange={setPower} />
      <Input label="الجهد (V)" value={voltage} onChange={setVoltage} />
      <Input label="معامل القدرة PF" value={pf} onChange={setPf} step="0.01" />
      <Input label="الكفاءة η" value={eff} onChange={setEff} step="0.01" />
      <Result value={`${current} A`} />
    </CalculatorCard>
  );
}

function SpeedTorqueCalculator({ lang }) {
  const [freq, setFreq] = useState(50);
  const [poles, setPoles] = useState(4);
  const [power, setPower] = useState(5);

  const ns = (120 * freq) / poles;
  const torque = ((power * 9550) / ns).toFixed(2);

  return (
    <CalculatorCard title={lang === "ar" ? "السرعة والعزم" : "Speed & Torque"}>
      <Input label="التردد (Hz)" value={freq} onChange={setFreq} />
      <Input label="عدد الأقطاب" value={poles} onChange={setPoles} />
      <Input label="القدرة (kW)" value={power} onChange={setPower} />
      <Result value={`Ns = ${ns} RPM | T = ${torque} Nm`} />
    </CalculatorCard>
  );
}

function EfficiencyCalculator({ lang }) {
  const [power, setPower] = useState(5);
  const [hours, setHours] = useState(8);
  const [eff, setEff] = useState(0.9);

  const inputPower = (power / eff).toFixed(2);
  const energy = (inputPower * hours).toFixed(2);

  return (
    <CalculatorCard title={lang === "ar" ? "الكفاءة والطاقة" : "Efficiency & Energy"}>
      <Input label="القدرة الخارجة (kW)" value={power} onChange={setPower} />
      <Input label="ساعات التشغيل" value={hours} onChange={setHours} />
      <Input label="الكفاءة η" value={eff} onChange={setEff} step="0.01" />
      <Result value={`P(in) = ${inputPower} kW | E = ${energy} kWh`} />
    </CalculatorCard>
  );
}

/* ================= UI COMPONENTS ================= */

function Card({ title, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-medium">{title}</div>
    </div>
  );
}

function CalculatorCard({ title, children }) {
  return (
    <section className="bg-white p-4 mb-6 rounded-xl shadow">
      <h2 className="font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, step = "1" }) {
  return (
    <div className="mb-3">
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}

function Result({ value }) {
  return (
    <div className="mt-3 p-3 bg-blue-50 rounded font-semibold text-blue-800">
      {value}
    </div>
  );
}

## 🔗 الربط التلقائي بين جميع الحاسبات (Global Motor State)

### الفكرة
يتم إدخال **قدرة المحرك مرة واحدة فقط** (HP أو kW) مع **نوع المحرك**، ثم تُستخدم هذه القيم تلقائيًا في:
- حاسبة التيار
- حاسبة الحماية
- ستار–دلتا
- تحليل العزم
- زمن الانتقال والتايمر

### آلية التنفيذ (React)
- استخدام **Context API** أو **Zustand**
- تخزين القيم الأساسية في حالة عامة (Global State)

```jsx
// context/MotorContext.jsx
import { createContext, useContext, useState } from 'react';

const MotorContext = createContext();

export const MotorProvider = ({ children }) => {
  const [motor, setMotor] = useState({
    powerKW: 0,
    powerHP: 0,
    phaseType: 'three-phase',
    motorType: 'induction',
    voltage: 400,
    efficiency: 0.9,
    powerFactor: 0.85,
  });

  return (
    <MotorContext.Provider value={{ motor, setMotor }}>
      {children}
    </MotorContext.Provider>
  );
};

export const useMotor = () => useContext(MotorContext);
```

### مثال ربط حاسبة HP ↔ kW
```jsx
const { motor, setMotor } = useMotor();

const onHPChange = (hp) => {
  setMotor({
    ...motor,
    powerHP: hp,
    powerKW: hp * 0.746,
  });
};
```

---
## ⚙️ إضافة أنواع المحركات (Motor Types)

### 1️⃣ حسب عدد الفازات
- 🔹 محرك **أحادي الطور (1 Phase)**
- 🔹 محرك **ثلاثي الطور (3 Phase)**

```js
phaseType: 'single-phase' | 'three-phase'
```

### 2️⃣ حسب طريقة البدء والتشغيل
- 🔹 محرك حثي عادي (Induction Motor)
- 🔹 محرك **بمفتاح طرد مركزي** (Capacitor Start / Run)
- 🔹 محرك مكثف دائم (PSC)
- 🔹 محرك ستار–دلتا
- 🔹 محرك مع VFD

```js
motorType: 'induction' | 'capacitor-start' | 'psc' | 'star-delta' | 'vfd'
```

---
## 🧠 تأثير نوع المحرك على الحسابات

| النوع | يؤثر على |
|----|----|
| 1 فاز | التيار – المكثف – الحماية |
| 3 فاز | التيار – ستار دلتا – العزم |
| طرد مركزي | تيار البدء العالي |
| VFD | تقليل تيار البدء – العزم |

مثال تلقائي:
```js
if (motor.motorType === 'capacitor-start') {
  startCurrentMultiplier = 3.5;
}
```

---
## 🎛️ واجهة اختيار نوع المحرك

- قائمة منسدلة ذكية
- تتغير الحاسبات الظاهرة حسب النوع

```jsx
<select onChange={(e) => setMotor({...motor, motorType: e.target.value})}>
  <option value="induction">حثي عادي</option>
  <option value="capacitor-start">بمفتاح طرد مركزي</option>
  <option value="psc">مكثف دائم</option>
  <option value="star-delta">ستار – دلتا</option>
  <option value="vfd">مع VFD</option>
</select>
```

---
## ✅ النتيجة النهائية
- إدخال واحد → كل الحاسبات تتحدث تلقائيًا
- تقليل الأخطاء
- تجربة احترافية
- جاهز للتوسعة التجارية

---
### الخطوة التالية المقترحة 🚀
🔜 **ربط نوع المحرك تلقائيًا بإظهار/إخفاء الحاسبات المناسبة + نظام تحذير ذكي حسب النوع**

