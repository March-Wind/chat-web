import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { debug } from 'webpack';

// Define a type for the slice state
interface CounterState {
  value: number;
  apiData?: any;
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
      return state;
    },
    decrement: (state) => {
      state.value -= 1;
      return state;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
      return state;
    },
    setApiData: (state, action: PayloadAction<string>) => {
      debugger;
      return {
        ...state,
        apiData: action.payload,
      };
    },
  },
});

export const { increment, decrement, incrementByAmount, setApiData } = counterSlice.actions;
export default counterSlice.reducer;
