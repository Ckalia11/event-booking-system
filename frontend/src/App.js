import './App.css';
import BookingsPage from './pages/bookings';
import EventsPage from './pages/events';
import AuthPage from './pages/auth';
import NavigationBar from './components/nav';
import AuthContext from './context/authContext';
import SignInPage from './components/signIn';
import SignUpPage from './components/signUp';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [authInfo, setAuthInfo] = useState({
    token: null,
    userId: null,
    tokenExpiration: null,
  });

  const login = (token, userId, tokenExpiration) => {
    setAuthInfo({
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration,
    });
  };

  const logout = () => {
    setAuthInfo({
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          authInfo,
          login,
          logout,
        }}
      >
        {/* <NavigationBar /> */}
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          {authInfo.token && (
            <Route path="/" element={<Navigate to="/events" exact />} />
          )}
          {authInfo.token && (
            <Route path="/auth" element={<Navigate to="/events" exact />} />
          )}
          {!authInfo.token && <Route path="/auth" element={<AuthPage />} />}
          <Route path="/events" element={<EventsPage />} />
          {authInfo.token && (
            <Route path="/bookings" element={<BookingsPage />} />
          )}
          {!authInfo.token && (
            <Route path="/*" element={<Navigate to="/auth" />} />
          )}
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
