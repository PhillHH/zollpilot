'use client';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  return (
    <button onClick={() => signOut()} style={{ padding: '5px 10px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
      Client Logout
    </button>
  );
}
