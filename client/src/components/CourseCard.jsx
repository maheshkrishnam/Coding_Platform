import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ title, description, link, bgClass }) => {
  return (
    <div
      className={"p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 bg-slate-700"}
    >
      <h4 className="text-lg font-medium mb-3">{title}</h4>
      <p className="text-sm mb-4">{description}</p>
      <Link
        to={link}
        className="inline-block py-2 px-4 bg-slate-500 text-white rounded-lg text-sm text-center w-full"
      >
        Explore Course
      </Link>
    </div>
  );
};

export default CourseCard;
