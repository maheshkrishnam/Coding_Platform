import React, { useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";

const Courses = () => {
  const allCourses = [
    {
      title: "Web Development Bootcamp",
      description: "Learn web development from scratch with hands-on projects.",
      link: "/courses/web-development",
    },
    {
      title: "Data Structures & Algorithms",
      description: "Master DSA with real-world examples and problem-solving.",
      link: "/courses/data-structures",
    },
    {
      title: "Machine Learning",
      description: "Build machine learning models and understand their theory.",
      link: "/courses/machine-learning",
    },
    {
      title: "Python for Beginners",
      description: "An introduction to Python programming with practical examples.",
      link: "/courses/python-beginners",
    },
    {
      title: "React for Beginners",
      description: "Get started with React, one of the most popular front-end libraries.",
      link: "/courses/react-beginners",
    },
    {
      title: "JavaScript Mastery",
      description: "Become a JavaScript expert by building real-world projects.",
      link: "/courses/javascript-mastery",
    },
  ];

  const [visibleCourses, setVisibleCourses] = useState(2);

  // Handle showing more courses
  const showMoreCourses = () => {
    setVisibleCourses((prev) => Math.min(prev + 2, allCourses.length)); // Show 2 more courses at a time
  };

  return (
    <section className="courses max-w-screen-xl mx-auto p-4 bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-8 text-center">Explore Our Courses</h2>

      {/* Grid Layout for Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {allCourses.slice(0, visibleCourses).map((course, index) => (
          <CourseCard
            key={index}
            title={course.title}
            description={course.description}
            link={course.link}
          />
        ))}
      </div>

      {/* Button to load more courses */}
      <div className="text-center mt-6">
        {visibleCourses < allCourses.length && (
          <button
            onClick={showMoreCourses}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200 mx-2"
          >
            See More Courses
          </button>
        )}
      </div>
    </section>
  );
};

export default Courses;
