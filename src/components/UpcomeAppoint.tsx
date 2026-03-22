import BookCard from "./BookCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/authOptions";
import getReservation from "@/src/lib/getReservation";

export default async function UpcomeAppoint() {

    const session = await getServerSession(authOptions);
    // if (!session || !session.user.token) return null;

    // Simulate fetching with the token
    const token = session?.user?.token || "mock_token";
    const reservations = await getReservation(token as string);

    const now = new Date();
    const upcomingReservations = reservations.data.filter(app => new Date(app.reserveDate) >= now);

    console.log(reservations);

    return (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex items-center gap-6">
                <h2 className="font-headline text-[30px] leading-[36px] text-foreground">
                    Upcoming Appointments
                </h2>
                <div className="flex px-4 py-1 bg-secondary-container rounded-full items-center justify-center">
                    <span className="font-bold text-xs uppercase tracking-[1.2px] text-on-secondary-container">
                        {upcomingReservations.length}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full">
                {upcomingReservations.map((appointment) => {
                    const massageName = typeof appointment.massage === 'object' ? appointment.massage.name : "Unknown Massage";
                    const imageSrc = typeof appointment.massage === 'object' && appointment.massage.pictures && appointment.massage.pictures.length > 0 
                        ? appointment.massage.pictures[0] 
                        : "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop";

                    const d = new Date(appointment.reserveDate);
                    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                    return (
                        <BookCard
                            key={appointment._id}
                            id={appointment._id}
                            token={token as string}
                            reserveDate={appointment.reserveDate}
                            title={massageName}
                            imageSrc={imageSrc}
                            date={formattedDate}
                            time={time}
                        />
                    );
                })}
                {upcomingReservations.length === 0 && (
                    <p className="text-secondary">No upcoming appointments found.</p>
                )}
            </div>
        </div>
    );
}