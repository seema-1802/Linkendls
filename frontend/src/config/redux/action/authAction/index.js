import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";
import Swal from "sweetalert2";
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", userData);
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      return response.data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Login failed",
      });
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Login failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (Email, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/forgot-password",
        { Email }
      );

      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: response.data.message,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error
      );
    }
  }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
      try {
        const response = await clientServer.post("/signup", userData);
        Swal.fire({
    icon: "success",
    title: "Success",
    text: "Registration successful!",
    timer: 1500,
    showConfirmButton: false,
  });

        return response.data;
      } catch (error) {
         Swal.fire({
    icon: "error",
    title: "Error",
    text: error.response?.data?.error || "Registration failed",
  });
        return thunkAPI.rejectWithValue(
          error.response?.data?.error || "Registration failed"
        );
      }
    }
  );
export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (id, thunkAPI) => {
    try {
      const response = await clientServer.get(`/getUserProfile/${id}`);
     
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Failed to fetch user profile"
      );
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "connection/sendRequest",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/sendConnectedRequest",
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send connection request"
      );
    }
  }
);
export const getMyConnectedRequests = createAsyncThunk(
  "connection/getRequests",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/user/getMyConnectedRequests/${userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch connection requests"
      );
    }
  }
);
export const getMyAcceptedConnections = createAsyncThunk(
  "connection/getAccepted",
  async (userId, thunkAPI) => {
    try {
      const response = await clientServer.get(
        `/user/getMyAcceptedConnections/${userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch accepted connections"
      );
    }
  }
);
export const respondConnection = createAsyncThunk(
  "connection/respond",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/respondConnection",
        data
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to respond to connection"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await clientServer.post("/userUpdate", formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      return res.data.user;
    } catch (err) {

  console.log("FULL ERROR:", err.response?.data);

       Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Profile update failed",
      });
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Profile update failed"
      );
    }
  }
);

export const updateProfileData = createAsyncThunk(
  "auth/updateProfileData",
  async (data, thunkAPI) => {
    try {
      const res = await clientServer.post("/updateProfileData", data);
       Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile data updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      return res.data.profile;
    } catch (err) {
            Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Profile data update failed",
      });

      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Profile data update failed"
      );
    }
  }
);
export const googleLoginUser = createAsyncThunk(
  "auth/googleLoginUser",
  async (data, thunkAPI) => {
    try {
      const response = await clientServer.post("/google-login", data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Google Login Successful!",
        timer: 1500,
        showConfirmButton: false,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Google Login Failed"
      );
    }
  }
);
