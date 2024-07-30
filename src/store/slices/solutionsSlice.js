import { createSlice } from '@reduxjs/toolkit'

export const solutionsSlice = createSlice({

    name:'solutions',
    initialState:{
        solutions: []
    },
    reducers: {
        setSolutions: (state, actions)=>{
                state.solutions = actions.payload
        }
    }
})

export const {setSolutions} = solutionsSlice.actions
export default solutionsSlice.reducer