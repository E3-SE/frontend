import { apiBaseUrl } from "./config";

async function getTopRatedShops(id: string) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/massages/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching shop with ID ${id}:`, error);
        return null;
    }
}

export default getTopRatedShops;