import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface BookingState {
  list: any[];
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
  total: number;
}

const initialState: BookingState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0,
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetch",
  async (
    params: {
      page: number;
      search?: string;
      sector?: string;
      unit?: string;
      sortField?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const query = new URLSearchParams({
        page: params.page.toString(),
        limit: "20",
        ...(params.search && { search: params.search }),
        ...(params.sector && { sector: params.sector }),
        ...(params.unit && { unit: params.unit }),
        ...(params.sortField && { sortField: params.sortField }),
        ...(params.sortOrder && { sortOrder: params.sortOrder }),
      });

      const res = await fetch(`/api/booking?${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const   getBookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.page = action.payload.pagination.page;
        state.pages = action.payload.pagination.pages;
        state.total = action.payload.pagination.total;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage } = getBookingsSlice.actions;
export default getBookingsSlice.reducer;