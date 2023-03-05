import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserActivity, getCurrentUser, updateCurrentUser } from '../api/userAPI';
import { ActivityType } from './activityTypeSlice';

export interface CreateUserActivityDTO {
  information: string;
  favoriteLocations: string;
  yearsParticipating: string;
  preferredGroupDetails: string;
  seekingMentor: boolean;
  mentorNeedsDetails: string;
  offeringMentorship: boolean;
  provideMentorshipDetails: string;
  activityTypeId: string;
  coverPhoto: string;
}

export interface UserActivity {
  id: string;
  information: string;
  favoriteLocations: string;
  yearsParticipating: string;
  preferredGroupDetails: string;
  seekingMentor: boolean;
  mentorNeedsDetails: string;
  offeringMentorship: boolean;
  provideMentorshipDetails: string;
  activityType: ActivityType;
  coverPhoto: string;
  getImageUrl: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  profilePhoto: string | null;
  expoPushToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  imageGetUrl?: string;
  activities: UserActivity[] | null;
}

interface UserState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
}

const getCurrentUserAsync = createAsyncThunk(
  'user/getCurrent',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getCurrentUser();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const updateCurrentUserAsync = createAsyncThunk(
  'user/updateCurrent',
  async (arg: { id: string, updateBody: Partial<User> }, { rejectWithValue }) => {
    try {
      const response: any = await updateCurrentUser(arg.id, arg.updateBody);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message:err.message,
      });
    }
  },
);

const createUserActivityAsync = createAsyncThunk(
  'user/createUserActivity',
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
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState(state) {
      state.currentUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.currentUser = null;
        state.error = action.payload;
      })
      .addCase(updateCurrentUserAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCurrentUserAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateCurrentUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.currentUser = null;
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

export const { clearUserState } = userSlice.actions;

export default userSlice.reducer;

export {
  getCurrentUserAsync,
  updateCurrentUserAsync,
  createUserActivityAsync,
}
