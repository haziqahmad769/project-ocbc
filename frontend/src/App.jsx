import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import UsersListPage from "./pages/users/UsersListPage";
import BottomNavbar from "./components/common/BottomNavbar";
import ForgotPassword from "./pages/auth/login/ForgotPassword";
import ResetPassword from "./pages/auth/login/ResetPassword";
import AdsManager from "./pages/ad/AdsManager";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage
        if (!token) {
          // Return null if no token is found
          return null;
        }

        const res = await fetch("http://localhost:8585/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/users"
          element={authUser ? <UsersListPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/forgot-password"
          element={!authUser ? <ForgotPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/reset-password/:token"
          element={!authUser ? <ResetPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/ads-manager"
          element={authUser ? <AdsManager /> : <Navigate to="/login" />}
        />
      </Routes>
      {authUser && <BottomNavbar />}
      <Toaster />
    </div>
  );
}

export default App;
