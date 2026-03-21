import React from "react";

const ProfileSection = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-card">
      <h2>My Profile</h2>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </>
      ) : (
        <p>User not logged in.</p>
      )}
    </div>
  );
};

export default ProfileSection;