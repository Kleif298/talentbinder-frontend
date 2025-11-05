interface UserData {
  id: number;
  email: string;
  role: string;
  isAdmin: boolean;
}

export function getUserData(): UserData | null {
  const userStr = localStorage.getItem('user'); // ✅ Changed from sessionStorage
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Ungültige User-Daten:", error);
    return null;
  }
}

export function handleAuthResponse(data: any) {
  if (data.success && data.account) {
    const userData: UserData = {
      id: data.account.id,
      email: data.account.email,
      role: data.account.role,
      isAdmin: data.account.role === 'berufsbilder'
    };
    localStorage.setItem('user', JSON.stringify(userData)); // ✅ Changed from sessionStorage
  }
}

export function isOwnerOfEvent(eventCreatorId: number): boolean {
  const userData = getUserData();
  if (!userData) return false;
  
  if (userData.isAdmin) return true;
  
  return userData.id === eventCreatorId;
}

export function getAdminStatus(): boolean {
  const userData = getUserData();
  return userData?.isAdmin === true;
}

export function getAccountId(): number | null {
  const userData = getUserData();
  return userData?.id || null;
}

export function getAccountEmail(): string | null {
  const userData = getUserData();
  return userData?.email || null;
}

export function getAccountRole(): string | null {
  const userData = getUserData();
  return userData?.role || null;
}