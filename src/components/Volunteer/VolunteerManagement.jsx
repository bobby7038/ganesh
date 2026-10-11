import React, { useState } from 'react';
import { Flame, Clock, Calendar, CheckCircle2, Utensils, Shield, Users, Sparkles } from 'lucide-react';

export default function VolunteerManagement({ committeeDetails }) {
  // Pooja & Aarti Schedule State
  const [poojaList, setPoojaList] = useState(() => {
    const saved = localStorage.getItem('ganesh_pooja_schedule');
    return saved ? JSON.parse(saved) : [
      { id: 'P1', title: 'Morning Maha Abhishekam & Alankaram', time: '07:30 AM', priest: 'Veda Pandit Sharma', status: 'Completed' },
      { id: 'P2', title: 'Afternoon Archana & Prasadam Distribution', time: '12:30 PM', priest: 'Suresh Bhattar', status: 'Scheduled' },
      { id: 'P3', title: 'Evening Grand Maha Mangala Aarti', time: '07:30 PM', priest: 'Veda Pandit Sharma', status: 'Scheduled' }
    ];
  });

  // Annadhanam Meal Counter State
  const [mealsServed, setMealsServed] = useState(() => {
    const saved = localStorage.getItem('ganesh_meals_count');
    return saved ? Number(saved) : 450;
  });

  const handleTogglePoojaStatus = (id) => {
    const updated = poojaList.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'Completed' ? 'Scheduled' : 'Completed' };
      }
      return item;
    });
    setPoojaList(updated);
    localStorage.setItem('ganesh_pooja_schedule', JSON.stringify(updated));
  };

  const handleIncrementMeals = (amount) => {
    const nextVal = Math.max(0, mealsServed + amount);
    setMealsServed(nextVal);
    localStorage.setItem('ganesh_meals_count', nextVal.toString());
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-sky-900 to-blue-900 text-white rounded-2xl border-sky-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-inner">
              <Flame className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                  Field Volunteer Mode
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Event Volunteer & Mandapam Duty Portal
                </h2>
              </div>
              <p className="text-xs text-sky-200 mt-1">
                Manage Daily Pooja schedules, Annadhanam meals counter, and Mandapam volunteer duty rosters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Pooja Schedule & Annadhanam Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pooja & Aarti Roster */}
        <div className="glass-panel p-6 bg-white border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Daily Pooja & Aarti Schedule</h3>
                <p className="text-xs text-slate-500">Track ritual timing and priest coordination</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {poojaList.map(pooja => (
              <div key={pooja.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {pooja.time}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{pooja.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Priest / Acharya: <strong>{pooja.priest}</strong></p>
                </div>
                
                <button
                  onClick={() => handleTogglePoojaStatus(pooja.id)}
                  className={`btn text-xs font-bold ${
                    pooja.status === 'Completed'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{pooja.status}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Annadhanam Prasadam Counter */}
        <div className="glass-panel p-6 bg-white border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Annadhanam Prasadam Tracker</h3>
                <p className="text-xs text-slate-500">Live count of meals & prasadam served</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 text-center space-y-2">
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Total Devotee Meals Served Today</span>
            <div className="text-4xl font-black text-slate-900">
              {mealsServed.toLocaleString('en-IN')} <span className="text-sm font-semibold text-slate-500">Plates</span>
            </div>
            
            <div className="pt-3 flex items-center justify-center gap-2">
              <button 
                onClick={() => handleIncrementMeals(10)} 
                className="btn bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5"
              >
                +10 Meals
              </button>
              <button 
                onClick={() => handleIncrementMeals(50)} 
                className="btn bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5"
              >
                +50 Meals
              </button>
              <button 
                onClick={() => handleIncrementMeals(-10)} 
                className="btn bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-bold px-3 py-1.5"
              >
                -10
              </button>
            </div>
          </div>

          {/* Volunteer Roster List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Mandapam Duty Officers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-600" />
                <div>
                  <div className="font-bold text-slate-900">Morning Shift (8 AM - 2 PM)</div>
                  <div className="text-slate-500">Venkat Reddy & Youth Team</div>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-600" />
                <div>
                  <div className="font-bold text-slate-900">Evening Shift (2 PM - 10 PM)</div>
                  <div className="text-slate-500">Suresh Varma & Mandapam Team</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
