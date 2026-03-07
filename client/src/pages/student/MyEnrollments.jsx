import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/students/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import generateCertificate from "../../utils/generateCertificate";

const MyEnrollments = () => {

  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  // Fetch progress for each course
  const getCourseProgress = async () => {

    try {

      const token = await getToken();

      const tempProgressArray = await Promise.all(

        enrolledCourses.map(async (course) => {

          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const totalLectures = calculateNoOfLectures(course);

          const lectureCompleted =
            data.progressData?.lectureCompleted?.length || 0;

          return { totalLectures, lectureCompleted };

        })
      );

      setProgressArray(tempProgressArray);

    } catch (error) {
      toast.error(error.message);
    }

  };

  useEffect(() => {

    if (userData) {
      fetchUserEnrolledCourses();
    }

  }, [userData]);

  useEffect(() => {

    if (enrolledCourses?.length > 0) {
      getCourseProgress();
    }

  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">

        <h1 className="text-2xl font-semibold dark:text-white">
          My Enrollments
        </h1>

        {enrolledCourses?.length === 0 ? (

          <p className="mt-6 text-gray-500 dark:text-gray-400">
            You have not enrolled in any courses yet.
          </p>

        ) : (

          <table className="md:table-auto table-fixed w-full overflow-hidden border border-gray-200 dark:border-gray-700 mt-10 bg-white dark:bg-gray-800 rounded-lg">

            <thead className="text-gray-900 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 text-sm text-left max-sm:hidden">

              <tr>
                <th className="px-4 py-3 font-semibold truncate">Course</th>
                <th className="px-4 py-3 font-semibold truncate">Duration</th>
                <th className="px-4 py-3 font-semibold truncate">Completed</th>
                <th className="px-4 py-3 font-semibold truncate">Status</th>
              </tr>

            </thead>

            <tbody className="text-gray-700 dark:text-gray-300">

              {enrolledCourses?.map((course, index) => {

                const progress = progressArray[index];

                const percent =
                  progress && progress.totalLectures > 0
                    ? (progress.lectureCompleted * 100) / progress.totalLectures
                    : 0;

                return (

                  <tr
                    key={course._id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >

                    <td className="md:px-4 pl-2 md:pl-4 py-4 flex items-center space-x-4">

                      <img
                        src={course.courseThumbnail}
                        alt=""
                        className="w-16 sm:w-24 md:w-28 rounded shadow-sm"
                      />

                      <div className="flex-1">

                        <p className="mb-2 font-medium max-sm:text-sm">
                          {course.courseTitle}
                        </p>

                        {/* Animated Progress Bar */}

                        <Line
                          strokeWidth={4}
                          percent={percent}
                          strokeColor="#2563eb"
                          trailColor="#e5e7eb"
                          className="rounded-full transition-all duration-700"
                        />

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {Math.floor(percent)}% Completed
                        </p>

                      </div>

                    </td>

                    <td className="px-4 py-3 max-sm:hidden">
                      {calculateCourseDuration(course)}
                    </td>

                    <td className="px-4 py-3 max-sm:hidden">

                      {progress
                        ? `${progress.lectureCompleted} / ${progress.totalLectures}`
                        : "0 / 0"}{" "}
                      Lectures

                    </td>

                    <td className="px-4 py-3 max-sm:text-right">

                      {progress &&
                      progress.lectureCompleted === progress.totalLectures ? (

                        <button
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition"
                          onClick={() =>
                          generateCertificate(
                          userData?.name,
                          course.courseTitle
                            )
                          }
                        >
                          Download Certificate
                        </button>

                      ) : (

                        <button
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition"
                          onClick={() => navigate("/player/" + course._id)}
                        >
                          Continue
                        </button>

                      )}

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        )}

      </div>

      <Footer />

    </>
  );
};

export default MyEnrollments;