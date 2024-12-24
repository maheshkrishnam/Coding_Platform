import React from 'react';
import { Link } from 'react-router-dom';

const DailyProblem = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const formatDate = (day, month, year) => {
    const dayString = day.toString().padStart(2, '0');
    const monthString = (month + 1).toString().padStart(2, '0');
    return `${dayString}-${monthString}-${year}`;
  };

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2 flex flex-col items-center justify-center space-y-4">
      <div>
        <div className="text-2xl font-semibold mb-4">Daily Problems</div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const isFuture = d > day;
            return (
              <Link
                key={d}
                to={isFuture ? '#' : `/daily-problem/${formatDate(d, month, year)}`}
                target='_blank'
                className={`w-8 h-8 flex items-center justify-center rounded-full transition duration-200 ${
                  d === day
                    ? 'bg-orange-500 text-white'
                    : isFuture
                    ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                    : 'bg-slate-700 text-slate-300 hover:bg-orange-600'
                }`}
                onClick={(e) => isFuture && e.preventDefault()} // Disable the click for future dates
              >
                {d}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default DailyProblem