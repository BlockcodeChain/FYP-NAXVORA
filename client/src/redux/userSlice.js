import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  showCredentialPopup: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setShowCredentialPopup: (state, action) => {
      state.showCredentialPopup = action.payload;
    },
  },
});

export const { setUserData, setShowCredentialPopup } = userSlice.actions;
export default userSlice.reducer;