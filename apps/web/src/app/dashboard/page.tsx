import { auth, signOut } from '@/auth';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <h3>Session Info</h3>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <p><strong>User:</strong> {session?.user?.email}</p>
        <p><strong>Tenant ID:</strong> {session?.user?.tenantId}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <form action={async () => {
          'use server';
          await signOut();
        }}>
          <button type="submit" style={{ padding: '5px 10px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Server Logout
          </button>
        </form>

        <LogoutButton />
      </div>
    </div>
  );
}
