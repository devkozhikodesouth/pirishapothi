import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* -----------------------------
   Types
------------------------------ */

export type BookingForm = {
  name: string;
  phone: string;
  place: string;
  orderCount: number;
  sector: string;
  unit: string;
};

type BookingState = BookingForm & {
  loading: boolean;
  error: string | null;
  success: boolean;
};

/* -----------------------------
   Async Thunk (POST)
------------------------------ */

export const bookingThunk = createAsyncThunk<
  void,
  BookingForm,
  { rejectValue: string }
>("booking/create", async (formData, { rejectWithValue }) => {
  try {
    console.log(formData)
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const err = await response.json();
      return rejectWithValue(err?.message || "Booking failed");
    }
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error");
  }
});

/* -----------------------------
   Initial State
------------------------------ */

const initialState: BookingState = {
  name: "",
  phone: "",
  place: "",
  orderCount: 0,
  sector: "",
  unit: "",
  loading: false,
  error: null,
  success: false,
};

/* -----------------------------
   Slice
------------------------------ */

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bookingThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(bookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;