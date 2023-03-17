import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createGroup, getAllGroups, getOneGroup, getUserGroups } from '../api/groupAPI';
import { getAllInvitations } from '../api/groupInvitationAPI';
import { QueryObject } from '../models/QueryObject';
import { User } from './userSlice';

export interface CreateGroupInviteDto {
  message?: string;
  invitedUserId: string;
  invitedById: string;
  groupId: string;
}

export interface CreateGroupDto {
  coverPhoto: string | null;
  title: string;
  description: string;
  groupAdminIds: string[];
  pendingInvitationUserIds?: string[];
}

export interface GroupInvitation {
  id: string;
  accepted: boolean;
  message: string;
  viewed: boolean;
  invitedUser: User;
  group: Group;
  invitedBy: User;
}

export interface Group {
  id: string;
  coverPhoto: string;
  title: string;
  description: string;
  groupAdmins: User[];
  users: User[];
  pendingInvitations: GroupInvitation[];
  imageGetUrl?: string;
}

interface GroupState {
  allGroups: {
    groups: Group[] | null;
    count: number;
  };
  searchForGroups: {
    groups: Group[] | null;
    count: number;
  };
  allInvitations: GroupInvitation[] | null;
  selectedGroup: Group | null;
  status: 'idle' | 'loading' | 'failed';
  error: any;
}

const initialState: GroupState = {
  allGroups: {
    groups: null,
    count: 0,
  },
  searchForGroups: {
    groups: null,
    count: 0,
  },
  allInvitations: null,
  selectedGroup: null,
  status: 'idle',
  error: null,
}

const createGroupAsync = createAsyncThunk(
  'group/create',
  async (arg: CreateGroupDto, { rejectWithValue }) => {
    try {
      const response: any = await createGroup(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllGroupsAsync = createAsyncThunk(
  'group/getAll',
  async (arg: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getAllGroups(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllUserGroupsAsync = createAsyncThunk(
  'group/getUserGroups',
  async (arg: QueryObject, { rejectWithValue }) => {
    try {
      const response: any = await getUserGroups(arg);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getOneGroupAsync = createAsyncThunk(
  'group/getOneGroup',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: any = await getOneGroup(id);
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  },
);

const getAllInvitationsAsync = createAsyncThunk(
  'group/getAllInvitations',
  async (arg, { rejectWithValue }) => {
    try {
      const response: any = await getAllInvitations();
      return response.data;
    } catch (err: any) {
      rejectWithValue({
        name: err.name,
        message: err.message,
      });
    }
  }
)

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    clearGroupList(state) {
      state.allGroups = {
        groups: [],
        count: 0,
      };
    },
    clearSelectedGroup(state) {
      state.selectedGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroupsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllGroupsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.searchForGroups = action.payload;
        state.error = null;
      })
      .addCase(getAllGroupsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.searchForGroups = {
          groups: [],
          count: 0,
        };
        state.error = action.payload;
      })
      .addCase(getAllUserGroupsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUserGroupsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.allGroups = action.payload;
        state.error = null;
      })
      .addCase(getAllUserGroupsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.allGroups = {
          groups: [],
          count: 0,
        };
        state.error = action.payload;
      })
      .addCase(createGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createGroupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedGroup = action.payload;
        state.error = null;
      })
      .addCase(createGroupAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedGroup = null;
        state.error = action.payload;
      })
      .addCase(getOneGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOneGroupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selectedGroup = action.payload;
        state.error = null;
      })
      .addCase(getOneGroupAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedGroup = null;
        state.error = action.payload;
      })
      .addCase(getAllInvitationsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllInvitationsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.allInvitations = action.payload;
        state.error = null;
      })
      .addCase(getAllInvitationsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.allInvitations = null;
        state.error = action.payload;
      });
  }
})

export const { clearGroupList, clearSelectedGroup } = groupSlice.actions;

export default groupSlice.reducer;

export {
  getAllGroupsAsync,
  createGroupAsync,
  getAllUserGroupsAsync,
  getOneGroupAsync,
  getAllInvitationsAsync,
}
