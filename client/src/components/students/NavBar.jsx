import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {

  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);

  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  // 🌙 Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply theme when state changes
  useEffect(() => {

    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const becomeEducator = async () => {

    try {

      if (!user) {
        openSignIn();
        return;
      }

      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }

  };

  return (

    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 py-4 border-b
      border-gray-300 dark:border-gray-700 transition-colors duration-300
      ${isCourseListPage ? "bg-white dark:bg-gray-900" : "bg-cyan-100/70 dark:bg-gray-900"}`}
    >

      <Link to="/">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-28 lg:w-32 cursor-pointer"
        />
      </Link>

      <div className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-300">

        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 border rounded-md text-sm
          hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {user && (
          <>
            <button
              onClick={becomeEducator}
              className="hover:text-blue-600 transition"
            >
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>

            <Link
              to="/my-enrollments"
              className="hover:text-blue-600 transition"
            >
              My Enrollments
            </Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        )}

      </div>

      {/* Mobile Navbar */}

      <div className="md:hidden flex items-center gap-3 text-gray-600 dark:text-gray-300">

        {/* Dark Toggle Mobile */}
        <button
          onClick={toggleTheme}
          className="text-sm"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {user && (
          <button
            onClick={becomeEducator}
            className="text-sm hover:text-blue-600"
          >
            {isEducator ? "Dashboard" : "Educator"}
          </button>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="User" className="w-6" />
          </button>
        )}

      </div>

    </div>

  );
};

export default NavBar;