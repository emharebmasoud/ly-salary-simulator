import React, { useState, useMemo } from 'react';
import { 
  Building2, Users, Calculator, FileText, TrendingUp, DollarSign, 
  AlertTriangle, Layers, BarChart3, Printer, Sliders
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';

const initialGradeData = [
  { grade: 1, baseSalary: 1000, annualAllowance: 20, count: 120000 },
  { grade: 2, baseSalary: 1080, annualAllowance: 22, count: 180000 },
  { grade: 3, baseSalary: 1170, annualAllowance: 25, count: 250000 },
  { grade: 4, baseSalary: 1270, annualAllowance: 28, count: 320000 },
  { grade: 5, baseSalary: 1380, annualAllowance: 32, count: 380000 },
  { grade: 6, baseSalary: 1500, annualAllowance: 36, count: 310000 },
  { grade: 7, baseSalary: 1640, annualAllowance: 40, count: 240000 },
  { grade: 8, baseSalary: 1800, annualAllowance: 45, count: 190000 },
  { grade: 9, baseSalary: 1980, annualAllowance: 50, count: 140000 },
  { grade: 10, baseSalary: 2180, annualAllowance: 55, count: 95000 },
  { grade: 11, baseSalary: 2400, annualAllowance: 60, count: 45000 },
  { grade: 12, baseSalary: 2650, annualAllowance: 65, count: 20000 },
  { grade: 13, baseSalary: 2950, annualAllowance: 70, count: 8000 },
  { grade: 14, baseSalary: 3300, annualAllowance: 80, count: 3000 },
  { grade: 15, baseSalary: 3750, annualAllowance: 90, count: 1200 },
  { grade: 16, baseSalary: 4300, annualAllowance: 100, count: 400 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('simulation');
  
  const [minSalary, setMinSalary] = useState(1000);
  const [housingAllowanceRate, setHousingAllowanceRate] = useState(20);
  const [socialSecurityTaxRate] = useState(10.5);
  const [incomeTaxRate] = useState(9);
  const [stampDutyRate] = useState(1.5);
  const [grades, setGrades] = useState(initialGradeData);
  const [inflationRate, setInflationRate] = useState(3.5);

  const totalEmployees = useMemo(() => {
    return grades.reduce((acc, curr) => acc + curr.count, 0);
  }, [grades]);

  const calculations = useMemo(() => {
    let monthlyBaseTotal = 0;
    let monthlyHousingTotal = 0;
    let monthlyGrossTotal = 0;

    grades.forEach(g => {
      const base = Math.max(g.baseSalary, minSalary);
      const housing = base * (housingAllowanceRate / 100);
      const grossSingle = base + housing;
      
      monthlyBaseTotal += base * g.count;
      monthlyHousingTotal += housing * g.count;
      monthlyGrossTotal += grossSingle * g.count;
    });

    const monthlyDeductions = monthlyGrossTotal * ((socialSecurityTaxRate + incomeTaxRate + stampDutyRate) / 100);
    const monthlyNetTotal = monthlyGrossTotal - monthlyDeductions;
    const annualGrossTotal = monthlyGrossTotal * 12;

    const baselineMonthly = totalEmployees * 1650;
    const baselineAnnual = baselineMonthly * 12;
    const varianceAnnual = annualGrossTotal - baselineAnnual;

    return {
      monthlyGrossTotal,
      monthlyNetTotal,
      monthlyDeductions,
      annualGrossTotal,
      baselineAnnual,
      varianceAnnual,
      avgSalaryPerEmployee: monthlyGrossTotal / (totalEmployees || 1),
    };
  }, [grades, minSalary, housingAllowanceRate, socialSecurityTaxRate, incomeTaxRate, stampDutyRate, totalEmployees]);

  const forecastData = useMemo(() => {
    const data = [];
    for (let year = 1; year <= 5; year++) {
      const yearMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
      const proposed = calculations.annualGrossTotal * yearMultiplier;
      const baseline = calculations.baselineAnnual * Math.pow(1.02, year - 1);
      data.push({
        name: `سنة ${year}`,
        المقترح: Math.round(proposed / 1e9 * 100) / 100,
        الفعلي_الحالي: Math.round(baseline / 1e9 * 100) / 100,
      });
    }
    return data;
  }, [calculations, inflationRate]);

  const handleGradeChange = (index, field, value) => {
    const updated = [...grades];
    updated[index][field] = Number(value);
    setGrades(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto text-center sm:text-right justify-center sm:justify-start">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 shrink-0">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                نظام محاكاة واقتراح الموازنة التقديرية للمرتبات
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">إعداد: م. مسعود الناجي امحارب (emahrebmasoud@gmail.com)</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 bg-slate-800/90 p-1 rounded-xl border border-slate-700/50 w-full sm:w-auto overflow-x-auto no-print">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'simulation' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> المحاكاة والمدخلات
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'grades' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> الدرجات (1-16)
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'report' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> التقرير التنفيذي
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {activeTab === 'simulation' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-cyan-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-400">التكلفة السنوية التقديرية</span>
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">
                  {(calculations.annualGrossTotal / 1e9).toFixed(2)} <span className="text-xs sm:text-sm font-normal text-cyan-400">مليار د.ل</span>
                </div>
                <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-slate-400">المستهدف للباب الأول كلياً</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-400">التكلفة الشهرية الكلية</span>
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">
                  {(calculations.monthlyGrossTotal / 1e6).toFixed(1)} <span className="text-xs sm:text-sm font-normal text-blue-400">مليون د.ل</span>
                </div>
                <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-slate-400">
                  الصافي: {(calculations.monthlyNetTotal / 1e6).toFixed(1)} مليون د.ل
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-purple-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-400">متوسط الراتب الشهري</span>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">
                  {Math.round(calculations.avgSalaryPerEmployee).toLocaleString()} <span className="text-xs sm:text-sm font-normal text-purple-400">د.ل</span>
                </div>
                <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-slate-400">لكل موظف مسجل بالمشروع</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-400">الفارق عن خط الأساس</span>
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white">
                  {(calculations.varianceAnnual / 1e9).toFixed(2)} <span className="text-xs sm:text-sm font-normal text-amber-400">مليار د.ل</span>
                </div>
                <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-amber-400/90 font-medium">مقارنة بالتخصيص الحالي</div>
              </div>
            </div>

            {/* Inputs & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> المتغيرات التشريعية
                </h2>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                      <span className="text-slate-300">الحد الأدنى العام للمرتب:</span>
                      <span className="font-bold text-cyan-400">{minSalary} د.ل</span>
                    </div>
                    <input 
                      type="range" min="500" max="2500" step="50" 
                      value={minSalary} 
                      onChange={(e) => setMinSalary(Number(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                      <span className="text-slate-300">نسبة بدلات السكن العامة:</span>
                      <span className="font-bold text-cyan-400">{housingAllowanceRate}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="50" step="5" 
                      value={housingAllowanceRate} 
                      onChange={(e) => setHousingAllowanceRate(Number(e.target.value))}
                      className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                      <span className="text-slate-300">نسبة التضخم السنوي:</span>
                      <span className="font-bold text-purple-400">{inflationRate}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" step="0.5" 
                      value={inflationRate} 
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="w-full accent-purple-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <h3 className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">الاستقطاعات القانونية</h3>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[11px] sm:text-xs">
                    <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                      <div className="text-slate-400 mb-0.5">الضمان</div>
                      <div className="font-bold text-white">{socialSecurityTaxRate}%</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                      <div className="text-slate-400 mb-0.5">الدخل</div>
                      <div className="font-bold text-white">{incomeTaxRate}%</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                      <div className="text-slate-400 mb-0.5">الدمغة</div>
                      <div className="font-bold text-white">{stampDutyRate}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-white flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-1">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> استشراف الأثر المالي (5 سنوات)
                  </span>
                  <span className="text-[11px] sm:text-xs font-normal text-slate-400">بـ (مليار دينار ليبي)</span>
                </h2>

                <div className="h-60 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProposed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area type="monotone" dataKey="المقترح" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorProposed)" />
                      <Area type="monotone" dataKey="الفعلي_الحالي" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-800 pb-3 sm:pb-4 gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> هيكل جدول الدرجات (1 - 16)
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">تحديد المربوط الأساسي والعلاوات وأعداد الموظفين</p>
              </div>
              <div className="text-xs sm:text-sm bg-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-slate-300 self-start sm:self-auto">
                إجمالي الكادر: <span className="font-bold text-cyan-400">{totalEmployees.toLocaleString()}</span> موظف
              </div>
            </div>

            {/* Scrollable Responsive Table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm text-right text-slate-300 min-w-[600px]">
                <thead className="bg-slate-800/80 text-slate-400 text-[11px] sm:text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2.5 rounded-r-xl">الدرجة</th>
                    <th className="px-3 py-2.5">المربوط الأساسي (د.ل)</th>
                    <th className="px-3 py-2.5">العلاوة السنوية</th>
                    <th className="px-3 py-2.5">عدد الموظفين</th>
                    <th className="px-3 py-2.5 rounded-l-xl">الكلفة الشهرية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {grades.map((g, index) => (
                    <tr key={g.grade} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-3 py-2 font-bold text-cyan-400 whitespace-nowrap">الدرجة {g.grade}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={g.baseSalary}
                          onChange={(e) => handleGradeChange(index, 'baseSalary', e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 w-24 sm:w-32 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={g.annualAllowance}
                          onChange={(e) => handleGradeChange(index, 'annualAllowance', e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 w-20 sm:w-24 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={g.count}
                          onChange={(e) => handleGradeChange(index, 'count', e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 w-28 sm:w-36 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </td>
                      <td className="px-3 py-2 font-semibold text-white whitespace-nowrap">
                        {((Math.max(g.baseSalary, minSalary) * (1 + housingAllowanceRate/100)) * g.count / 1e6).toFixed(2)} مليون
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6 sm:space-y-8 animate-fadeIn printable-area">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 no-print">
              <span className="text-xs text-slate-500 font-bold">معاينة التقرير الاستشرافي الرسمية</span>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-800 transition shadow-lg"
              >
                <Printer className="w-4 h-4" /> طباعة / PDF
              </button>
            </div>

            <div className="text-center border-b-2 border-slate-900 pb-4 sm:pb-6 space-y-1.5">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">تقرير استشراف ومحاكاة الموازنة التقديرية للباب الأول</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">تقييم الأثر المالي والاجتماعي لتطبيق جدول المرتبات الموحد</p>
              <div className="text-[11px] sm:text-xs text-slate-500 mt-1">التاريخ: {new Date().toLocaleDateString('ar-LY')}</div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-md font-bold text-slate-900 border-r-4 border-slate-900 pr-3">أولاً: ملخص التقديرات المالية الإجمالية</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">إجمالي المخصص السنوي المقترح للباب الأول:</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{(calculations.annualGrossTotal / 1e9).toFixed(3)} مليار دينار ليبي</div>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">إجمالي عدد الوظائف الممولة:</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{totalEmployees.toLocaleString()} موظف</div>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">متوسط التكلفة الشهرية للموظف:</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{Math.round(calculations.avgSalaryPerEmployee).toLocaleString()} دينار ليبي</div>
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">الفارق السنوي المقارن بخط الأساس:</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 mt-1">{(calculations.varianceAnnual / 1e9).toFixed(3)} مليار دينار ليبي</div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <h3 className="text-sm sm:text-md font-bold text-slate-900 border-r-4 border-slate-900 pr-3">ثانياً: الملاحظات والاستدامة المالية</h3>
              <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1.5 sm:space-y-2 leading-relaxed">
                <li>يتطلب الاعتماد النهائي التنسيق مع مصرف ليبيا المركزي لضمان توفير التغطية النقدية وتفادي الضغوط التضخمية.</li>
                <li>يوصى بتطبيق حزمة منظومة الرقم الوطني والربط الإجباري لمنع الازدواج الوظيفي قبل صرف الفروقات.</li>
                <li>ضرورة مراجعة الملاكات الوظيفية في القطاعات الخدمية لضبط معدلات النمو التراكمي في الباب الأول.</li>
              </ul>
            </div>

            <div className="pt-8 sm:pt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-center text-xs sm:text-sm font-bold border-t border-slate-200">
              <div>
                <p className="mb-1 sm:mb-2">إعداد وتصميم / م. مسعود الناجي امحارب</p>
                <p className="text-slate-500 font-normal">البريد: emahrebmasoud@gmail.com</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="mb-8 sm:mb-12">الاعتماد الرسمي</p>
                <p className="text-slate-400">التوقيع: ............................</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-3 text-center text-[11px] sm:text-xs text-slate-500 no-print px-4">
        نظام محاكاة واقتراح الموازنة التقديرية للمرتبات | إعداد: م. مسعود الناجي امحارب (emahrebmasoud@gmail.com)
      </footer>
    </div>
  );
}
