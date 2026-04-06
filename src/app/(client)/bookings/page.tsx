import { BookingsMergedList } from "@/components/client/bookings-merged-list";
import { listMyBookingsAction } from "@/actions/booking-actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Bookings | Palm Concierge" };

export default async function BookingsPage() {
  const dbBookings = await listMyBookingsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="pom-display text-pom-3xl text-foreground">Your bookings</h1>
        <p className="mt-2 text-pom-sm text-muted-foreground">
          Account bookings sync when Supabase is configured. Demo requests stay in this browser&apos;s session
          storage.
        </p>
      </div>
      <BookingsMergedList dbBookings={dbBookings} />
    </div>
  );
}
