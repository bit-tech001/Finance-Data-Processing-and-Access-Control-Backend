// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";

// import { AuthProvider } from "./context/AuthContext";
// import { AuthContext } from "./context/AuthContextObject";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup"; // ✅ ADDED
// import Dashboard from "./pages/Dashboard";
// import Records from "./pages/Records";

// // 🔐 Private Route
// const PrivateRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);

//   return user?.isAuthenticated ? children : <Navigate to="/" />;
// };

// // 🔒 Optional: Role-based route (future-ready)
// const RoleRoute = ({ children, roles }) => {
//   const { user } = useContext(AuthContext);

//   if (!user?.isAuthenticated) return <Navigate to="/" />;

//   if (roles && !roles.includes(user.role)) {
//     return <div className="p-5 text-red-500">Access Denied</div>;
//   }

//   return children;
// };

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Login />} />
//       <Route path="/signup" element={<Signup />} /> {/* ✅ ADDED */}

//       {/* Protected Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <PrivateRoute>
//             <Dashboard />
//           </PrivateRoute>
//         }
//       />

//       <Route
//         path="/records"
//         element={
//           <RoleRoute roles={["admin", "analyst"]}>
//             <Records />
//           </RoleRoute>
//         }
//       />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FinanceDashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import TransactionsPage from './pages/TranscationPage';
import AnalyticsPage from './pages/AnalyticsPage';

// --- PROTECTED ROUTE COMPONENT ---
// This prevents unauthenticated users from typing "/dashboard" in the URL
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect base URL to Auth or Dashboard based on session */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Route: Login & Register */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
           <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />


        {/* Protected Route: Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <FinanceDashboard />
             
            


            </ProtectedRoute>
          } 
        />

        {/* 404 Catch-all */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
};

export default App;