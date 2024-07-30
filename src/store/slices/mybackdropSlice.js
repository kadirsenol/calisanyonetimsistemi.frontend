import { createSlice } from '@reduxjs/toolkit'

export const mybackdropSlice = createSlice({

    name:'mybackdrop',
    initialState:{
        open: false
    },
    reducers: {
        setOpenBackdrop: (state)=>{
            state.open = true
        },
        setCloseBackdrop:(state)=>{
            state.open = false
        }
    }
})

export const {setOpenBackdrop,setCloseBackdrop} = mybackdropSlice.actions
export default mybackdropSlice.reducer

