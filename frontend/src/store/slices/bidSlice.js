import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Submit a bid
export const submitBid = createAsyncThunk(
  'bids/submitBid',
  async ({ gigId, message, price }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/bids`, {
        gigId,
        message,
        price,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit bid'
      );
    }
  }
);

// Fetch bids for a gig
export const fetchBidsForGig = createAsyncThunk(
  'bids/fetchBidsForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/bids/${gigId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bids'
      );
    }
  }
);

// Hire a freelancer
export const hireFreelancer = createAsyncThunk(
  'bids/hireFreelancer',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/bids/${bidId}/hire`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to hire freelancer'
      );
    }
  }
);

// Fetch user's bids
export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/bids/user/my-bids`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your bids'
      );
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBids: (state, action) => {
      state.bids = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit bid
      .addCase(submitBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBid.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch bids for gig
      .addCase(fetchBidsForGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBidsForGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Hire freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hireFreelancer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my bids
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.myBids = action.payload;
      });
  },
});

export const { clearError, setBids } = bidSlice.actions;
export default bidSlice.reducer;

