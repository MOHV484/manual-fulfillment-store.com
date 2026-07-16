"use client";

import { useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import { playAlertBeep } from "./sound";

// Subscribes to Supabase Realtime so the admin queue reacts the instant a
// client submits a new order — no polling. Requires the
// "orders_select_own_or_staff" RLS policy (see migrations/002) so a
// moderator's own JWT is allowed to see the row at all.
export function useNewPendingOrderAlert(onNewPendingOrder: () => void) {
  const callbackRef = useRef(onNewPendingOrder);
  callbackRef.current = onNewPendingOrder;

  useEffect(() => {
    const channel = supabase
      .channel("orders-pending-watch")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          if ((payload.new as { status?: string }).status === "pending") {
            playAlertBeep();
            callbackRef.current();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
