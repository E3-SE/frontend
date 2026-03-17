//unused, need backend reimplemtn
import { apiBaseUrl } from "../config";

async function getLatestReservations(reservations: number, token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/reservations?sort=-createdAt&limit=${reservations}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${reservations} latest reservations:`, error);
        return null;
    }
}

export default getLatestReservations;