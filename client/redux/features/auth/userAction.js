import api from "../../../api/api";

const normalizeProfilePicture = (profilePicture) => {
  if (!profilePicture) return "";
  if (typeof profilePicture === "string") return profilePicture;
  if (typeof profilePicture === "object") {
    if (typeof profilePicture.url === "string") return profilePicture.url;
    if (typeof profilePicture.uri === "string") return profilePicture.uri;
    return "";
  }
  return "";
};

//login action

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "loginRequest" });
    const data = await api(
      "/user/login",
      {
        email,
        password,
      },
      "POST",
    );

    dispatch({ type: "loginSuccess", payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: "loginFail",
      payload: error.message || "Login failed",
    });
    throw error;
  }
};

//signup action
export const signup =
  (name, email, password, address, city, country, phone) =>
  async (dispatch) => {
    try {
      dispatch({ type: "signupRequest" });
      const data = await api(
        "/user/signup",
        {
          name,
          email,
          password,
          address,
          city,
          country,
          phone,
        },
        "POST",
      );

      dispatch({ type: "signupSuccess", payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: "signupFail",
        payload: error.message || "Signup failed",
      });
      throw error;
    }
  };

//Get User data action
export const getUserData = () => async (dispatch) => {
  try {
    dispatch({ type: "getUserDataRequest" });
    const data = await api("/user/profile", "", "get");
    if (data?.user?.profilePicture) {
      data.user.profilePicture = normalizeProfilePicture(data.user.profilePicture);
    }
    dispatch({ type: "getUserDataSuccess", payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: "getUserDataFail",
      payload: error.message || "Failed to get user data",
    });
    throw error;
  }
};

//Update profile action
export const updateProfile =
  (name, email, password, address, city, country, phone) =>
  async (dispatch) => {
    try {
      dispatch({ type: "updateProfileRequest" });
      const data = await api(
        "/user/update-profile",
        {
          name,
          email,
          password,
          address,
          city,
          country,
          phone,
        },
        "PUT",
      );

      if (data?.user?.profilePicture) {
        data.user.profilePicture = normalizeProfilePicture(data.user.profilePicture);
      }

      dispatch({ type: "updateProfileSuccess", payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: "updateProfileFail",
        payload: error.message || "Profile update failed",
      });
      throw error;
    }
  };

//Update profile picture action
export const updateProfilePicture =
  (uri, fileName, mimeType) => async (dispatch) => {
    try {
      dispatch({ type: "updateProfilePictureRequest" });

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: fileName || `profile-picture-${Date.now()}.jpg`,
        type: mimeType || "image/jpeg",
      });

    const data = await api("/user/update-profile-picture", formData, "PUT");
    if (data?.profilePicture) {
      data.profilePicture = normalizeProfilePicture(data.profilePicture);
    }
    dispatch({ type: "updateProfilePictureSuccess", payload: data });
    await dispatch(getUserData());
    return data;
    } catch (error) {
      dispatch({
        type: "updateProfilePictureFail",
        payload: error.message || "Profile picture update failed",
      });
      throw error;
    }
  };

//Delete profile picture action
export const deleteProfilePicture = () => async (dispatch) => {
  try {
    dispatch({ type: "deleteProfilePictureRequest" });
    const data = await api("/user/delete-profile-picture", null, "DELETE");
    dispatch({ type: "deleteProfilePictureSuccess", payload: data });
    await dispatch(getUserData());
    return data;
  } catch (error) {
    dispatch({
      type: "deleteProfilePictureFail",
      payload: error.message || "Profile picture delete failed",
    });
    throw error;
  }
};

//Logout Action
export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: "logoutRequest" });
    const data = await api("/user/logout", null, "POST");
    dispatch({ type: "logoutSuccess", payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: "logoutFail",
      payload: error.message || "Logout failed",
    });
    throw error;
  }
};
