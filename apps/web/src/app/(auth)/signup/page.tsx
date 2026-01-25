import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <SignupForm />
    </div>
  );
}
