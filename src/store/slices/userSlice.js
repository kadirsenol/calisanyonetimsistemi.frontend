import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({

    name:'user',
    initialState:{
        isLogin: false,
        role:"",
        name:"",
        surName:"",
        userId:"",
        pozisyon:""
    },
    reducers: {
        setLogin: (state)=>{
          state.isLogin = true  
        },
        setLogout: (state)=>{
            state.isLogin = false
        },
        setRole:(state,actions)=>{
            state.role = actions.payload
        },
        setName:(state,actions)=>{
            state.name = actions.payload
        },
        setEmail:(state,actions)=>{
            state.surName = actions.payload
        },
        setUserId:(state,actions)=>{
            state.userId = actions.payload
        },
        setPozisyon:(state,actions)=>{
            state.pozisyon = actions.payload
        }

    }
})

export const {setLogin,setLogout,setRole,setName,setEmail,setPozisyon,setUserId} = userSlice.actions
export default userSlice.reducer

