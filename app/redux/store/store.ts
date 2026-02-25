
import { configureStore } from "@reduxjs/toolkit";

import sectorReducer from '../Slice/sectorSlice';
import bookingReducer from '../Slice/bookingSlice';
import unitReducer from '../Slice/unitSlice';
   const store = configureStore({
    reducer: {  
        booking: bookingReducer ,    
        sector: sectorReducer,
        unit: unitReducer
    }   
    });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;