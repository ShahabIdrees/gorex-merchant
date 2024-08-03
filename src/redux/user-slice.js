import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    _id: null,
    user_name: null,
    fuel_station_image: null,
    token: null,
    is_verified: null,
    phone: null,
    profile_pic: null,
    fuel_station_user_details_id: null,
    user_id_fuel_station_user: null,
    fuel_station_id: null,
    fuelStationName: null,
  },
  reducers: {
    setUser: (state, action) => {
      return {...state, ...action.payload};
    },
    clearUser: state => {
      return {
        _id: null,
        user_name: null,
        token: null,
        is_verified: null,
        phone: null,
        profile_pic: null,
        fuel_station_user_details_id: null,
        user_id_fuel_station_user: null,
        fuel_station_id: null,
        fuelStationName: null,
      };
    },
    setUserId: (state, action) => {
      state._id = action.payload;
    },
    setUserName: (state, action) => {
      state.user_name = action.payload;
    },
    setFuelStationImage: (state, action) => {
      state.fuel_station_image = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsVerified: (state, action) => {
      state.is_verified = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setProfilePic: (state, action) => {
      state.profile_pic = action.payload;
    },
    setFuelStationUserDetailsId: (state, action) => {
      state.fuel_station_user_details_id = action.payload;
    },
    setUserIdFuelStationUser: (state, action) => {
      state.user_id_fuel_station_user = action.payload;
    },
    setFuelStationId: (state, action) => {
      state.fuel_station_id = action.payload;
    },
    setFuelStationName: (state, action) => {
      state.fuelStationName = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setUserId,
  setUserName,
  setFuelStationImage,
  setToken,
  setIsVerified,
  setPhone,
  setProfilePic,
  setFuelStationUserDetailsId,
  setUserIdFuelStationUser,
  setFuelStationId,
  setFuelStationName,
} = userSlice.actions;

// Selectors
export const selectUser = state => state.user;
export const selectUserId = state => state.user._id;
export const selectUserName = state => state.user.user_name;
export const selectFuelStationImage = state => state.user.fuel_station_image;
export const selectToken = state => state.user.token;
export const selectIsVerified = state => state.user.is_verified;
export const selectPhone = state => state.user.phone;
export const selectProfilePic = state => state.user.profile_pic;
export const selectFuelStationUserDetailsId = state =>
  state.user.fuel_station_user_details_id;
export const selectUserIdFuelStationUser = state =>
  state.user.user_id_fuel_station_user;
export const selectFuelStationId = state => state.user.fuel_station_id;
export const selectFuelStationName = state => state.user.fuelStationName;

export default userSlice.reducer;
