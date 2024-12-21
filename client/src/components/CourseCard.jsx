import React from "react";

const CourseCard = ({ title, description, link }) => {
  return (
    <div className="course-card bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      <h3 className="text-base font-semibold mb-3">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <a
        href={link}
        className="inline-block py-2 px-4 bg-gray-700 text-white rounded-lg w-full text-center text-sm hover:bg-gray-600 transition duration-200"
      >
        View Course
      </a>
    </div>
  );
};

export default CourseCard;
