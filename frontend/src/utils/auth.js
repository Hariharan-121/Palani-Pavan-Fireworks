export const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user && user.isAdmin;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
