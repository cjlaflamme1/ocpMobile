import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createGroupPost, getAllGroupPosts, getOneGroupPost } from '../api/groupPostAPI';
import { QueryObject } from '../models/QueryObject';
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
  authorImageUrl?: string;
  imageGetUrl?: string;
}

interface GroupPostState {
  currentGroupsPosts: {
    groupPosts: GroupPost[] | null;
    count: number;
  };
  selectedPost: GroupPost | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: GroupPostState = {
  currentGroupsPosts: {
    groupPosts: [],
    count: 0,
  },
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

const getAllGroupPostsAsync = createAsyncThunk(
  'groupPost/getAll',
  async (params: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getAllGroupPosts(params);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getOneGroupPostAsync = createAsyncThunk(
  'groupPost/getOne',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response: any = await getOneGroupPost(postId);
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
      state.currentGroupsPosts = {
        groupPosts: [],
        count: 0,
      };
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
    })
    .addCase(getAllGroupPostsAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getAllGroupPostsAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.currentGroupsPosts = action.payload;
      state.error = null;
    })
    .addCase(getAllGroupPostsAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.currentGroupsPosts = {
        groupPosts: [],
        count: 0,
      };
      state.error = action.payload;
    })
    .addCase(getOneGroupPostAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getOneGroupPostAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.selectedPost = action.payload;
      state.error = null;
    })
    .addCase(getOneGroupPostAsync.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  }
})

export const { clearPosts } = groupPostSlice.actions;

export default groupPostSlice.reducer;

export {
  createGroupPostAsync,
  getAllGroupPostsAsync,
  getOneGroupPostAsync,
}
