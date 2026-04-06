import { getMyBookingByIdAction } from "@/actions/booking-actions";
import { BookingDetailView } from "@/components/client/booking-detail-view";
import { DemoBookingDetail } from "@/components/client/demo-booking-detail";
import { isUuid } from "@/lib/is-uuid";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;

  if (isUuid(id)) {
    const booking = await getMyBookingByIdAction(id);
    if (booking) {
      return <BookingDetailView booking={booking} source="database" />;
    }
  }

  return <DemoBookingDetail id={id} />;
}
