
import { createSlice } from "@reduxjs/toolkit";


export const adminSlice = createSlice({

    name:'admin',
    initialState:{
        pageAdmin:"Dashboard",
        isGetUser:false,
        isGetPerformansDegerlendirme:false,
        isGetIzin:false,
        isGetRapor:false,
        isGetPreOrderDetail:false,
        isGetProfileImage : false


    },
    reducers:{
        setPageAdmin:(state, actions)=>{
            state.pageAdmin = actions.payload
        },
        setIsGetUser:(state)=>{
            state.isGetUser = !state.isGetUser
        },
        setIsGetPerformansDegerlendirme:(state)=>{
            state.isGetPerformansDegerlendirme = !state.isGetPerformansDegerlendirme
        },
        setIsGetIzin:(state)=>{
            state.isGetIzin = !state.isGetIzin
        },
        setIsGetRapor:(state)=>{
            state.isGetRapor = !state.isGetRapor
        },
        setIsGetPreOrderDetail:(state)=>{
            state.isGetPreOrderDetail = !state.isGetPreOrderDetail
        },
        setIsGetProfileImage:(state)=>{
            state.isGetProfileImage = !state.isGetProfileImage
        }

        
    }
})

export const {setPageAdmin,setIsGetUser,setIsGetPerformansDegerlendirme,setIsGetIzin,setIsGetRapor,setIsGetPreOrderDetail,setIsGetProfileImage} = adminSlice.actions
export default adminSlice.reducer