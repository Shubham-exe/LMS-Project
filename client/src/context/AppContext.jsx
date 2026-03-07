import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  /* Fetch All Courses */

  const fetchAllCourses = async () => {
    try {

      const { data } = await axios.get(`${backendUrl}/api/course/all`);

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  /* Fetch User Data */

  const fetchUserData = async () => {

    if (user?.publicMetadata?.role === "educator") {
      setIsEducator(true);
    }

    try {

      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/user/data`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  /* Calculate Course Rating */

  const calculateRating = (course) => {

    if (!course?.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    const total = course.courseRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );

    return Math.round(total / course.courseRatings.length);
  };

  /* Calculate Chapter Duration */

  const calculateChapterTime = (chapter) => {

    let time = 0;

    chapter?.chapterContent?.forEach((lecture) => {
      time += lecture.lectureDuration;
    });

    // Fix floating precision
    time = Math.round(time * 100) / 100;

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"]
    });
  };

  /* Calculate Course Duration */

  const calculateCourseDuration = (course) => {

    let time = 0;

    course?.courseContent?.forEach((chapter) => {

      chapter?.chapterContent?.forEach((lecture) => {
        time += lecture.lectureDuration;
      });

    });

    // Fix floating precision
    time = Math.round(time * 100) / 100;

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"]
    });
  };

  /* Count Total Lectures */

  const calculateNoOfLectures = (course) => {

    let total = 0;

    course?.courseContent?.forEach((chapter) => {

      if (Array.isArray(chapter.chapterContent)) {
        total += chapter.chapterContent.length;
      }

    });

    return total;
  };

  /* Fetch User Enrolled Courses */

  const fetchUserEnrolledCourses = async () => {

    try {

      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {

        // newest first
        setEnrolledCourses([...data.enrolledCourses].reverse());

      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  /* Effects */

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {

    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }

  }, [user]);

  /* Context Value */

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};