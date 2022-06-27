import { Roles } from "@grp-2-projet-elective/cesieats-helpers";

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface TokenData {
    id: number;
    mail: string;
    role: Roles;

    restaurantId?: number;
}