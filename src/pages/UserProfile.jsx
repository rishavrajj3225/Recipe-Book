import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/userProfile.css"; // Assuming you have a CSS file for styling
import defalutProfileImg from "../../public/assets/logo.jpg"; // Default profile image

function UserProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [recipes, setRecipes] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const userId = currentUser.data.data.user._id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${userId}`);
        setUserDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `/api/v1/recipe/userRecipes/${userId}`
        );
        setRecipes(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipes();
  }, [userId]);

  return (
    <div className="user-profile-container">
      {userDetails ? (
        <div className="profile-card">
          <img
            src={defalutProfileImg || "/default-profile.png"}
            className="profile-image"
          />
          <div className="profile-details">
            <h2>{userDetails.username}</h2>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(userDetails.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Recipes Created:</strong> {recipes.length}
            </p>
          </div>
        </div>
      ) : (
        <p className="loading">Loading user details...</p>
      )}
    </div>
  );
}

export default UserProfile;
