import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  history: [
    {
      fuelStationId: '',
      fuelStationName: 'PSO',
      fuelStationAddress: 'Alamont',
      fuelType: 'Super',
      date: '', // Ensure createdAt is included
      image: '',
      quantity: 0,
      createdAt: '',
      _id: '',
    },
  ],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    addHistoryItem: (state, action) => {
      state.history.push(action.payload);
    },
    updateHistoryItem: (state, action) => {
      const index = state.history.findIndex(
        item => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.history[index] = action.payload;
      }
    },
    removeHistoryItem: (state, action) => {
      state.history = state.history.filter(
        item => item.id !== action.payload.id,
      );
    },
  },
});

export const {
  setHistory,
  addHistoryItem,
  updateHistoryItem,
  removeHistoryItem,
} = historySlice.actions;

export const selectHistory = state => state.history.history;

export const selectHistoryItemById = (state, id) =>
  state.history.history.find(item => item.id === id);

export const selectHistoryByDate = (state, date) =>
  state.history.history.filter(item => item.createdAt.startsWith(date));

export const selectHistoryByFuelStationName = (state, name) =>
  state.history.history.filter(item => item.fuel_station_id.name === name);

export const selectHistoryByDateAndFuelStationName = (state, date, name) =>
  state.history.history.filter(
    item =>
      item.createdAt.startsWith(date) && item.fuel_station_id.name === name,
  );

export default historySlice.reducer;
