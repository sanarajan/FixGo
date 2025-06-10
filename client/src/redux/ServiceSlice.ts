// redux/ServiceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Service {
  name: string;
  id: string;
  subcategories: string[];
}

interface Subcategory {
  name: string;
  id: string;
  serviceId: string[];
}

interface ServiceState {
  service: Service[];
  subcategory: Subcategory[];
}

const loadFromLocalStorage = (): ServiceState => {
  try {
    const data = localStorage.getItem('serviceState');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse serviceState from localStorage:", e);
  }

  // Always return a default initial state if anything goes wrong
  return { service: [], subcategory: [] };
};


const saveToLocalStorage = (state: ServiceState) => {
  try {
    localStorage.setItem('serviceState', JSON.stringify(state));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
};

const initialState: ServiceState = loadFromLocalStorage();

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setService(state, action: PayloadAction<Service[]>) {
      state.service = action.payload;
      saveToLocalStorage(state);
    },
    setSubcategory(state, action: PayloadAction<Subcategory[]>) {
      state.subcategory = action.payload;
      saveToLocalStorage(state);
    },
    resetService(state) {
      state.service = [];
      state.subcategory = [];
      localStorage.removeItem('serviceState');
    }
  }
});

export const { setService, setSubcategory, resetService } = serviceSlice.actions;
export default serviceSlice.reducer;
