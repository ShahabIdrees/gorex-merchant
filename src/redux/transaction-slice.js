import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  transaction: {
    transaction_type: null, //both cases
    litre_fuel: null, //on prime
    fuel_type: null, //on prime
    static_qr_id: null, //off prime
    vehicle_id: null, //on prime
    // corporate_id: null, //on prime
  },
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      state.transaction = action.payload;
    },
    updateTransaction: (state, action) => {
      state.transaction = {...state.transaction, ...action.payload};
    },
    clearTransaction: state => {
      state.transaction = {
        transaction_type: null, //both cases
        litre_fuel: null, //on prime
        fuel_type: null, //on prime
        static_qr_id: null, //off prime
        vehicle_id: null, //on prime
        corporate_id: null, //on prime
      };
    },
  },
});

export const {setTransaction, updateTransaction, clearTransaction} =
  transactionSlice.actions;

export const selectTransaction = state => state.transaction.transaction;
export const selectTransactionType = state =>
  state.transaction.transaction.transaction_type;
export const selectLitreFuel = state =>
  state.transaction.transaction.litre_fuel;
export const selectFuelType = state => state.transaction.transaction.fuel_type;
export const selectStaticQrId = state =>
  state.transaction.transaction.static_qr_id;
export const selectVehicleId = state =>
  state.transaction.transaction.vehicle_id;
export const selectCorporateId = state =>
  state.transaction.transaction.corporate_id;

export default transactionSlice.reducer;
