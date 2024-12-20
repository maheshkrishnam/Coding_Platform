import React from 'react';
import ProblemList from '../components/ProblemList';
import Courses from '../components/Courses';
import { Link } from 'react-router-dom';

const ProblemPage = () => {
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
    <div className="bg-gray-900 text-white min-h-screen py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-3">
            <Courses />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2 flex flex-col items-center justify-center space-y-4">
            <div className="text-xl font-semibold mb-4">Daily Problems</div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((d) => {
                const isFuture = d > day;
                return (
                  <Link
                    key={d}
                    to={isFuture ? '#' : `/daily-problem/${formatDate(d, month, year)}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition duration-200 ${
                      d === day
                        ? 'bg-orange-500 text-white'
                        : isFuture
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : 'bg-gray-700 text-gray-300 hover:bg-orange-600'
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

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <ProblemList />
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
