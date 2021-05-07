import { Role } from "./role.model";

export class User {
    firstName: string;
    lastName: string;
    jobProfile: string;
    userType: Role;
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
}