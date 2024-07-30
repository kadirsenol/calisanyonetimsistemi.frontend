import { Button, InputAdornment, TextField } from "@mui/material";
import { Email, PersonAdd, Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from '@mui/icons-material/Login';
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

import MyBackdrop from "../components/MyBackdrop";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "../store/slices/mybackdropSlice";

const registerLoginSchema = Yup.object().shape({
  Email: Yup.string()
    .required("Email alani boş birakilamaz")
    .email("Lütfen mail formatinda giriş yapiniz.")
    .max(30, "Lütfen 30 karakterden az email adresi giriniz."),
  Password: Yup.string()
    .required("Password alani boş birakilamaz")
    .min(4, "Lütfen minimum 4 karakterden olusacak bir sifre giriniz."),
});

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(true);

  const dispatch = useDispatch();

  const LoginSend = async (values,actions) => {
    try {
      const response = await axios.post(
        "/Account/Login",
        values
      );
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        actions.resetForm();
        navigate('/Profile')
        toast.success(response.data.message);
      } else {
        toast.info(
          "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
        );
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Sunucuya bağlanılamadı. !");
      } else if (error.response.status === 500) {
        //Problem(), server side bissunes exceptions and all catch error
        toast.error(error.response.data.detail);
      } else if (error.response.status === 400) {
        //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
        Object.values(error.response.data.errors).forEach((value) => {
          value.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error("Opps! Beklenmedik bir hata meydana geldi.");
      }
    }
    dispatch(setCloseBackdrop());
  };

  return (
    <Formik
      initialValues={{ Email: "", Password: "" }}
      onSubmit={(values, actions) => {
        LoginSend(values,actions);
        dispatch(setOpenBackdrop());        
      }}
      validationSchema={registerLoginSchema}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        handleBlur,
        touched,
        errors,
      }) => (
        <div
          className="flex justify-center min-h-screen items-center relative "
          style={{
            backgroundImage: `url(./login.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="w-1/4 bg-white bg-opacity-70 rounded-xl">
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="Email"
                label="Email"
                className="w-5/6"
                onChange={handleChange("Email")}
                value={values.Email}
                onBlur={handleBlur("Email")}
                error={touched.Email && Boolean(errors.Email)}
                helperText={touched.Email && errors.Email}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Email className="cursor-default" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="mb-3 flex justify-center">
              <TextField
                variant="standard"
                id="Password"
                label="Password"
                type={showPassword ? "password" : "text"}
                className="w-5/6"
                onChange={handleChange("Password")}
                value={values.Password}
                onBlur={handleBlur("Password")}
                error={touched.Password && Boolean(errors.Password)}
                helperText={touched.Password && errors.Password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      onClick={() => {
                        setShowPassword(!showPassword);                        
                      }}
                      position="end"
                    >
                      {showPassword ? (
                        <Visibility className="cursor-pointer" />
                      ) : (
                        <VisibilityOff className="cursor-pointer" />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className=" flex justify-center gap-2 mb-3 me-2 ">
              <Button variant="contained" color="inherit" size="small" onClick={handleSubmit} startIcon={<LoginIcon className="mb-0.5"/>}>
                Login
              </Button>
              <MyBackdrop />
              <Button
                onClick={() => navigate("/Register")}
                variant="contained"
                size="small"
                color="inherit"
                startIcon={<PersonAdd className="mb-0.5"/>}
              >
                Register
              </Button>              
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Login;
