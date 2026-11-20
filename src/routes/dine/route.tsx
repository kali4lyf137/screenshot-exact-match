import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { CustomerShell } from "@/components/customer/CustomerShell";
import { Skeleton } from "@/components/ui/skeleton";
import { BasketProvider } from "@/hooks/use-basket";
import { useDining } from "@/hooks/use-dining";
import { categoriesQuery, menuItemsQuery, restaurantQuery, sessionQuery } from "@/integrations/meyo/queries";

export const Route = createFileRoute("/dine")({
  loader: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (!session) throw redirect({ to: "/" });
    await Promise.all([
      queryClient.ensureQueryData(restaurantQuery(session.restaurantSlug)),
      queryClient.ensureQueryData(categoriesQuery(session.restaurantId)),
      queryClient.ensureQueryData(menuItemsQuery(session.restaurantId)),
    ]);
  },
  pendingComponent: DinePending,
  component: DineLayout,
});

function DineLayout() {
  const { session, items } = useDining();
  return (
    <BasketProvider items={items} storageKey={`meyo-preview-basket:${session.sessionId}`}>
      <CustomerShell>
        <Outlet />
      </CustomerShell>
    </BasketProvider>
  );
}

function DinePending() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-6" aria-busy="true" aria-label="Loading restaurant">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
    </div>
  );
}
