import React from "react";

const Courses = () => {
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
      description: "Get started with Express, one of the most popular back-end framework.",
      type: "Paid",
      link: "/courses/react-beginners",
    },
  ];

  const freeCourses = allCourses.filter(course => course.type === "Free");
  const paidCourses = allCourses.filter(course => course.type === "Paid");

  return (
    <section className="courses py-8 px-4 bg-gray-900 text-white">
      <h2 className="text-3xl font-semibold mb-8 text-center">Explore Our Courses</h2>

      <div className="space-y-12">
        {/* Free Courses */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-center">Free Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {freeCourses.map((course, index) => (
              <div
                key={index}
                className="course-card bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <h4 className="text-lg font-medium mb-3">{course.title}</h4>
                <p className="text-sm mb-4">{course.description}</p>
                <a
                  href={course.link}
                  className="inline-block py-2 px-4 bg-green-500 text-white rounded-lg text-sm text-center w-full"
                >
                  Explore Course
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Paid Courses */}
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-center">Paid Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {paidCourses.map((course, index) => (
              <div
                key={index}
                className="course-card bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <h4 className="text-lg font-medium mb-3">{course.title}</h4>
                <p className="text-sm mb-4">{course.description}</p>
                <a
                  href={course.link}
                  className="inline-block py-2 px-4 bg-blue-500 text-white rounded-lg text-sm text-center w-full"
                >
                  Explore Course
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
