import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createGroupEvent, getAllGroupEvents } from '../api/groupEventAPI';
import { QueryObject } from '../models/QueryObject';
import { Group } from './groupSlice';
import { User } from './userSlice';

export interface CreateGroupEventDto {
  eventDate: Date;
  title: string;
  description: string;
  groupId: string;
  coverPhoto: string;
}

export interface GroupEvent {
  id: string;
  eventDate: Date;
  coverPhoto: string | null;
  title: string;
  description: string | null;
  creator: User;
  group: Group;
  attendingUsers?: User[];
  imageGetUrl?: string;
  createdAt: Date;
}

interface GroupEventState {
  currentGroupEvents: {
    groupEvents: GroupEvent[] | null;
    count: number;
  };
  selectedGroupEvent: GroupEvent | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: GroupEventState = {
  currentGroupEvents: {
    groupEvents: [],
    count: 0,
  },
  selectedGroupEvent: null,
  status: 'idle',
  error: null,
}

const createGroupEventAsync = createAsyncThunk(
  'groupEvent/create',
  async (arg: CreateGroupEventDto, { rejectWithValue }) => {
    try {
      const response: any = await createGroupEvent(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllGroupEventsAsync = createAsyncThunk(
  'groupEvent/getAll',
  async (params: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getAllGroupEvents(params);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const groupEventSlice = createSlice({
  name: 'groupEvent',
  initialState,
  reducers: {
    clearEvents(state) {
      state.currentGroupEvents = {
        groupEvents: [],
        count: 0
      };
      state.selectedGroupEvent = null;
    },
    clearSelectedEvent(state) {
      state.selectedGroupEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(createGroupEventAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(createGroupEventAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.selectedGroupEvent = action.payload;
      state.error = null;
    })
    .addCase(createGroupEventAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    .addCase(getAllGroupEventsAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getAllGroupEventsAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.currentGroupEvents = action.payload;
      state.error = null;
    })
    .addCase(getAllGroupEventsAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.currentGroupEvents = {
        groupEvents: [],
        count: 0,
      };
      state.error = action.payload;
    });
  }
});

export const { clearEvents, clearSelectedEvent } = groupEventSlice.actions;

export default groupEventSlice.reducer;

export {
  createGroupEventAsync,
  getAllGroupEventsAsync,
}
