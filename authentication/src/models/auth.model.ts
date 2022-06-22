export interface IUser {
    id: number;

    firstname: string;
    lastname: string;
    mail: string;
    phone: string;
    password: string;
    roleId: number;

    thumbnail: string;
    city: string;
    cityCode: number;
    address: string;
    sponsorId: number;

    token: string;
    refreshToken: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}