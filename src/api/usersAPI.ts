const API_BASE_URL = "http://localhost:4000/api";

export const usersAPI = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/users`, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return response.json();
    },

    async delete(userId: number) {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to delete user");
        }
        return response.json();
    }
};
