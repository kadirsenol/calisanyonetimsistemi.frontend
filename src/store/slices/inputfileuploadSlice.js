
import { createSlice } from "@reduxjs/toolkit";


export const inputfileuploadSlice = createSlice({

    name:'inputfileupload',
    initialState:{
        attachmentName:"",
        VisuallyHiddenInputValue:null
    },
    reducers:{
        setFileName:(state, actions)=>{
            state.attachmentName = actions.payload
        },
        deleteFileName:(state,actions)=>{
            state.attachmentName = ""
            localStorage.removeItem(actions.payload)
            state.VisuallyHiddenInputValue = ""
        },
        emptyTheFileName:(state,actions)=>{            
            localStorage.removeItem(actions.payload);
            state.attachmentName = ""
            state.VisuallyHiddenInputValue = "" //file input umun valuesini silebilmek icin      
        }

        
    }
})

export const {deleteFileName,emptyTheFileName,setFileName} = inputfileuploadSlice.actions
export default inputfileuploadSlice.reducer