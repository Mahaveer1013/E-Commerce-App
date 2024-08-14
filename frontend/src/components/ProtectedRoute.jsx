import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthCheck from './AuthCheck';

const ProtectedRoute = ({ routes }) => (
  <Routes>
    {routes.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={<AuthCheck>{route.element}</AuthCheck>}
      />
    ))}
  </Routes>
);

export default ProtectedRoute;
