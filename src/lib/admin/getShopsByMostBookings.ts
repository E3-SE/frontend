//broken, unused
import { apiBaseUrl } from "../config";

type ReservationRecord = {
    massage?: string;
};

type ReservationsResponse = {
    data?: ReservationRecord[];
};

async function getShopsByMostBookings(limit: number = 3, token: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/v1/reservations`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch reservations. Ensure you have Admin privileges.");
        }

        const json = (await response.json()) as ReservationsResponse;
        const reservations = Array.isArray(json.data) ? json.data : [];

        // Count bookings per shop ID
        const bookingCounts: Record<string, number> = {};
        reservations.forEach((reservation) => {
            const massageId = reservation.massage;

            if (!massageId) {
                return;
            }

            bookingCounts[massageId] = (bookingCounts[massageId] || 0) + 1;
        });

        // Sort shop IDs by the highest count
        const sortedShopIds = Object.keys(bookingCounts).sort(
            (a, b) => bookingCounts[b] - bookingCounts[a]
        );

        return sortedShopIds.slice(0, limit).map((id) => ({
            shopId: id,
            bookings: bookingCounts[id]
        }));
    } catch (error) {
        console.error("Error calculating top performing shops:", error);
        return [];
    }
}

export default getShopsByMostBookings;