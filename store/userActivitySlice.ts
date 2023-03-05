import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserActivities } from '../api/userActivityAPI';
import { createUserActivity } from '../api/userAPI';
import { CreateUserActivityDTO, UserActivity } from './userSlice';

interface UserActivityState {
  userActivities: UserActivity[] | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: UserActivityState = {
  userActivities: null,
  status: 'idle',
  error: null,
}

const createUserActivityAsync = createAsyncThunk(
  'userActivity/create',
  async (arg: CreateUserActivityDTO, { rejectWithValue }) => {
    try {
      const response: any = await createUserActivity(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getUserActivitiesAsync = createAsyncThunk(
  'userActivity/get',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getUserActivities();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const userActivitySlice = createSlice({
  name: 'userActivity',
  initialState,
  reducers: {
    clearUserActivity(state) {
      state.userActivities = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getUserActivitiesAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getUserActivitiesAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.userActivities = action.payload;
      state.error = null;
    })
    .addCase(getUserActivitiesAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.userActivities = null;
      state.error = action.payload;
    })
    .addCase(createUserActivityAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(createUserActivityAsync.fulfilled, (state) => {
      state.status = 'idle';
      state.error = null;
    })
    .addCase(createUserActivityAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
})

export const { clearUserActivity } = userActivitySlice.actions;

export default userActivitySlice.reducer;

export {
  createUserActivityAsync,
  getUserActivitiesAsync,
}
