import { configureStore } from "@reduxjs/toolkit";
import peopleReducer from "./features/peopleSlice";
import formReducer from "./features/formSlice";

export const store = configureStore({
  reducer: {
    people: peopleReducer,
    personForm: formReducer,
    // language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
