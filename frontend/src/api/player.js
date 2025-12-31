// frontend/src/api/player.js

const BASE_URL = "http://localhost:5000/api/player";

/**
 * Logs in a player
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} API response
 */
export async function loginPlayer(username, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return data; // contains token, user info, etc.
  } catch (error) {
    throw error;
  }
}
