import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCloseBackdrop } from '../store/slices/mybackdropSlice';
import {CircularProgress,Backdrop} from '@mui/material'

export default function MyBackdrop() {

 const open = useSelector((state)=>state.mybackdrop.open)
 const dispatch = useDispatch()

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={()=>dispatch(setCloseBackdrop())}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
