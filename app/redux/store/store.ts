
import { configureStore } from "@reduxjs/toolkit";

import sectorReducer from '../Slice/sectorSlice';
import bookingReducer from '../Slice/bookingSlice';
import unitReducer from '../Slice/unitSlice';
import getBookingReducer from '../Slice/getBookingSlice';
import authReducer from '../Slice/authSlice';
   const store = configureStore({
    reducer: {  
        booking: bookingReducer ,    
        sector: sectorReducer,
        unit: unitReducer,
        getBooking: getBookingReducer,
        auth: authReducer,
        
    }   
    });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;