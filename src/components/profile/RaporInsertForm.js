import { Button, InputAdornment, TextField } from "@mui/material";
import {
  Abc,
  AttachMoney,
  Cancel,
  DataArray,
  DeleteSweep,
  Description,
  Image,
  NoteAdd,
} from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setModalStatus } from "../../store/slices/modalSlice";
import { LoadingButton } from "@mui/lab";
import { setIsGetRapor} from "../../store/slices/adminSlice";

const registerLoginSchema = Yup.object().shape({  
   BaslangicTarih: Yup.string()
  .required("Başlangıç tarihi boş birakilamaz")      
  .matches(/^\d{2}\.\d{2}\.\d{4}$/,
    "Tarih gg.aa.yyyy formatında olmalıdır"),  
  BitisTarih: Yup.string()
  .required("Bitiş tarihi boş birakilamaz")      
  .matches(/^\d{2}\.\d{2}\.\d{4}$/,
    "Tarih gg.aa.yyyy formatında olmalıdır"), 
  RaporTuru: Yup.string()
  .required("Rapor türü boş birakilamaz") 
  .matches(/^\d+$/, "Rapor türü yalnızca rakamlardan oluşmalıdır"),      
  UserId: Yup.string()
  .required("User id boş birakilamaz")
  .matches(/^\d+$/, "UserId yalnızca rakamlardan oluşmalıdır"),
  Aciklama: Yup.string()
  .required("Açıklama boş birakilamaz")
  .max(50, "Maksimum 50 karakterden oluşan bir açıklama giriniz.")
});

const RaporInsertForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const isOpen = useSelector((state)=>state.modal.status);
  const [loadingButton, setLoadingButton] = useState(false);

  const dispatch = useDispatch();
  const formikRef = useRef();

  useEffect(() => {
    if (!isOpen) return;  
    formikRef.current?.resetForm();
  }, [isOpen]);


  const insertSend = async (values,actions) => {
    const updatedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value === "" ? null : value])
    );    
    try {
      const response = await axios.post(
        "yonetici/Rapor/CreateRapor",
        updatedValues,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }
      );
      if (response.status === 200) {
        toast.success(response.data);
        dispatch(setIsGetRapor());
        actions.resetForm();
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
    } else if (error.response.status === 401) {
        toast.error("Lütfen giriş yapınız.");
        navigate("/");
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
    dispatch(setModalStatus(false));
    setLoadingButton(false);
  };

  return (
    <Formik     
      innerRef={formikRef} 
      initialValues={{
        BaslangicTarih: "",
        BitisTarih: "",
        RaporTuru: "",
        Aciklama: "",
        UserId: ""
      }}
      onSubmit={(values,actions) => {
        setLoadingButton(true);
        insertSend(values,actions);
      }}
      validationSchema={registerLoginSchema}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        handleBlur,
        setFieldValue,
        touched,
        errors,
      }) => (

        <div className="w-full max-w-md mx-auto opacity-1 bg-white bg-opacity-80 rounded-xl p-4">            
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="BaslangicTarih"
                label="BaslangicTarih"
                className="w-5/6"
                onChange={handleChange("BaslangicTarih")}
                value={values.BaslangicTarih}
                onBlur={handleBlur("BaslangicTarih")}
                error={touched.BaslangicTarih && Boolean(errors.BaslangicTarih)}
                helperText={touched.BaslangicTarih && errors.BaslangicTarih}
                sx={{
                    '& input': { fontSize: '16px' },
                    '& .MuiInputLabel-root': { fontSize: '16px' },
                    '& .MuiFormHelperText-root': { fontSize: '16px' },
                    '& .Mui-error': { fontSize: '14px' }
                  }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Abc className="cursor-default" sx={{fontSize:'20px'}} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="BitisTarih"
                label="BitisTarih"
                className="w-5/6"
                onChange={handleChange("BitisTarih")}
                value={values.BitisTarih}
                onBlur={handleBlur("BitisTarih")}
                error={touched.BitisTarih && Boolean(errors.BitisTarih)}
                helperText={touched.BitisTarih && errors.BitisTarih}
                sx={{
                    '& input': { fontSize: '16px' },
                    '& .MuiInputLabel-root': { fontSize: '16px' },
                    '& .MuiFormHelperText-root': { fontSize: '16px' },
                    '& .Mui-error': { fontSize: '14px' }
                  }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AttachMoney className="cursor-default" sx={{fontSize:'20px'}} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>            
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="RaporTuru"
                label="RaporTuru"
                className="w-5/6"
                onChange={handleChange("RaporTuru")}
                value={values.RaporTuru}
                onBlur={handleBlur("RaporTuru")}
                error={touched.RaporTuru && Boolean(errors.RaporTuru)}
                helperText={touched.RaporTuru && errors.RaporTuru}
                sx={{
                    '& input': { fontSize: '16px' },
                    '& .MuiInputLabel-root': { fontSize: '16px' },
                    '& .MuiFormHelperText-root': { fontSize: '16px' },
                    '& .Mui-error': { fontSize: '14px' }
                  }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <DataArray className="cursor-default" sx={{fontSize:'20px'}}/>
                    </InputAdornment>
                  ),
                }}
              />
            </div>    
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="Aciklama"
                label="Aciklama"
                className="w-5/6"
                onChange={handleChange("Aciklama")}
                value={values.Aciklama}
                onBlur={handleBlur("Aciklama")}
                error={touched.Aciklama && Boolean(errors.Aciklama)}
                helperText={touched.Aciklama && errors.Aciklama}
                sx={{
                    '& input': { fontSize: '16px' },
                    '& .MuiInputLabel-root': { fontSize: '16px' },
                    '& .MuiFormHelperText-root': { fontSize: '16px' },
                    '& .Mui-error': { fontSize: '14px' }
                  }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Description className="cursor-default" sx={{fontSize:'20px'}}/>
                    </InputAdornment>
                  ),
                }}
              />
            </div>            
            <div className="flex justify-center">
              <TextField
                variant="standard"
                id="UserId"
                label="UserId"
                className="w-5/6"
                onChange={handleChange("UserId")}
                value={values.UserId}
                onBlur={handleBlur("UserId")}
                error={touched.UserId && Boolean(errors.UserId)}
                helperText={touched.UserId && errors.UserId}
                sx={{
                    '& input': { fontSize: '16px' },
                    '& .MuiInputLabel-root': { fontSize: '16px' },
                    '& .MuiFormHelperText-root': { fontSize: '16px' },
                    '& .Mui-error': { fontSize: '14px' }
                  }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Description className="cursor-default" sx={{fontSize:'20px'}}/>
                    </InputAdornment>
                  ),
                }}
              />
            </div>                                   
            <div className=" flex justify-center mt-3 gap-2 mb-1 me-2">
              <LoadingButton
              variant="contained"
              color="inherit"
              size="small"
              disabled={(values.Name !== "" &&  values.Price !=="" && values.FileImage !==null && values.Description !=="" && values.DetailedDescription !=="") ? false : true}
              loading={loadingButton} 
              onClick={handleSubmit}
              startIcon={<NoteAdd className="mb-0.5"/>}
              sx={{
                padding: '4px 8px',
                fontSize: '11px',
              }}
              >
                Create
              </LoadingButton>              
              <Button
                onClick={() => dispatch(setModalStatus(false)) }
                variant="contained"
                size="small"
                color="inherit"
                startIcon={<Cancel className="mb-0.5"/>}
                className="translate-x-1"
                sx={{
                    padding: '4px 8px',
                    fontSize: '11px',
                  }}
              >
                Cancel
              </Button>
            </div>
          </div>
      )}
    </Formik>
)
}

export default RaporInsertForm;
