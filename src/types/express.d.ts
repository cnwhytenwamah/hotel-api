declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        email: string;
        accountType: "guest" | "staff";
      };
    }
  }
}

export {};
