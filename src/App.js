import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error404 from "./pages/Error404";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setLogin, setLogout, setName, setRole, setEmail, setUserId, setPozisyon } from "./store/slices/userSlice";
import Profile from "./pages/Profile";




function App() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {      
    checkToken();     
  }, [location]);

  const checkToken = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const deCodeJwt = jwtDecode(token);
      const rol = deCodeJwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role" ];
      dispatch(setRole(rol));
      const name =deCodeJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      dispatch(setName(name));
      const email =deCodeJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email"];
      dispatch(setEmail(email));      
      const userId = deCodeJwt.UserId;
      dispatch(setUserId(userId));      
      const pozisyon = deCodeJwt.Pozisyon;
      console.log(pozisyon);
      dispatch(setPozisyon(pozisyon));            
      const expToken = deCodeJwt.exp;
      let date = new Date();
      const currentDate = date.getTime() / 1000;
      if (expToken >= currentDate) {
        dispatch(setLogin());
      } else {
        dispatch(setLogout());
      }
    } else {
      dispatch(setLogout());
    }
  };
 

  axios.defaults.baseURL = "http://localhost:5237/api";
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />        
        <Route path="/Register" element={<Register />} />
        {/* <Route path="/Admin" element={(isLogin && role === "Admin") ?  <Admin />  :  <Error404 /> } /> */}
        <Route path="*" element={ <Error404 /> }/>       
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
