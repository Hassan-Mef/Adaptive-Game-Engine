import api from "./API";

export async function getLeaderboard() {
  const res = await api.get("/leaderboard");
  return res.data.data;
}
