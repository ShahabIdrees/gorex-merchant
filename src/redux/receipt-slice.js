import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  transaction_type: null,
  litre_fuel: null,
  fuel_type: null,
  nozzle_price: null,
  plate_no: null,
  createdAt: null,
  vehicle_make: null,
  vehicle_model: null,
  vehicle_variant: null,
};

const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: {
    setReceipt: (state, action) => {
      return {...state, ...action.payload};
    },
    updateReceipt: (state, action) => {
      return {...state, ...action.payload};
    },
    clearReceipt: () => {
      return initialState;
    },
    setTransactionType: (state, action) => {
      state.transaction_type = action.payload;
    },
    setLitreFuel: (state, action) => {
      state.litre_fuel = action.payload;
    },
    setFuelType: (state, action) => {
      state.fuel_type = action.payload;
    },
    setNozzlePrice: (state, action) => {
      state.nozzle_price = action.payload;
    },
    setCreatedAt: (state, action) => {
      state.createdAt = action.payload;
    },
    setVehicleMake: (state, action) => {
      state.vehicle_make = action.payload;
    },
    setVehicleModel: (state, action) => {
      state.vehicle_model = action.payload;
    },
    setVehicleVariant: (state, action) => {
      state.vehicle_variant = action.payload;
    },
    setPlateNo: (state, action) => {
      state.plate_no = action.payload;
    },
  },
});

export const {
  setReceipt,
  updateReceipt,
  clearReceipt,
  setTransactionType,
  setLitreFuel,
  setFuelType,
  setNozzlePrice,
  setCreatedAt,
  setVehicleMake,
  setVehicleModel,
  setVehicleVariant,
  setPlateNo,
} = receiptSlice.actions;

export const selectReceipt = state => state.receipt;
export const selectTransactionType = state => state.receipt.transaction_type;
export const selectLitreFuel = state => state.receipt.litre_fuel;
export const selectFuelType = state => state.receipt.fuel_type;
export const selectNozzlePrice = state => state.receipt.nozzle_price;
export const selectCreatedAt = state => state.receipt.createdAt;
export const selectVehicleMake = state => state.receipt.vehicle_make;
export const selectVehicleModel = state => state.receipt.vehicle_model;
export const selectVehicleVariant = state => state.receipt.vehicle_variant;
export const selectPlateNo = state => state.receipt.plate_no;

export default receiptSlice.reducer;
