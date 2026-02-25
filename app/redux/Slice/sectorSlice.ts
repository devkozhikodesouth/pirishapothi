import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSectors = createAsyncThunk(
  "sector/fetchSectors",
  async () => {
 try {
     const res = await fetch("/api/sector");
    
    if (!res.ok) throw new Error("Failed to fetch sectors");
    return res.json();
 } catch (error) {
  console.log(error)
 }
  }
);

const sectorSlice = createSlice({
  name: "sector",
  initialState: {
    list: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSectors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action)
        state.list = action.payload;
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export default sectorSlice.reducer;