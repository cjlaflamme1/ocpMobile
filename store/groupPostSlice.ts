import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createGroupPost } from '../api/groupPostAPI';
import { Group } from './groupSlice';
import { User } from './userSlice';

export interface CreateGroupPostDto {
  image?: string;
  postText?: string;
  groupId: string;
}

export interface GroupPost {
  id: string;
  image: string;
  postText: string;
  group?: Group;
  author: User;
  createdAt: Date;
}

interface GroupPostState {
  currentGroupsPosts: GroupPost[] | null;
  selectedPost: GroupPost | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: GroupPostState = {
  currentGroupsPosts: null,
  selectedPost: null,
  status: 'idle',
  error: null,
}

const createGroupPostAsync = createAsyncThunk(
  'groupPost/create',
  async (arg: CreateGroupPostDto, { rejectWithValue }) => {
    try {
      const response: any = await createGroupPost(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const groupPostSlice = createSlice({
  name: 'groupPost',
  initialState,
  reducers: {
    clearPosts(state) {
      state.currentGroupsPosts = [];
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createGroupPostAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(createGroupPostAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.selectedPost = action.payload;
      state.error = null;
    })
    .addCase(createGroupPostAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
})

export const { clearPosts } = groupPostSlice.actions;

export default groupPostSlice.reducer;

export {
  createGroupPostAsync,
}
