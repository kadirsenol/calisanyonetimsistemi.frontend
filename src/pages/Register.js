import { Button, InputAdornment, TextField } from "@mui/material";
import {
  Badge,
  Email,
  Login,
  Person,
  PersonAdd,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "../store/slices/mybackdropSlice";
import MyBackdrop from "../components/MyBackdrop";

const registerLoginSchema = Yup.object().shape({
  Ad: Yup.string()
    .required("Ad alani boş birakilamaz")
    .min(3, "En az 3 karakterli bir isim giriniz")
    .max(15, "En fazla 15 karakterli isim giriniz"),
  Pozisyon: Yup.string()
    .required("Pozisyon alani boş birakilamaz")
    .min(3, "En az 3 karakterli bir Pozisyon giriniz")
    .max(20, "En fazla 20 karakterli Pozisyon giriniz"),
  BaslamaTarihi: Yup.string()
    .required("İşe başlama tarihi boş birakilamaz")
    .matches(/^\d{2}\.\d{2}\.\d{4}$/,
      "Tarih gg.aa.yyyy formatında olmalıdır"),
  Departman: Yup.string()
    .required("Pozisyon alani boş birakilamaz")
    .min(2, "En az 2 karakterli bir Pozisyon giriniz")
    .max(15, "En fazla 15 karakterli Pozisyon giriniz"),
  Email: Yup.string()
    .required("Email alani boş birakilamaz")
    .email("Lütfen mail formatinda giriş yapiniz.")
    .max(30, "Lütfen 30 karakterden az email adresi giriniz."),
  Password: Yup.string()
    .required("Password alani boş birakilamaz")
    .min(4, "Lütfen minimum 4 karakterden olusacak bir sifre giriniz."),
  ConfirmPassword: Yup.string()
    .required("Password doğrulama alani boş birakilamaz")
    .oneOf([Yup.ref("Password")], "Girilen parolalar eşleşmiyor. !"),
});

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const dispatch = useDispatch();

  const registerSend = async (values, actions) => {
    try {
      const response = await axios.post("/Account/Register", values);
      if (response.status === 200) {
        toast.success(response.data);
        actions.resetForm();
        navigate("/");
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
      initialValues={{
        Ad: "",
        Pozisyon: "",
        Departman: "",
        BaslamaTarihi: "",
        Email: "",
        Password: "",       
        ConfirmPassword: ""
      }}
      onSubmit={(values, actions) => {
        registerSend(values, actions);
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
          style={{
            backgroundImage: `url(./register.png)`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="flex justify-center min-h-screen items-center"
        >
          <div className="w-1/4 opacity-1 bg-white bg-opacity-80 rounded-xl">
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="Ad"
                label="Ad"
                className="w-5/6"
                onChange={handleChange("Ad")}
                value={values.Ad}
                onBlur={handleBlur("Ad")}
                error={touched.Ad && Boolean(errors.Ad)}
                helperText={touched.Ad && errors.Ad}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person className="cursor-default" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="Pozisyon"
                label="Pozisyon"
                className="w-5/6"
                onChange={handleChange("Pozisyon")}
                value={values.Pozisyon}
                onBlur={handleBlur("Pozisyon")}
                error={touched.Pozisyon && Boolean(errors.Pozisyon)}
                helperText={touched.Pozisyon && errors.Pozisyon}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person className="cursor-default" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="Departman"
                label="Departman"
                className="w-5/6"
                onChange={handleChange("Departman")}
                value={values.Departman}
                onBlur={handleBlur("Departman")}
                error={touched.Departman && Boolean(errors.Departman)}
                helperText={touched.Departman && errors.Departman}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Badge className="cursor-default" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="BaslamaTarihi"
                label="BaslamaTarihi"
                className="w-5/6"
                onChange={handleChange("BaslamaTarihi")}
                value={values.BaslamaTarihi}
                onBlur={handleBlur("BaslamaTarihi")}
                error={touched.BaslamaTarihi && Boolean(errors.BaslamaTarihi)}
                helperText={touched.BaslamaTarihi && errors.BaslamaTarihi}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Badge className="cursor-default" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
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
            <div className="flex justify-center">
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
                      className="cursor-pointer"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      position="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="mb-3 flex justify-center">
              <TextField
                variant="standard"
                id="ConfirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "password" : "text"}
                className="w-5/6"
                onChange={handleChange("ConfirmPassword")}
                value={values.ConfirmPassword}
                onBlur={handleBlur("ConfirmPassword")}
                error={
                  touched.ConfirmPassword && Boolean(errors.ConfirmPassword)
                }
                helperText={touched.ConfirmPassword && errors.ConfirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      className="cursor-pointer"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                      position="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className=" flex justify-center gap-2 mb-3 me-2">
              <Button
                variant="contained"
                color="inherit"
                size="small"
                onClick={handleSubmit}
                startIcon={<PersonAdd className="mb-0.5" />}
              >
                Register
              </Button>
              <MyBackdrop />
              <Button
                onClick={() => navigate("/")}
                variant="contained"
                size="small"
                color="inherit"
                startIcon={<Login className="mb-0.5" />}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Register;
