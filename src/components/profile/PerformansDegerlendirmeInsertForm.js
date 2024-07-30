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
import { setIsGetPerformansDegerlendirme} from "../../store/slices/adminSlice";

const registerLoginSchema = Yup.object().shape({  
  PerformansTipi: Yup.string()
  .required("Performans tipi boş birakilamaz")      
  .matches(/^\d+$/, "Performans tipi yalnızca rakamlardan oluşmalıdır"),  
  PerformansPuani: Yup.string()
  .required("Performans puanı boş birakilamaz")      
  .matches(/^\d+$/, "Performans puanı yalnızca rakamlardan oluşmalıdır"),  
  Yorumlar: Yup.string()
  .required("Yorum boş birakilamaz"),      
  UserId: Yup.string()
  .required("UserId boş birakilamaz")
  .matches(/^\d+$/, "UserId yalnızca rakamlardan oluşmalıdır")   
});

const PerformansDegerlendirmeInsertForm = () => {
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
        "yonetici/Performans/PerformansDegerlendirmeInsert",
        updatedValues,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }
      );
      if (response.status === 200) {
        toast.success(response.data);
        dispatch(setIsGetPerformansDegerlendirme());
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
        PerformansTipi: "",
        PerformansPuani: "",
        Yorumlar: "",
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
                id="PerformansTipi"
                label="PerformansTipi"
                className="w-5/6"
                onChange={handleChange("PerformansTipi")}
                value={values.PerformansTipi}
                onBlur={handleBlur("PerformansTipi")}
                error={touched.PerformansTipi && Boolean(errors.PerformansTipi)}
                helperText={touched.PerformansTipi && errors.PerformansTipi}
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
                id="PerformansPuani"
                label="PerformansPuani"
                className="w-5/6"
                onChange={handleChange("PerformansPuani")}
                value={values.PerformansPuani}
                onBlur={handleBlur("PerformansPuani")}
                error={touched.PerformansPuani && Boolean(errors.PerformansPuani)}
                helperText={touched.PerformansPuani && errors.PerformansPuani}
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
                id="Yorumlar"
                label="Yorumlar"
                className="w-5/6"
                onChange={handleChange("Yorumlar")}
                value={values.Yorumlar}
                onBlur={handleBlur("Yorumlar")}
                error={touched.Yorumlar && Boolean(errors.Yorumlar)}
                helperText={touched.Yorumlar && errors.Yorumlar}
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

export default PerformansDegerlendirmeInsertForm;
