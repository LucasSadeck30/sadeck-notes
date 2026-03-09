import React from "react";
import { Navigate, Outlet} from "react-router-dom";

const PrivateRouter = () => {


const user = localStorage.getItem("user");

if(user) {
return <Outlet />
}else{
    return <Navigate to="/login" />
}

    
}
export default PrivateRouter;   
