import { createSlice } from "@reduxjs/toolkit";
import { loginUser,registerUser,getUserProfile ,getAllUsers} from "../../action/authAction"; 
import{ sendConnectionRequest,
  getMyConnectedRequests,
  getMyAcceptedConnections,
  respondConnection,updateUserProfile,updateProfileData,googleLoginUser}from "../../action/authAction"; 

const authFromStorage =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

const initialState = {
  user: authFromStorage?.user || null,
  isAuthenticated: authFromStorage?.isAuthenticated || false,
  loading: false,
   usersLoading: false,     // all users
     
   profile: null,
   users: [], 
    connections: [],          // accepted connections
  connectionRequests: [], 
  error: null,
   success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    logout: (state) => {
  state.user = null;
  state.isAuthenticated = false;
   if (typeof window !== "undefined") {
  localStorage.removeItem("auth");
   }
},

  },
  extraReducers: (builder) => {
    //logic mate
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
         state.error = null;      
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user || action.payload; // depending on backend response
  state.isAuthenticated = true;
  state.success = action.payload.message || "Logged in successfully";

  //  Save to localStorage correctly
  localStorage.setItem(
    "auth",
    JSON.stringify({ isAuthenticated: true, user: state.user })
  );
})

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
          state.error = action.payload || "Login failed";
   
      });

  //signup
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
         state.error = null;
        state.success = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
         state.user = action.payload.user || action.payload;
        state.isAuthenticated = true; // optional: auto login after signup
           state.success = action.payload.message; 
      
       localStorage.setItem(
          "auth",
          JSON.stringify({ isAuthenticated: true, user: state.user })
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
         // 👤 GET USER PROFILE
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
  
.addCase(getUserProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.profile = action.payload.userProfile;
//   state.user = action.payload.userProfile.userId;
//    const auth = JSON.parse(localStorage.getItem("auth"));
//       localStorage.setItem(
//         "auth",
//         JSON.stringify({
//           ...auth,
//           user: state.user,
//         })
//       );
 })



      
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


  

 // UPDATE PROFILE
    .addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;

      const auth = JSON.parse(localStorage.getItem("auth"));
      localStorage.setItem(
        "auth",
        JSON.stringify({
          ...auth,
          user: action.payload,
        })
      );
    })
    .addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

// 🔹 UPDATE PROFILE DATA (bio, work, education)
.addCase(updateProfileData.pending, (state) => {
  state.loading = true;
})
.addCase(updateProfileData.fulfilled, (state, action) => {
  state.loading = false;
  state.profile = action.payload; // update profile in redux
})
.addCase(updateProfileData.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


      // 👥 GET ALL USERS



builder
  .addCase(getAllUsers.pending, (state) => {
  state.usersLoading = true;
})
.addCase(getAllUsers.fulfilled, (state, action) => {
  state.usersLoading = false;
  state.users = action.payload;
})
.addCase(getAllUsers.rejected, (state, action) => {
  state.usersLoading = false;
  state.error = action.payload;
})

  
// 🔗 SEND CONNECTION REQUEST
builder
  .addCase(sendConnectionRequest.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(sendConnectionRequest.fulfilled, (state, action) => {
    state.loading = false;
    state.success = action.payload.message || "Request sent";
  })
  .addCase(sendConnectionRequest.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

// 📩 GET CONNECTION REQUESTS
builder
  .addCase(getMyConnectedRequests.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getMyConnectedRequests.fulfilled, (state, action) => {
  state.loading = false;
  state.connectionRequests = action.payload.connections || [];
})


  .addCase(getMyConnectedRequests.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

// 🤝 GET ACCEPTED CONNECTIONS
builder
  .addCase(getMyAcceptedConnections.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getMyAcceptedConnections.fulfilled, (state, action) => {
  state.loading = false;
  state.connections = action.payload.connections;
})

  .addCase(getMyAcceptedConnections.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  //goolge login 
  builder
  .addCase(googleLoginUser.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(googleLoginUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user || action.payload;
  state.isAuthenticated = true;

  localStorage.setItem(
    "auth",
    JSON.stringify({
      isAuthenticated: true,
      user: state.user,
    })
  );
})

.addCase(forgotPassword.pending, (state) => {
  state.loading = true;
})
.addCase(forgotPassword.fulfilled, (state, action) => {
  state.loading = false;
  state.success = action.payload.message;
})
.addCase(forgotPassword.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
.addCase(googleLoginUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

// ✅ RESPOND TO CONNECTION
builder
  .addCase(respondConnection.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(respondConnection.fulfilled, (state, action) => {
    state.loading = false;
    state.success = action.payload.message || "Response saved";
  })
  .addCase(respondConnection.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });

},
});

export const { clearMessages, logout } = authSlice.actions;
export default authSlice.reducer;

