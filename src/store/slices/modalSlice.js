import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({

    name:'modal',
    initialState:{
        status:false       
    },
    reducers:{
        setModalStatus:(state,actions)=>{
            state.status = actions.payload
        }
    }

})

export const {setModalStatus} = modalSlice.actions
export default modalSlice.reducer