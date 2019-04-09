interface User {
    uid: string;
    email: string;
    firstName?: string;
    lastName?: string;
    birthday?: Date;
    phone?: string;
    photoURL?: string;
    role?: Roles;
}

interface Roles {
    subscriber?: boolean;
    admin?: boolean;
}

