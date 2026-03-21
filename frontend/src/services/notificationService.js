import axios from "axios";

const API_URL = "https://ecommerce-backend-ol0h.onrender.com/api/notifications";


export const getNotifications = async (token) => {

    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};