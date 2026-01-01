import api from "./API";

export const startSession = async () => {
  const res = await api.post("/game/start");

  const sessionId = res?.data?.sessionId ?? null;

  if (!sessionId) {
    throw new Error("Failed to start session: missing sessionId in response");
  }

  return sessionId;
};


export const logRound = async (payload) => {
  return api.post("/game/log-round", payload);
};

export const endSession = async (sessionId) => {
  return api.post("/game/end", { sessionId });
};

export const getSessionEntryState = async () => {
  const res = await api.get("/game/session-entry");
  return res.data.data;
};