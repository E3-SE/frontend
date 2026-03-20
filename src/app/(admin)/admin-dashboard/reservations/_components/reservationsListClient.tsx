"use client";

import { useMemo, useState } from "react";
import type { AdminReservation } from "@/src/lib/admin/adminApi";

type ReservationsListClientProps = {
	reservations: AdminReservation[];
	totalCount: number;
	hasNextPage: boolean;
	updateReservationAction: (formData: FormData) => void | Promise<void>;
	deleteReservationAction: (formData: FormData) => void | Promise<void>;
};

function toDatetimeLocal(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const pad = (number: number) => String(number).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate(),
	)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getUserMeta(value: string | { name?: string; email?: string; tel?: string }) {
	if (typeof value === "string") {
		return { name: value, email: "-", tel: "-" };
	}

	return {
		name: value.name ?? value.email ?? "-",
		email: value.email ?? "-",
		tel: value.tel ?? "-",
	};
}

function getMassageMeta(value: string | { name?: string; province?: string; tel?: string }) {
	if (typeof value === "string") {
		return { name: value, province: "-", tel: "-" };
	}

	return {
		name: value.name ?? "-",
		province: value.province ?? "-",
		tel: value.tel ?? "-",
	};
}

function getStatus(reserveDate: string, isRated?: boolean) {
	if (isRated) {
		return {
			label: "Completed",
			className:
				"inline-flex items-center rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold text-on-tertiary-fixed",
		};
	}

	const date = new Date(reserveDate);
	if (!Number.isNaN(date.getTime()) && date.getTime() < Date.now()) {
		return {
			label: "Past",
			className:
				"inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container",
		};
	}

	return {
		label: "Upcoming",
		className:
			"inline-flex items-center rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed",
	};
}

function getDateKey(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return date.toISOString().slice(0, 10);
}

