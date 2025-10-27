export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
}

export interface UserCardProps {
    user: User;
}

export interface UserListProps {
    refreshKey?: number;
}
