'use client';

import { AuthProvider } from './AuthContext';

export default function ClientAuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
