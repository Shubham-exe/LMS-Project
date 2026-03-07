import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {

  const { currency, calculateRating } = useContext(AppContext);

  const rating = calculateRating(course);

  const discountedPrice =
    course.coursePrice - (course.discount * course.coursePrice) / 100;

  return (

    <Link
      to={"/course/" + course._id}
      onClick={() => window.scrollTo(0, 0)}
      className="border border-gray-300 pb-6 overflow-hidden rounded-lg
      hover:shadow-lg hover:-translate-y-1 transition duration-300"
    >

      <img
        className="w-full h-40 object-cover"
        src={course?.courseThumbnail || assets.course_placeholder}
        alt="Course Thumbnail"
      />

      <div className="p-3 text-left">

        <h3 className="text-base font-semibold">
          {course.courseTitle}
        </h3>

        <p className="text-gray-500">
          {course.educator?.name}
        </p>

        <div className="flex items-center space-x-2 mt-1">

          <p className="text-sm font-medium">{rating}</p>

          <div className="flex">

            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < rating ? assets.star : assets.star_blank}
                alt="star"
                className="w-3.5 h-3.5"
              />
            ))}

          </div>

          <p className="text-gray-500 text-sm">
            ({course.courseRatings?.length || 0})
          </p>

        </div>

        <p className="text-base font-semibold text-gray-800 mt-2">

          {currency}
          {discountedPrice.toFixed(2)}

        </p>

      </div>

    </Link>
  );
};

export default CourseCard;