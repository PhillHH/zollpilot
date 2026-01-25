'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/lib/schemas/auth';
import * as z from 'zod';
import { register } from '@/actions/register';
import { useState, useTransition } from 'react';
import Link from 'next/link';

export const SignupForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      register(values).then((data) => {
        if (data.error) setError(data.error);
        if (data.success) setSuccess(data.success);
      });
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <h2>Sign Up</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email">Email</label>
          <input {...form.register('email')} type="email" id="email" disabled={isPending} style={{ width: '100%', padding: '8px' }} />
          {form.formState.errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{form.formState.errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input {...form.register('password')} type="password" id="password" disabled={isPending} style={{ width: '100%', padding: '8px' }} />
          {form.formState.errors.password && <span style={{ color: 'red', fontSize: '0.8rem' }}>{form.formState.errors.password.message}</span>}
        </div>
        {error && <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffe6e6' }}>{error}</div>}
        {success && <div style={{ color: 'green', padding: '10px', backgroundColor: '#e6ffe6' }}>{success}</div>}
        <button type="submit" disabled={isPending} style={{ padding: '10px', cursor: 'pointer' }}>{isPending ? 'Creating account...' : 'Create Account'}</button>
      </form>
       <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <Link href="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};
