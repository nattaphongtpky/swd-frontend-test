import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  id: string | null;
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

const initialState: FormState = {
  id: null,
  title: "",
  firstname: "",
  lastname: "",
  birthday: "",
  nationality: "",
  citizenid: "",
  phone: "",
  mobileCode: "",
  passport: "",
  salary: "",
  gender: "",
};

const formSlice = createSlice({
  name: "personForm",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof FormState; value: string }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setEditMode: (state, action: PayloadAction<FormState>) => {
      return action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, setEditMode, resetForm } = formSlice.actions;
export default formSlice.reducer;
