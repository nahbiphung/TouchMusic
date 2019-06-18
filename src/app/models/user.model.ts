interface User {
    uid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    birthday?: Date;
    phone?: string;
    photoURL?: string;
    role?: Roles;
}

interface Roles {
    subscriber?: boolean;
    admin?: boolean;
}

interface FavoriteList {
    id: string;
    image: string;
    name: string;
    userId: string;
    details: [];
}

