
import { createSlice } from "@reduxjs/toolkit";


export const controlUISlice = createSlice({

    name:'controlUI',
    initialState:{
        page:0,
        SmartLightAppIds:[],
        SmartLightAppIsActive:[]
    },
    reducers:{
        setPage:(state, actions)=>{
            state.page = actions.payload
        },
        setSmartLightAppIds:(state,actions)=>{
            state.SmartLightAppIds = actions.payload
        },
        setSmartLightAppIsActive:(state,actions)=>{
            state.SmartLightAppIsActive = actions.payload
        }

        
    }
})

export const {setPage,setSmartLightAppIds,setSmartLightAppIsActive} = controlUISlice.actions
export default controlUISlice.reducer