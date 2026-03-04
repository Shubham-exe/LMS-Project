import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/students/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  // Fetch course
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);

      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Enroll course
  const enrollCourse = async () => {
    try {
      if (!userData) return toast.warn("Login to Enroll");
      if (isAlreadyEnrolled) return toast.warn("Already Enrolled");

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  // Check enrollment
  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(
        userData?.enrolledCourses?.includes(courseData._id)
      );
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">

        {/* LEFT COLUMN */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="text-3xl font-semibold text-gray-800">
            {courseData?.courseTitle}
          </h1>

          <p
            className="pt-4 text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData?.courseDescription?.slice(0, 200),
            }}
          ></p>

          {/* Rating */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>

            <p className="text-blue-600">
              {courseData?.courseRatings?.length || 0} ratings
            </p>

            <p>
              {courseData?.enrolledStudents?.length || 0} students
            </p>
          </div>

          <p className="text-sm">
            Course by{" "}
            <span className="text-blue-600 underline">
              {courseData?.educator?.name}
            </span>
          </p>

          {/* Course Structure */}
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            <div className="pt-5">
              {(courseData?.courseContent || []).map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        className={`transition ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p>{chapter?.chapterTitle}</p>
                    </div>

                    <p>
                      {(chapter?.chapterContent || []).length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {openSections[index] && (
                    <ul className="pl-6 py-2">
                      {(chapter?.chapterContent || []).map((lecture, i) => (
                        <li key={i} className="flex justify-between py-1">
                          <p>{lecture?.lectureTitle}</p>

                          <div className="flex gap-2">
                            {lecture?.isPreviewFree && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    videoId:
                                      lecture?.lectureUrl?.split("/").pop(),
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Preview
                              </p>
                            )}

                            <p>
                              {humanizeDuration(
                                lecture?.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="py-20 text-sm">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>

            <p
              className="pt-3"
              dangerouslySetInnerHTML={{
                __html: courseData?.courseDescription,
              }}
            ></p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="shadow-lg rounded bg-white min-w-[300px] sm:min-w-[420px]">

          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData?.courseThumbnail} alt="" />
          )}

          <div className="p-5">

            <div className="flex gap-3 items-center pt-2">
              <p className="text-2xl font-semibold">
                {currency}
                {(
                  courseData?.coursePrice -
                  (courseData?.discount * courseData?.coursePrice) / 100
                ).toFixed(2)}
              </p>

              <p className="line-through">
                {currency}
                {courseData?.coursePrice}
              </p>

              <p>{courseData?.discount}% off</p>
            </div>

            <button
              onClick={enrollCourse}
              className="mt-6 w-full py-3 rounded bg-blue-600 text-white"
            >
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;