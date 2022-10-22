import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Upload from './Edit/Upload';

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "upload", element: <Upload /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);

