import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from "../src/screens/home/index.js";
import RegisterScreen from "./screens/auth/register/index.js";
import LoginScreen from "./screens/auth/login/index.js";
import UserEditScreen from "./screens/users/edit/index.js";
import NotesScreen from "./screens/notes/index/index.js";
import PrivateRouter from "./components/auth/private_router/index.js";
import UserPasswordChangeScreen from "./screens/users/changePassword/index.js";
import LostPasswordScreen from "./screens/lostPassword/index.js";
import ResetPasswordScreen from "./screens/resetPassword/index.js";

const RoutesApp = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" index element={<HomeScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/lostPassword" element={<LostPasswordScreen />} />
                <Route path="/reset-password" element={<ResetPasswordScreen />} />
                 <Route element={<PrivateRouter />}>  
                <Route path="/notes" element={<NotesScreen />} />
                <Route path="/users/edit" element={<UserEditScreen />} />
                <Route path="/users/changePassword" element={<UserPasswordChangeScreen />} />
      
               </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default RoutesApp;

