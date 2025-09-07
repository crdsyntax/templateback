import { UserRole } from "../../users/enums/user-role.enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        roles: UserRole[];
      };
    }
  }
}
