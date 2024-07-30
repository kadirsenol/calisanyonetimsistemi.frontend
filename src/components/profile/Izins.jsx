import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from './theme';
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete, DoneAll, Edit, HighlightOff, NoteAdd, ThumbUpAlt } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setModalStatus } from '../../store/slices/modalSlice';
import Modal from '../Modal';
import IzinInsertForm from './IzinInsertForm';

const Izins = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const[title, setTitle] = useState("");
  const[content, setContent] = useState("");
  const[triggerIzinId, setTriggerSmartLightId] = useState("");
  const[trigger, setTrigger] = useState("");
  const[modalLoadingButton, setModalLoadinButton] = useState(false);
  const dispatch = useDispatch();
  const isGetIzin = useSelector((state)=>state.admin.isGetIzin);
  const role = useSelector((state) => state.user.role);

  useEffect(()=>{
    if(role === "yonetici"){
      getIzins();
    }

  },[isGetIzin])

  const[Izins, setIzins] = useState([]);


  const columns = [
    {
     field: 'id',
     headerName: 'ID',
     flex: 0.2,
     headerAlign: 'center',
     align: 'center',
    },
    {
      field: 'izinTuru',
      headerName: 'İzin Türü',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'baslangicTarih',
      headerName: 'İzin Başlangıç Tarihi',
      headerAlign: 'center',
      align: 'center', 
      flex: 0.5
    },
    {
      field: 'bitisTarih',
      headerName: 'İzin Bitiş Tarihi',
      headerAlign: 'center',
      align: 'center', 
      flex: 0.5
    },
    {
      field: 'userId',
      headerName: 'User ID',
      headerAlign: 'center',
      align: 'center', 
      flex: 0.5
    },
    {
      field: 'onay',  
      headerName: 'Onay Durumu',
      flex: 0.8,
      headerAlign: 'center',
      align: 'end',
      renderCell: ({ row: { onay } }) => {
        return (
          <>

      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="60%"
          p="5px"
          mt={1} 
          ml={1.5}             
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={onay ? colors.greenAccent[600] : '#ff8c8c'}
          borderRadius="4px"
        >
          {onay ? <DoneAll /> : <HighlightOff />}
          <Typography color={colors.grey[100]} sx={{ ml: '5px' }}>
            {onay ? 'true' : 'false'}
          </Typography>
        </Box>
      </Box>
          </>
        );
      },
    },
    {
      field: 'createDate',
      headerName: 'Create Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center'
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
      flex: 0.4,
      headerAlign: 'center',
      align: 'center'
    },
    ...(role === "yonetici" ? [
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 0.5,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {

        const handleOnay = () => {
            dispatch(setModalStatus(true));
            setTrigger('d');
            setTitle('Delete');
            setContent('İlgili izin talebini onaylamak istediğinize emin misiniz ?');
            setTriggerSmartLightId(params.row.id);
        };

        return (
          
          <div>           
            <IconButton onClick={handleOnay} aria-label="delete">
              <ThumbUpAlt />
            </IconButton>
          </div>
          
        );
      }} ] : [])
    
  ];




  const getIzins = async ()=>{

    try {
      const response = await axios.get("yonetici/Izin/IzinTalepler",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        setIzins(response.data)
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

  const OnayIzin = async (solutionid)=>{
    try {
      const response = await axios.post(`yonetici/Izin/IzinOnay`,        
      {IzinId:solutionid},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );
      if (response.status === 200 || response.status === 204 ) {
        toast.success(response.data);
        await getIzins();
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
    { role !== "yonetici" ? 
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
          setContent(<IzinInsertForm />);
      }}
    >
      Create New
    </Button>
    : null
  }
      </div>
      
          <span className='flex justify-center'>
             İzinler Talepleri
         </span>
      </div>
      { role === "yonetici" ? 
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
        }}
      >
       
        <DataGrid rows={Izins} columns={columns} />
   
      </Box>      
      : null}
      <Modal
        title={title}
        clickYes={() => {
          if(trigger === 'd'){
            setModalLoadinButton(true);
            OnayIzin(triggerIzinId);
          }
        }}
        content={content}
        isYesNoButton={trigger === 'd' ? true : false}
        isLoadingButton={modalLoadingButton}
      />
    </Box>      
  );
};

export default Izins;
