import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedCity: null,
  selectedDate: null,
  selectedFuelStation: null,
  dates: [],
  cities: [],
  fuelStations: [],
  filteredTransactions: [
    {
      fuelStationName: 'PSO',
      fuelStationAddress: 'Alamont',
      fuelType: 'Super',
      date: '',
      image: '',
      quantity: 0,
      createdAt: '',
      _id: '',
    },
  ],
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setDates(state, action) {
      state.dates = action.payload;
    },
    setCities(state, action) {
      state.cities = action.payload;
    },
    setFuelStations(state, action) {
      state.fuelStations = action.payload;
    },
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    setSelectedFuelStation(state, action) {
      state.selectedFuelStation = action.payload;
    },
    setFilteredTransactions(state, action) {
      state.filteredTransactions = action.payload;
    },
  },
});

export const {
  setDates,
  setCities,
  setFuelStations,
  setSelectedCity,
  setSelectedDate,
  setSelectedFuelStation,
  setFilteredTransactions,
} = filterSlice.actions;

// Correct selector definition to select cities array
export const selectCities = state => state.filters.cities;
export const selectFuelStations = state => state.filters.fuelStations;
export const selectSelectedCity = state => state.filters.selectedCity;
export const selectSelectedDate = state => state.filters.selectedDate;
export const selectSelectedFuelStation = state =>
  state.filters.selectedFuelStation;
export const selectFilteredTransactions = state =>
  state.filters.filteredTransactions;

export default filterSlice.reducer;
