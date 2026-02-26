import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSectors } from "./sectorSlice";

export const fetchUnits = createAsyncThunk(
  "unit/fetchUnits",
  async (sectorName:string,{ rejectWithValue }) => {
    if (!sectorName || sectorName === 'others') return [];
 try {
  console.log(sectorName)
     const res = await fetch(`/api/unit/${sectorName}`);
    
    if (!res.ok) return rejectWithValue("Failed to fetch sectors");
    return res.json();
 } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    list: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action)
        state.list = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export default unitSlice.reducer;