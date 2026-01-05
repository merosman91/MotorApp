import React, { useState, useEffect } from 'react';
import { calculateSyncSpeed, calculateCurrent, calculateTorque, calculateSlip } from '../utils/motorMath';

const Calculator = () => {
  // الحالة (State) للمدخلات
  const [values, setValues] = useState({
    voltage: 400,    // الجهد (فولت)
    power: 5.5,      // القدرة (كيلوواط)
    frequency: 50,   // التردد (هرتز)
    poles: 4,        // عدد الأقطاب
    efficiency: 90,  // الكفاءة (%)
    powerFactor: 0.85, // معامل القدرة
    actualSpeed: 1450 // السرعة الفعلية (اختياري لحساب الانزلاق)
  });

  // الحالة للنتائج
  const [results, setResults] = useState({
    current: 0,
    syncSpeed: 0,
    torque: 0,
    slip: 0
  });

  // دالة تحديث المدخلات
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  // الحساب التلقائي عند تغيير أي قيمة
  useEffect(() => {
    const syncSpeed = calculateSyncSpeed(values.frequency, values.poles);
    const current = calculateCurrent(values.power, values.voltage, values.powerFactor, values.efficiency);
    // نستخدم السرعة الفعلية إذا وجدت، وإلا نستخدم التزامنية للتقريب
    const speedForTorque = values.actualSpeed || syncSpeed; 
    const torque = calculateTorque(values.power, speedForTorque);
    const slip = calculateSlip(syncSpeed, values.actualSpeed);

    setResults({
      syncSpeed: syncSpeed.toFixed(0),
      current: current.toFixed(2),
      torque: torque.toFixed(2),
      slip: slip.toFixed(2)
    });
  }, [values]);

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24"> {/* pb-24 لترك مسافة للبار السفلي */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-r-4 border-primary pr-3">
        حاسبة المحرك الحثي
      </h2>

      {/* قسم النتائج (بطاقة بارزة) */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl p-6 mb-8 shadow-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-blue-100 text-sm">التيار المتوقع</p>
            <p className="text-3xl font-bold">{results.current} <span className="text-sm">A</span></p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">العزم المقدر</p>
            <p className="text-3xl font-bold">{results.torque} <span className="text-sm">N.m</span></p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">السرعة التزامنية</p>
            <p className="text-xl font-semibold">{results.syncSpeed} <span className="text-xs">RPM</span></p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">الانزلاق</p>
            <p className="text-xl font-semibold">{results.slip} <span className="text-xs">%</span></p>
          </div>
        </div>
      </div>

      {/* قسم المدخلات */}
      <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">بيانات لوحة المحرك (Nameplate)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* الجهد */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">الجهد (Volt)</label>
            <input 
              type="number" name="voltage" value={values.voltage} onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none bg-gray-50"
            />
          </div>

          {/* القدرة */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">القدرة (kW)</label>
            <input 
              type="number" name="power" value={values.power} onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none bg-gray-50"
            />
          </div>

          {/* التردد */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">التردد (Hz)</label>
            <select 
              name="frequency" value={values.frequency} onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="50">50 Hz</option>
              <option value="60">60 Hz</option>
            </select>
          </div>

          {/* الأقطاب */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">عدد الأقطاب (Poles)</label>
            <select 
              name="poles" value={values.poles} onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none bg-white"
            >
              <option value="2">2 أقطاب (3000 rpm)</option>
              <option value="4">4 أقطاب (1500 rpm)</option>
              <option value="6">6 أقطاب (1000 rpm)</option>
              <option value="8">8 أقطاب (750 rpm)</option>
            </select>
          </div>

          {/* معامل القدرة */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">معامل القدرة (P.F)</label>
            <input 
              type="number" step="0.01" max="1" name="powerFactor" value={values.powerFactor} onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none bg-gray-50"
            />
          </div>

          {/* الكفاءة */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">الكفاءة Efficiency (%)</label>
            <input 
              type="number" max="100" name="efficiency" value={values.efficiency} onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none bg-gray-50"
            />
          </div>

           {/* السرعة الفعلية */}
           <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">السرعة الفعلية (RPM) <span className="text-xs text-gray-400">- اختياري لحساب الانزلاق</span></label>
            <input 
              type="number" name="actualSpeed" value={values.actualSpeed} onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none bg-gray-50"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Calculator;
