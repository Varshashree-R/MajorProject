import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==================== Axios instance ====================
const axiosFetch = axios.create({
  baseURL: "https://backend-qd0z.onrender.com/api",
  withCredentials: true, // ✅ send cookies if backend uses them
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to attach token dynamically
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

// ==================== Thunks ====================

export const postRealEstate = createAsyncThunk(
  "property/postRealEstate",
  async ({ formData, token }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.post("/owner/real-estate", formData, {
        headers: getAuthHeaders(token),
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || error.message
      );
    }
  }
);

export const getPersonalRealEstate = createAsyncThunk(
  "property/getPersonalRealEstate",
  async ({ page = 1, token }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(
        `/owner/real-estate?page=${page}`,
        {
          headers: getAuthHeaders(token),
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || error.message
      );
    }
  }
);

export const getRealEstateDetail = createAsyncThunk(
  "property/getRealEstateDetail",
  async ({ slug, token }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.get(`/owner/real-estate/${slug}`, {
        headers: getAuthHeaders(token),
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || error.message
      );
    }
  }
);

export const updateRealEstateDetail = createAsyncThunk(
  "property/updateRealEstateDetail",
  async ({ slug, formValues, token }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.patch(
        `/owner/real-estate/update/${slug}`,
        formValues,
        { headers: getAuthHeaders(token) }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || error.message
      );
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "property/deleteProperty",
  async ({ slug, token }, thunkAPI) => {
    try {
      const { data } = await axiosFetch.delete(
        `/owner/real-estate/delete/${slug}`,
        { headers: getAuthHeaders(token) }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.msg || error.message
      );
    }
  }
);

// ==================== Slice ====================
const realEstateOwnerSlice = createSlice({
  name: "property",
  initialState: {
    allRealEstate: null,
    realEstate: null,
    isLoading: false,
    isProcessing: false,
    postSuccess: false,
    alertFlag: false,
    alertMsg: "",
    alertType: null,
    numberOfPages: null,
  },
  reducers: {
    clearAlert: (state) => {
      state.alertFlag = false;
      state.alertMsg = "";
      state.alertType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // POST
      .addCase(postRealEstate.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(postRealEstate.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.realEstate = action.payload.realEstate;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Property added successfully";
        state.alertType = "success";
      })
      .addCase(postRealEstate.rejected, (state, action) => {
        state.isProcessing = false;
        state.postSuccess = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      // GET PERSONAL
      .addCase(getPersonalRealEstate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPersonalRealEstate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRealEstate = action.payload.realEstates;
        state.numberOfPages = action.payload.numberOfPages;
        state.alertFlag = false;
      })
      .addCase(getPersonalRealEstate.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      // GET SINGLE DETAIL
      .addCase(getRealEstateDetail.pending, (state) => {
        state.isLoading = true;
        state.postSuccess = false;
      })
      .addCase(getRealEstateDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realEstate = action.payload.realEstate;
        state.alertFlag = false;
      })
      .addCase(getRealEstateDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      // UPDATE
      .addCase(updateRealEstateDetail.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(updateRealEstateDetail.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.realEstate = action.payload.updatedRealEstate;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Property updated successfully";
        state.alertType = "success";
      })
      .addCase(updateRealEstateDetail.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      })
      // DELETE
      .addCase(deleteProperty.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.postSuccess = true;
        state.alertFlag = true;
        state.alertMsg = "Property deleted successfully";
        state.alertType = "success";
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isProcessing = false;
        state.alertFlag = true;
        state.alertMsg = action.payload;
        state.alertType = "error";
      });
  },
});

export const { clearAlert } = realEstateOwnerSlice.actions;
export default realEstateOwnerSlice.reducer;