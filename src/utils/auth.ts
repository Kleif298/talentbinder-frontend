interface UserData {
  id: number;
  email: string;
  role: string;
  isAdmin: boolean;
}

export function getUserData(): UserData | null {
  const userStr = sessionStorage.getItem('user');
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
    // Bereite User-Daten mit Admin-Status vor
    const userData: UserData = {
      id: data.account.id,
      email: data.account.email,
      role: data.account.role,
      isAdmin: data.account.role === 'berufsbilder' // In diesem Fall ist jeder Berufsbilder auch Admin
    };
    // Speichere User-Daten für Frontend-Status
    sessionStorage.setItem('user', JSON.stringify(userData));
  }
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