export default function ReservationsListClient({
	reservations,
	totalCount,
	hasNextPage,
	updateReservationAction,
	deleteReservationAction,
}: ReservationsListClientProps) {
	const [shopFilter, setShopFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("");
	const [sortBy, setSortBy] = useState("date-desc");

	const shopOptions = useMemo(
		() =>
			Array.from(
				new Set(
					reservations
						.map((reservation) => getMassageMeta(reservation.massage).name)
						.filter((name) => name !== "-"),
				),
			).sort((a, b) => a.localeCompare(b)),
		[reservations],
	);

	const filteredReservations = useMemo(
		() =>
			reservations
				.filter((reservation) => {
					const massageMeta = getMassageMeta(reservation.massage);
					const status = getStatus(
						reservation.reserveDate,
						reservation.isRated,
					).label;

					if (shopFilter && massageMeta.name !== shopFilter) {
						return false;
					}

					if (statusFilter !== "all") {
						if (statusFilter === "completed" && status !== "Completed") {
							return false;
						}
						if (statusFilter === "upcoming" && status !== "Upcoming") {
							return false;
						}
						if (statusFilter === "past" && status !== "Past") {
							return false;
						}
					}

					if (dateFilter && getDateKey(reservation.reserveDate) !== dateFilter) {
						return false;
					}

					return true;
				})
				.sort((first, second) => {
					const firstReserve = new Date(first.reserveDate).getTime();
					const secondReserve = new Date(second.reserveDate).getTime();

					if (sortBy === "date-asc") {
						return firstReserve - secondReserve;
					}

					if (sortBy === "created-asc") {
						const firstCreated = new Date(first.createdAt ?? 0).getTime();
						const secondCreated = new Date(second.createdAt ?? 0).getTime();
						return firstCreated - secondCreated;
					}

					if (sortBy === "created-desc") {
						const firstCreated = new Date(first.createdAt ?? 0).getTime();
						const secondCreated = new Date(second.createdAt ?? 0).getTime();
						return secondCreated - firstCreated;
					}

					return secondReserve - firstReserve;
				}),
		[dateFilter, reservations, shopFilter, sortBy, statusFilter],
	);

	const handleReset = () => {
		setShopFilter("");
		setStatusFilter("all");
		setDateFilter("");
		setSortBy("date-desc");
	};

	return (
		<div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-10">
			<div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="font-headline text-4xl leading-tight text-on-surface">
						All Reservations
					</h2>
					<p className="mt-2 max-w-lg text-on-surface-variant">
						Monitor and manage sanctuary appointments across all shop locations.
					</p>
				</div>
				<div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
					{filteredReservations.length} of {totalCount} shown
				</div>
			</div>

			<div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-surface-container-low p-4 md:grid-cols-4">
				<select
					value={shopFilter}
					onChange={(event) => setShopFilter(event.target.value)}
					className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
				>
					<option value="">All shops</option>
					{shopOptions.map((shopName) => (
						<option key={shopName} value={shopName}>
							{shopName}
						</option>
					))}
				</select>

				<select
					value={statusFilter}
					onChange={(event) => setStatusFilter(event.target.value)}
					className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
				>
					<option value="all">All status</option>
					<option value="upcoming">Upcoming</option>
					<option value="past">Past</option>
					<option value="completed">Completed</option>
				</select>

				<input
					type="date"
					value={dateFilter}
					onChange={(event) => setDateFilter(event.target.value)}
					className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
				/>

				<select
					value={sortBy}
					onChange={(event) => setSortBy(event.target.value)}
					className="rounded-xl border border-outline-variant/20 bg-surface px-3 py-2 text-sm text-on-surface"
				>
					<option value="date-desc">Date (newest)</option>
					<option value="date-asc">Date (oldest)</option>
					<option value="created-desc">Created (newest)</option>
					<option value="created-asc">Created (oldest)</option>
				</select>

				<div className="md:col-span-4 flex items-center justify-end gap-2">
					<button
						type="button"
						onClick={handleReset}
						className="rounded-full border border-outline-variant/30 px-4 py-2 text-sm text-on-surface-variant"
					>
						Reset
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6">
				{filteredReservations.map((reservation) => {
					const editId = `edit-reservation-${reservation._id}`;
					const userMeta = getUserMeta(reservation.user);
					const massageMeta = getMassageMeta(reservation.massage);
					const reserveDate = new Date(reservation.reserveDate);
					const status = getStatus(reservation.reserveDate, reservation.isRated);

					return (
						<div
							key={reservation._id}
							className="group flex flex-col gap-6 rounded-4xl border border-outline-variant/5 bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md xl:flex-row xl:items-center xl:gap-10"
						>
							<div className="shrink-0 rounded-2xl bg-primary-fixed px-4 py-3 text-center text-primary xl:w-20">
								<p className="text-xs font-bold uppercase tracking-tighter">
									{Number.isNaN(reserveDate.getTime())
										? "---"
										: reserveDate.toLocaleDateString(undefined, {
												month: "short",
										  })}
								</p>
								<p className="font-headline text-3xl">
									{Number.isNaN(reserveDate.getTime())
										? "--"
										: reserveDate.getDate()}
								</p>
							</div>

							<div className="grid grow grid-cols-1 gap-6 xl:grid-cols-12 xl:items-center xl:gap-8">
								<div className="xl:col-span-3">
									<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
										Guest
									</p>
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-container">
											<img
												src={`https://img.rachatat.com/insecure/plain/https://api.dicebear.com/9.x/lorelei/svg%3Fseed=${userMeta.name.split(" ")[0]}`}
												alt="User avatar"
												className="h-10 w-10 rounded-full object-cover"
											/>
										</div>
										<div>
											<p className="font-semibold text-on-surface">{userMeta.name}</p>
											<p className="text-xs text-on-surface-variant">
												{userMeta.email} · {userMeta.tel}
											</p>
										</div>
									</div>
								</div>

								<div className="lg:col-span-3">
									<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
										Location
									</p>
									<p className="text-sm font-medium text-on-surface">
										{massageMeta.name}
									</p>
									<p className="text-xs text-on-surface-variant">
										{massageMeta.province} · {massageMeta.tel}
									</p>
								</div>

								<div className="lg:col-span-2">
									<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
										Status
									</p>
									<span className={status.className}>{status.label}</span>
								</div>

								<div className="lg:col-span-2">
									<p className="mb-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
										Feedback
									</p>
									<p className="text-sm text-on-surface">
										{reservation.isRated
											? `${reservation.rating ?? "-"}/5`
											: "Not rated"}
									</p>
									<p className="text-xs text-on-surface-variant">
										{Number.isNaN(reserveDate.getTime())
											? "Invalid date"
											: reserveDate.toLocaleString()}
									</p>
								</div>

								<div className="lg:col-span-2 lg:flex lg:justify-end">
									<div className="flex items-center gap-2">
										<input id={editId} type="checkbox" className="peer hidden" />
										<label
											htmlFor={editId}
											className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
										>
											Update
										</label>

										<details className="relative">
											<summary className="cursor-pointer list-none rounded-full border border-error px-4 py-2 text-sm font-semibold text-error hover:bg-error hover:text-on-error">
												Delete
											</summary>
											<div className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-outline-variant/30 bg-surface-container p-3 shadow-sm">
												<p className="text-xs text-on-surface">
													Delete this reservation permanently?
												</p>
												<div className="mt-3 flex justify-end">
													<form action={deleteReservationAction}>
														<input
															type="hidden"
															name="reservationId"
															value={reservation._id}
														/>
														<button
															type="submit"
															className="rounded-full bg-error px-3 py-1.5 text-xs font-semibold text-on-error"
														>
															Confirm
														</button>
													</form>
												</div>
											</div>
										</details>

										<div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100">
											<div className="w-full max-w-xl rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
												<div className="mb-4 flex items-center justify-between">
													<h5 className="font-headline text-xl text-on-surface">
														Edit Reservation
													</h5>
													<label
														htmlFor={editId}
														className="cursor-pointer rounded-full border border-outline-variant/30 px-3 py-1 text-xs text-on-surface-variant"
													>
														Close
													</label>
												</div>

												<div className="mb-4 rounded-xl bg-surface p-3 text-sm text-on-surface-variant">
													<p className="font-medium text-on-surface">{massageMeta.name}</p>
													<p>User: {userMeta.name}</p>
												</div>

												<form action={updateReservationAction} className="space-y-4">
													<input
														type="hidden"
														name="reservationId"
														value={reservation._id}
													/>
													<input
														type="datetime-local"
														name="reserveDate"
														defaultValue={toDatetimeLocal(reservation.reserveDate)}
														className="w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm"
														required
													/>
													<div className="flex justify-end gap-2">
														<label
															htmlFor={editId}
															className="cursor-pointer rounded-full border border-outline-variant/30 px-5 py-2 text-sm text-on-surface-variant"
														>
															Cancel
														</label>
														<button
															type="submit"
															className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:opacity-90"
														>
															Save
														</button>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{filteredReservations.length === 0 && (
				<div className="mt-6 rounded-xl bg-surface p-6 text-center text-sm text-on-surface-variant">
					No reservations found for the selected filters.
				</div>
			)}

			{hasNextPage && (
				<div className="mt-6 rounded-xl bg-surface p-4 text-sm text-on-surface-variant">
					More reservations are available on the next page.
				</div>
			)}
		</div>
	);
}
