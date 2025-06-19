import { clerkClient } from '@clerk/clerk-sdk-node';

export const setUserRole = async (userId: string, role: 'subscriber_basic' | 'subscriber_pro' | 'clinic_admin' | 'dietitian_team_member' | 'admin' | 'superadmin') => {
  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role: role
      }
    });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

export const getUserRole = (user: any): string | null => {
  return user?.publicMetadata?.role as string || null;
}; 