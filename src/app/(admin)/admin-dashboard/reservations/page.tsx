import { revalidatePath } from "next/cache";
import {
	deleteAdminReservation,
	getAdminReservations,
	updateAdminReservationDate,
} from "@/src/lib/admin/adminApi";
import requireAdminAuth from "@/src/lib/admin/requireAdminAuth";
import ReservationsListClient from "./_components/reservationsListClient";

export default async function ManageReservationsPage() {

	const { session } = await requireAdminAuth();
	const token = session?.user?.token as string;
	const reservationsResponse = await getAdminReservations(token).catch(() => ({
		success: false,
		count: 0,
		totalCount: 0,
		pagination: undefined,
		data: [],
	}));

	const hasNextPage = Boolean(reservationsResponse.pagination?.next);

	async function updateReservationAction(formData: FormData) {
		"use server";

		const { session: actionSession } = await requireAdminAuth();
		const actionToken = actionSession?.user?.token as string;
		const reservationId = String(formData.get("reservationId") ?? "").trim();
		const reserveDate = String(formData.get("reserveDate") ?? "").trim();

		if (!reservationId || !reserveDate) {
			return;
		}

		await updateAdminReservationDate(
			actionToken,
			reservationId,
			new Date(reserveDate).toISOString(),
		);
		revalidatePath("/admin-dashboard/reservations");
	}

	async function deleteReservationAction(formData: FormData) {
		"use server";

		const { session: actionSession } = await requireAdminAuth();
		const actionToken = actionSession?.user?.token as string;
		const reservationId = String(formData.get("reservationId") ?? "").trim();

		if (!reservationId) {
			return;
		}

		await deleteAdminReservation(actionToken, reservationId);
		revalidatePath("/admin-dashboard/reservations");
	}

	return (
		<ReservationsListClient
			reservations={reservationsResponse.data}
			totalCount={reservationsResponse.count}
			hasNextPage={hasNextPage}
			updateReservationAction={updateReservationAction}
			deleteReservationAction={deleteReservationAction}
		/>
	);
}
