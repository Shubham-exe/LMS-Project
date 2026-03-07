import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";

import Home from "./pages/student/Home";
import CourseList from "./pages/student/CourseList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";

import Loading from "./components/students/Loading";
import NavBar from "./components/students/NavBar";

import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "quill/dist/quill.snow.css";

const App = () => {

  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />

      {!isEducatorRoute && <NavBar />}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />

        <Route path="/course/:id" element={<CourseDetails />} />

        <Route path="/my-enrollments" element={<MyEnrollments />} />

        <Route path="/player/:courseId" element={<Player />} />

        <Route path="/loading/:path" element={<Loading />} />

        <Route path="/educator" element={<Educator />}>

          <Route index element={<Dashboard />} />

          <Route path="add-course" element={<AddCourse />} />

          <Route path="my-courses" element={<MyCourses />} />

          <Route path="student-enrolled" element={<StudentsEnrolled />} />

        </Route>

      </Routes>

    </div>
  );
};

export default App;