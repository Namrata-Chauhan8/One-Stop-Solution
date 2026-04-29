import { createReducer } from "@reduxjs/toolkit";

export const userReducer = createReducer({}, (builder) => {
  builder.addCase("loginRequest", (state, action) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase("loginSuccess", (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
    state.error = null;
    state.message = "Login successful";
  });
  builder.addCase("loginFail", (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.user = null;
    state.error = action.payload;
    state.message = null;
  });
  builder.addCase("signupRequest", (state, action) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase("signupSuccess", (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
    state.error = null;
    state.message = "Registration successful";
  });
  builder.addCase("signupFail", (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.user = null;
    state.error = action.payload;
    state.message = null;
  });
  builder.addCase("clearErrors", (state, action) => {
    state.error = null;
  });
  builder.addCase("clearMessage", (state, action) => {
    state.message = null;
  });

  // Get User Data
  builder.addCase("getUserDataRequest", (state, action) => {
    state.loading = true;
  });
  builder.addCase("getUserDataSuccess", (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
  });
  builder.addCase("getUserDataFail", (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.message = null;
    state.error = action.payload;
  });

  // Update Profile
  builder.addCase("updateProfileRequest", (state, action) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase("updateProfileSuccess", (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload;
    state.error = null;
    state.message = "Profile updated successfully";
  });
  builder.addCase("updateProfileFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.message = null;
  });

  // Update/Delete Profile Picture
  builder.addCase("updateProfilePictureRequest", (state, action) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase("updateProfilePictureSuccess", (state, action) => {
    state.loading = false;
    state.error = null;
    state.message = "Profile picture updated successfully";
  });
  builder.addCase("updateProfilePictureFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.message = null;
  });
  builder.addCase("deleteProfilePictureRequest", (state, action) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase("deleteProfilePictureSuccess", (state, action) => {
    state.loading = false;
    state.error = null;
    state.message = "Profile picture deleted successfully";
  });
  builder.addCase("deleteProfilePictureFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.message = null;
  });

  //Logout
  builder.addCase("logoutRequest", (state, action) => {
    state.loading = true;
  });
  builder.addCase("logoutSuccess", (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.user = null;
    state.error = null;
    state.message = "Logout successful";
  });
  builder.addCase("logoutFail", (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.error = action.payload;
    state.message = null;
  }); 
});
