import React from 'react';
import ProblemList from '../components/ProblemList';
import Courses from '../components/Courses';
import DailyProblem from '../components/DailyProblem';

const ProblemPage = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen py-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="bg-slate-700 px-4 py-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-3">
            <Courses />
          </div>

          <DailyProblem />
        </div>

        <div className="bg-slate-700 px-4 py-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <ProblemList />
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
