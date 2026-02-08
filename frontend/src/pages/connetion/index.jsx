import DashboardContent from '@/dashbord'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Index from '@/layout/UserLayout'
import { BACKEND_URL } from '@/config';
import {
  getMyConnectedRequests,
  getMyAcceptedConnections,
  respondConnection,
  getAllUsers
} from '@/config/redux/action/authAction';

function Connection() {
  const dispatch = useDispatch();

  const { user, connectionRequests, connections, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getMyConnectedRequests(user._id));   // pending
      dispatch(getMyAcceptedConnections(user._id)); // accepted
    }
  }, [dispatch, user]);

  const handleResponse = (connectionId, status) => {
    dispatch(respondConnection({ connectionId, status }))
      .then(() => {
        // refresh lists after responding
        dispatch(getMyConnectedRequests(user._id));
        dispatch(getMyAcceptedConnections(user._id));
      });
  };

  // Only show pending requests where current user is the receiver
  const pendingRequests = connectionRequests?.filter(
    c => c.status === "pending" && c.connectId._id === user._id
  ) || [];

  // Accepted connections
  const acceptedConnections = connections?.filter(c => c.status === "accepted") || [];

  return (
    <Index>
      <DashboardContent>
        <div style={{ padding: "20px" }}>

          {/* Pending requests */}
          <h2>Connection Requests</h2>

          {loading ? (
            <p>Loading...</p>
          ) : pendingRequests.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            pendingRequests.map((conn) => {
              const otherUser = conn.userId; // sender of the request

              return (
                <div key={conn._id} style={cardStyle}>
                  <UserInfo user={otherUser} />

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleResponse(conn._id, "accepted")}
                      style={acceptBtn}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleResponse(conn._id, "rejected")}
                      style={rejectBtn}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Accepted connections */}
          <h2 style={{ marginTop: "40px" }}>My Network</h2>

          {acceptedConnections.length === 0 ? (
            <p>No connections yet.</p>
          ) : (
            acceptedConnections.map((conn) => {
              const otherUser = conn.userId._id === user._id ? conn.connectId : conn.userId;

              return (
                <div key={conn._id} style={cardStyle}>
                  <UserInfo user={otherUser} />
                   <button
                      onClick={() => handleResponse(conn._id, "rejected")}
                      style={rejectBtn}
                    >
                      Reject
                    </button>
                </div>
              );
            })
          )}
        </div>
      </DashboardContent>
    </Index>
  );
}

export default Connection;
const cardStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "6px",
  display: "flex",
  flexDirection: "row",       // row by default
  flexWrap: "wrap",           // allow content to wrap on small screens
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  width: "100%",
   maxWidth: "600px",
  boxSizing: "border-box",    // include padding in width
  wordBreak: "break-word",    // break long words
  overflowWrap: "break-word", // break long words/emails
  //  marginLeft: "auto",      // center on large screens
  // marginRight: "auto",
};



const acceptBtn = {
  background: "#0a66c2",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

function UserInfo({ user }) {
   if (!user) return null;
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", 
         flex: "1 1 200px", // allow it to shrink/grow
        minWidth: 0,   }}>
    <img
  src={
    user.ProfileImage
      ? user.ProfileImage.startsWith("http")
        ? user.ProfileImage
        : `${BACKEND_URL}${user.ProfileImage}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.Name)}&background=random&color=fff`
  }

        width={50}
        height={50}
        style={{ borderRadius: "50%" ,flexShrink: 0 }}
      />

      <div>
        <h4 style={{ margin: 0 }}>{user.Name}</h4>
        <p style={{ margin: 0, color: "#666" }}>{user.Email}</p>
      </div>
    </div>
  );
}
