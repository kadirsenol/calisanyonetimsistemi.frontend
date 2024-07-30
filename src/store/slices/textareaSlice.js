
import { createSlice } from "@reduxjs/toolkit";


export const textareaSlice = createSlice({

    name:'textarea',
    initialState:{
        message:""
    },
    reducers:{
        setMessage:(state,actions)=>{
            state.message = actions.payload
        },
        delMessage:(state)=>{
            state.message = ""
        }
    }
})

export const {setMessage,delMessage} = textareaSlice.actions
export default textareaSlice.reducer