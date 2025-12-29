import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Person {
  id: string;
  title: string;
  firstname: string;
  lastname: string;
  birthday: string;
  nationality: string;
  citizenid: string;
  phone: string;
  mobileCode: string;
  passport: string;
  salary: string;
  gender: string;
}

interface PeopleState {
  list: Person[];
}

const initialState: PeopleState = {
  list: [],
};

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<Person[]>) => {
      state.list = action.payload;
    },
    addPerson: (state, action: PayloadAction<Person>) => {
      state.list.push(action.payload);
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.list.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
});

export const { setPeople, addPerson, updatePerson, deletePerson } =
  peopleSlice.actions;
export default peopleSlice.reducer;
