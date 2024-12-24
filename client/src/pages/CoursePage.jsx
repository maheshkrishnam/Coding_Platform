import React from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  // All courses data
  const allCourses = [
    {
      title: "Web Development Bootcamp",
      description: "Learn web development from scratch with hands-on projects.",
      type: "Paid",
      link: "/courses/web-development",
    },
    {
      title: "C++",
      description: "An introduction to C++ programming with practical examples.",
      type: "Free",
      link: "/courses/cpp",
    },
    {
      title: "Data Structures & Algorithms",
      description: "Master DSA with real-world examples and problem-solving.",
      type: "Free",
      link: "/courses/data-structures",
    },
    {
      title: "Machine Learning",
      description: "Build machine learning models and understand their theory.",
      type: "Paid",
      link: "/courses/machine-learning",
    },
    {
      title: "Python for Beginners",
      description: "An introduction to Python programming with practical examples.",
      type: "Free",
      link: "/courses/python-beginners",
    },
    {
      title: "JavaScript Mastery",
      description: "Become a JavaScript expert by building real-world projects.",
      type: "Free",
      link: "/courses/javascript-mastery",
    },
    {
      title: "React for Beginners",
      description: "Get started with React, one of the most popular front-end libraries.",
      type: "Paid",
      link: "/courses/react-beginners",
    },
    {
      title: "Express for Beginners",
      description: "Get started with Express, one of the most popular back-end frameworks.",
      type: "Paid",
      link: "/courses/express-beginners",
    },
  ];

  // Separate courses into free and paid
  const freeCourses = allCourses.filter(course => course.type === "Free");
  const paidCourses = allCourses.filter(course => course.type === "Paid");

  // Reusable CourseList component to render both free and paid courses
  const CourseList = ({ title, courses, bgClass }) => (
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-center">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            title={course.title}
            description={course.description}
            link={course.link}
            bgClass={bgClass}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 text-white min-h-screen py-8">
      <section className="max-w-screen-xl mx-auto px-4">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center">Explore Our Courses</h2>

          <div className="space-y-12 bg-slate-700 p-4 rounded-lg mb-6">
            {/* Render Free Courses */}
            <CourseList
              title="Free Courses"
              courses={freeCourses}
              bgClass="bg-slate-800"
            />
          </div>

          <div className="space-y-12 bg-slate-700 p-4 rounded-lg">
            {/* Render Paid Courses */}
            <CourseList
              title="Paid Courses"
              courses={paidCourses}
              bgClass="bg-slate-900"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// CourseCard Component to display individual course details
const CourseCard = ({ title, description, link, bgClass }) => {
  return (
    <div
      className={`${bgClass} p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200`}
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

export default Courses;
