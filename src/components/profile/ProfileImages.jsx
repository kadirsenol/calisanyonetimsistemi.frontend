import { Box, IconButton, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from './theme';
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setModalStatus } from '../../store/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../Modal';
import { Delete } from '@mui/icons-material';

const ProfileImages = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const[title, setTitle] = useState("");
  const[content, setContent] = useState("");
  const[triggerSolutionId, setTriggerSolutionId] = useState("");
  const[trigger, setTrigger] = useState("");
  const[modalLoadingButton, setModalLoadinButton] = useState(false);
  const dispatch = useDispatch();
  const isGetProfileImage = useSelector((state)=>state.admin.isGetProfileImage);

  useEffect(()=>{
    getProfileImages();
  },[isGetProfileImage])

  

  const[profileImages, setProfileImages] = useState([]);

  const columns = [
    { 
    field: 'id',
    headerName: 'ID',
    flex: 0.4,
    headerAlign: 'center',
    align: 'center'
    },
    {
      field: 'image',
      headerName: 'Image',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'userId',
      headerName: 'User Id',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'createDate',
      headerName: 'Create Date',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'updateDate',
      headerName: 'Update Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'isDelete',
      headerName: 'Is Delete',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {

        const handleDelete = () => {
            dispatch(setModalStatus(true));
            setTrigger('d');
            setTitle('Delete');
            setContent('İlgili profil resmi silmek istediğinize emin misiniz ?');
            setTriggerSolutionId(params.row.id);
        };

        return (
          <div>
            <IconButton onClick={handleDelete} aria-label="delete">
              <Delete />
            </IconButton>
          </div>
        );
      }
    }
  ];



  const getProfileImages = async ()=>{

    try {
      const response = await axios.get("http://localhost:5051/api/admin/ProfileImage/GetProfileImages",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setProfileImages(response.data)
      }else {
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
      }else if (error.response.status === 401) {
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
  }

  const deletePreOrderDetail = async (profileimageid)=>{

    try {
      const response = await axios.post("http://localhost:5051/api/admin/ProfileImage/DeleteProfileImage",
      {Id : profileimageid},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        toast.success(response.data);
        await getProfileImages();
      }else {
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
      }else if (error.response.status === 401) {
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
    setModalLoadinButton(false);
  }

  return (
    <Box m="15px">
      <div className='flex justify-center items-center font-bold text-2xl'>
            <span className='font-bold text-2xl p-0.5 rounded-md text-gray-700'>
             Profile Images
            </span>
        </div>
      <Box
        m="30px 0 0 0"
        height="75vh"        
        sx={{
          borderRadius: '16px',
          overflow: 'hidden', 
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#888888', // Alternatif kolon başlıkları için gri arka plan rengi            
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: '#666666',
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={profileImages}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Modal
        title={title}
        clickYes={() => {
          if(trigger === 'd'){
            setModalLoadinButton(true);
            deletePreOrderDetail(triggerSolutionId);
          }
        }}
        content={content}
        isYesNoButton={trigger === 'd' ? true : false}
        isLoadingButton={modalLoadingButton}
      />
    </Box>
  );
};

export default ProfileImages;
