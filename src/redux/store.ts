
// redux toolkit

import { configureStore } from "@reduxjs/toolkit"
import { CounterReducer } from "./slices/counterSlice"



// Store does not have a valid reducer.
export const store = configureStore({
    reducer: {
        counter: CounterReducer
    }
})



export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch
