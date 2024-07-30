import { createSlice } from "@reduxjs/toolkit";

export const solutionDetailSlice = createSlice({

    name:'solutionDetail',
    initialState:{
        solution :""
    },
    reducers: {
        setSolution : (state,actions)=>{
            state.solution = actions.payload
        }
    }


})

export const {setSolution} = solutionDetailSlice.actions
export default solutionDetailSlice.reducer