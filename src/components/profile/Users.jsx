import { Box, IconButton, useTheme, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from './theme';
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit, NoteAdd } from '@mui/icons-material';
import Modal from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalStatus } from '../../store/slices/modalSlice';
import UserUpdateForm from './UserUpdateForm';
import UserInsertForm from './UserInsertForm';

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const[modalLoadingButton, setModalLoadinButton] = useState(false);
  const isGetUser = useSelector((state)=>state.admin.isGetUser);

  useEffect(()=>{
    getUsers();
  },[isGetUser])

 

  const[users, setUsers] = useState([]);
  const[trigger, setTrigger] = useState("");
  const[title, setTitle] = useState("");
  const[content, setContent] = useState("");
  const[triggerUserId, setTriggerUserId] = useState("");





  const columns = [
    { 
    field: 'id',
    headerName: 'ID',
    flex: 0.1,
    headerAlign: 'center',
    align: 'center'
    },
    {
      field: 'ad',
      headerName: 'Ad',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'pozisyon',
      headerName: 'Pozisyon',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'departman',
      headerName: 'Departman',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'uyelikOnay',
      headerName: 'Üyelik Onayı',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'baslamaTarihi',
      headerName: 'Baslama Tarihi',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'hastalikIzinBakiye',
      headerName: 'Hastalık İzin Bakiye',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'tatilIzinBakiye',
      headerName: 'Tatil İzin Bakiye',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'ozelIzinBakiye',
      headerName: 'Özel İzin Bakiye',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'toplamUretkenlikPuan',
      headerName: 'Üretkenlik Toplam Puan',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'toplamTakimCalismasiPuan',
      headerName: 'Takim Calismasi Toplam Puan',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'toplamAnalitiklikPuan',
      headerName: 'Analitiklik Toplam Puan',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center'
    },
    // {
    //   field: 'password',
    //   headerName: 'Password',
    //   flex: 0.3,
    //   headerAlign: 'center',
    //   align: 'center'
    // },
    // {
    //   field: 'rol',
    //   headerName: 'Rol',
    //   flex: 0.3,
    //   headerAlign: 'center',
    //   align: 'center'
    // },
    // {
    //   field: 'isConfirmEmail',
    //   headerName: 'Is Confirm Email',
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 0.4,
    // },
    // {
    //   field: 'accessToken',
    //   headerName: 'Access Token',
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 0.4,
    // },
    // {
    //   field: 'refreshToken',
    //   headerName: 'Refresh Token',
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 0.4,
    // },
    // {
    //   field: 'exprationToken',
    //   headerName: 'Expration Token',
    //   headerAlign: 'center',
    //   align: 'center',
    //   flex: 0.4,
    // },
    // {
    //   field: 'createDate',
    //   headerName: 'Create Date',
    //   flex: 0.4,
    //   headerAlign: 'center',
    //   align: 'center'
    // },
    // {
    //   field: 'updateDate',
    //   headerName: 'Update Date',
    //   flex: 0.4,
    //   headerAlign: 'center',
    //   align: 'center'
    // },
    // {
    //   field: 'isDelete',
    //   headerName: 'IsDelete',
    //   flex: 0.3,
    //   headerAlign: 'center',
    //   align: 'center'
    // },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const handleEdit = () => {
          dispatch(setModalStatus(true));
          setTrigger('u');
          setTitle('Edit');
          setContent(<UserUpdateForm key={params.row.id} user={params.row} />);
        };

        const handleDelete = () => {
            dispatch(setModalStatus(true));
            setTrigger('d');
            setTitle('Delete');
            setContent('İlgili kullanıcıyı silmek istediğinize emin misiniz ?');
            setTriggerUserId(params.row.id);
        };

        return (
          <div>
            <IconButton onClick={handleEdit} aria-label="edit">
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete} aria-label="delete">
              <Delete />
            </IconButton>
          </div>
        );
      }
    }

  ];



  const getUsers = async ()=>{

    try {
      const response = await axios.get("yonetici/User/GetUsers",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setUsers(response.data)
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



  const deleteUser = async (userid)=>{

    try {
      const response = await axios.post("yonetici/User/DeleteUser",
      {Id : userid},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        toast.success(response.data);
        await getUsers();
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
        <div className='relative font-bold text-2xl'>
          <div className='absolute left-0 p-0.5 rounded-md text-gray-700'>
     <Button
      variant="contained"
      color="inherit"
      className='mt-3 ms-1'
      size='small'
      startIcon={<NoteAdd />}
      onClick={()=>{
          dispatch(setModalStatus(true));
          setTrigger('i');
          setTitle('Create');
          setContent(<UserInsertForm />);
      }}
    >
      Create New
    </Button>
      </div>
          <span className='flex justify-center'>
             Users
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
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          
        />        
      </Box>

      <Modal
        title={title}
        clickYes={() => {
          if(trigger === 'd'){
            setModalLoadinButton(true);
            deleteUser(triggerUserId);
          }
        }}
        content={content}
        isYesNoButton={trigger === 'd' ? true : false}
        isLoadingButton={modalLoadingButton}
      />
    </Box>
  );
};

export default Users;
