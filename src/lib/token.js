import Cookies from "js-cookie";

export const USER_DETAILS_KEY = "user_details";

export const getStoredUser = () => {
  try { return JSON.parse(Cookies.get(USER_DETAILS_KEY) ?? "null"); }
  catch { return null; }
};

export const isAuthenticated = () => !!Cookies.get("userid");

export const saveTokens = (user) => {
  const opts = { expires: 7, sameSite: "lax" };
  Cookies.set("userid", user?.user_id || user?._id || "", opts);
  
  const { password, ...safeUser } = user ?? {};
  Cookies.set(USER_DETAILS_KEY, JSON.stringify(safeUser), opts);
};

export const clearTokens = () => {
  Cookies.remove("userid");
  Cookies.remove(USER_DETAILS_KEY);
  Cookies.remove("session_id"); // Clear backend session cookie too if possible
};
