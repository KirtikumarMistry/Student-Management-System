const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);

  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Payload:", payload);
    return payload && payload.exp > Date.now() / 1000; // Check token expiration
  } catch (e) {
    console.error("Invalid token:", e);
    return false;
  }
};

export default isAuthenticated;
