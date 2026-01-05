// src/utils/motorMath.js

/**
 * دالة لحساب السرعة التزامنية (Synchronous Speed)
 * Ns = (120 * f) / P
 */
export const calculateSyncSpeed = (frequency, poles) => {
    if (!frequency || !poles) return 0;
    return (120 * frequency) / poles;
};

/**
 * دالة لحساب التيار الحملي الكامل (Full Load Current) للمحرك ثلاثي الطور
 * I = (P_kw * 1000) / (sqrt(3) * V * PF * eff)
 */
export const calculateCurrent = (powerKW, voltage, powerFactor, efficiency) => {
    if (!powerKW || !voltage || !powerFactor || !efficiency) return 0;
    // تحويل الكفاءة من نسبة مئوية إلى رقم عشري (مثلاً 90 تصبح 0.9)
    const effDecimal = efficiency > 1 ? efficiency / 100 : efficiency;
    
    const denominator = Math.sqrt(3) * voltage * powerFactor * effDecimal;
    return (powerKW * 1000) / denominator;
};

/**
 * دالة لحساب العزم المقدر (Rated Torque)
 * T = (9550 * P_kw) / Speed
 */
export const calculateTorque = (powerKW, speedRPM) => {
    if (!powerKW || !speedRPM) return 0;
    return (9550 * powerKW) / speedRPM;
};

/**
 * دالة لحساب الانزلاق (Slip)
 * s% = ((Ns - N) / Ns) * 100
 */
export const calculateSlip = (syncSpeed, actualSpeed) => {
    if (!syncSpeed || !actualSpeed) return 0;
    return ((syncSpeed - actualSpeed) / syncSpeed) * 100;
};
