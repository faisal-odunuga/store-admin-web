'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useAuthMe } from './useAuthMe';

/**
 * Unified Auth Hook
 * Coordinates between Clerk (frontend auth) and our backend (database session).
 * Ensures backend data is only fetched when Clerk is ready.
 */
export const useAuth = () => {
  const { isLoaded: isClerkLoaded, user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // Only enable backend fetch when Clerk has finished loading and we have a user
  const {
    data: me,
    isLoading: isMeLoading,
    isError,
    error,
    refetch,
  } = useAuthMe({
    enabled: !!isClerkLoaded && !!clerkUser,
  });

  const isLoading = !isClerkLoaded || (isSignedIn && isMeLoading);

  return {
    // Clerk State
    clerkUser,
    isClerkLoaded,
    isSignedIn,

    // Backend State
    me,
    isMeLoading,
    isError,
    error,

    // Derived State
    isLoading,
    isAdmin: me?.role?.toUpperCase() === 'ADMIN',

    // Actions
    signOut,
    refetchMe: refetch,
  };
};
