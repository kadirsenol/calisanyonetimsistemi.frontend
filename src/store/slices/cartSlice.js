import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({

    name:'cart',
    initialState:{
        solutions : [],
        isClick: false
    },
    reducers: {
        addToCart: (state,action)=>{
            state.solutions = action.payload
        },
        setClickSolutionCart : (state) =>{
            state.isClick = !state.isClick
        }
    }
})

export const {addToCart, emptyCart,removeToSolution, setClickSolutionCart} = cartSlice.actions
export default cartSlice.reducer

