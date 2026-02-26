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

export type Booking = BookingForm & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

type BookingState = BookingForm & {
  loading: boolean;
  error: string | null;
  success: boolean;
  bookings: Booking[];
  fetchLoading: boolean;
  fetchError: string | null;
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
   Async Thunk (GET)
------------------------------ */

export const fetchBookingsThunk = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>("booking/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/booking");
    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result?.message || "Failed to fetch bookings");
    }

    return result.data as Booking[];
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
  bookings: [],
  fetchLoading: false,
  fetchError: null,
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
      })
      // fetchBookingsThunk cases
      .addCase(fetchBookingsThunk.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchBookingsThunk.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingsThunk.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload || "Failed to fetch bookings";
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;