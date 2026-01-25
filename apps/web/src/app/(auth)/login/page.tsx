import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <LoginForm />
    </div>
  );
}
