import { Box, Button, IconButton, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from './theme';
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit, NoteAdd } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setModalStatus } from '../../store/slices/modalSlice';
import Modal from '../Modal';
import RaporInsertForm from './RaporInsertForm';

const Rapor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const[title, setTitle] = useState("");
  const[content, setContent] = useState("");
  const[triggerRaporId, setTriggerRaporId] = useState("");
  const[trigger, setTrigger] = useState("");
  const[modalLoadingButton, setModalLoadinButton] = useState(false);
  const dispatch = useDispatch();
  const isGetRapor = useSelector((state)=>state.admin.isGetRapor);
  

  useEffect(()=>{
    getRapor();
  },[isGetRapor])

  

  const[Rapor, setRapor] = useState([]);

  const columns = [
    { 
    field: 'id',
    headerName: 'ID',
    flex: 0.4,
    headerAlign: 'center',
    align: 'center'
    },
    {
      field: 'baslangicTarih',
      headerName: 'Rapor Başlangıç Tarih',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'bitisTarih',
      headerName: 'Rapor Bitiş Tarih',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'raporTuru',
      headerName: 'Rapor Türü',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'aciklama',
      headerName: 'Açıklama',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'userId',
      headerName: 'User ID',
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
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   flex: 0.5,
    //   headerAlign: 'center',
    //   align: 'center',
    //   renderCell: (params) => {
    //     const handleEdit = () => {
    //       dispatch(setModalStatus(true));
    //       setTrigger('u');
    //       setTitle('Edit');
    //       setContent(<RaporUpdateForm Rapor={params.row} />);
    //     };

    //     const handleDelete = () => {
    //         dispatch(setModalStatus(true));
    //         setTrigger('d');
    //         setTitle('Delete');
    //         setContent('İlgili performansı silmek istediğinize emin misiniz ?');
    //         setTriggerRaporId(params.row.id);
    //     };

    //     return (
    //       <div>
    //         <IconButton onClick={handleEdit} aria-label="edit">
    //           <Edit />
    //         </IconButton>
    //         <IconButton onClick={handleDelete} aria-label="delete">
    //           <Delete />
    //         </IconButton>
    //       </div>
    //     );
    //   }
    // }
  ];



  const getRapor = async ()=>{

    try {
      const response = await axios.get("yonetici/Performans/PerformansRaporGet",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setRapor(response.data)
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


  // const deleteRapor = async (Raporid)=>{

  //   try {
  //     const response = await axios.delete(`yonetici/Performans/RaporDelete/${Raporid}`,      
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`
  //       }
  //     }
  //   );
  //     if (response.status === 200 || response.status === 204 ) {
  //       toast.success(response.data);
  //       await getRapor();
  //     }else {
  //       toast.info(
  //         "Beklenmedik bir durum meydana geldi, bilgilerinizi kontrol ederek lutfen tekrar deneyin."
  //       );
  //     }
  //   } catch (error) {
  //     if (error.code === "ERR_NETWORK") {
  //       toast.error("Sunucuya bağlanılamadı. !");
  //     } else if (error.response.status === 500) {
  //       //Problem(), server side bissunes exceptions and all catch error
  //       toast.error(error.response.data.detail);
  //     }else if (error.response.status === 401) {
  //         toast.error("Lütfen giriş yapınız.");
  //         navigate("/"); 
  //     } else if (error.response.status === 400) {
  //       //BadRequest(), server side valid. Eger frontend validinden bir sekil kurtulursa back validi devreye girecek
  //       Object.values(error.response.data.errors).forEach((value) => {
  //         value.forEach((message) => {
  //           toast.error(message);
  //         });
  //       });
  //     } else {
  //       toast.error("Opps! Beklenmedik bir hata meydana geldi.");
  //     }
  //   }        
  //   dispatch(setModalStatus(false));
  //   setModalLoadinButton(false);
  // }

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
          setContent(<RaporInsertForm />);
      }}
    >
      Create New
    </Button>
      </div>
          <span className='flex justify-center'>
             Raporlar
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
          rows={Rapor}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          
        />
      </Box>
      <Modal
        title={title}
        clickYes={() => {
          if(trigger === 'd'){
            setModalLoadinButton(true);
            // deleteRapor(triggerRaporId);
          }
        }}
        content={content}
        isYesNoButton={trigger === 'd' ? true : false}
        isLoadingButton={modalLoadingButton}
      />
    </Box>
  );
};

export default Rapor;
