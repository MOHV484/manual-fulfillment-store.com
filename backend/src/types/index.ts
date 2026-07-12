// These mirror the CHECK constraints / enums we will define in the DB
// migration in Step 2. Keeping them here gives us compile-time safety
// and a single source of truth for the backend code.

export type UserRole = "client" | "moderator" | "super_admin";
export type UserStatus = "active" | "suspended";

export type OrderStatus = "pending" | "processing" | "completed" | "rejected";

export type ProductCategory =
  | "gaming_charge"
  | "account_security"
  | "digital_cards";

export type AuditActionType =
  | "order_approve"
  | "order_reject"
  | "order_claim"
  | "balance_modify";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

// Augment Express's Request type so `req.user` is typed everywhere
// once the auth middleware (Step 3) attaches it.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
