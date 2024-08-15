'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect } from 'react';
import { createOrUpdateUser } from '../utils/userManagement';

export default function UserInitializer() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      createOrUpdateUser(user);
    }
  }, [user]);

  return null;
}
