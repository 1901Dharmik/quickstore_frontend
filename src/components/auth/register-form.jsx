'use client';

import { useState } from 'react';
import { useRegister } from '@/hooks/use-auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const registerMutation = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    registerMutation.mutate({ name, email, password });
  };

  const field = (id, label, type, value, onChange, autoComplete, placeholder, showToggle, show, setShow) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showToggle ? (show ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          required
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={registerMutation.isPending}
          className="w-full border border-border bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-50"
          style={showToggle ? { paddingRight: '2.75rem' } : {}}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            disabled={registerMutation.isPending}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {field('name', 'Full name', 'text', name, setName, 'name', 'John Doe')}
      {field('email', 'Email address', 'email', email, setEmail, 'email', 'you@example.com')}
      {field('password', 'Password', 'password', password, setPassword, 'new-password', '••••••••', true, showPassword, setShowPassword)}
      {field('confirm-password', 'Confirm password', 'password', confirmPassword, setConfirmPassword, 'new-password', '••••••••', true, showConfirm, setShowConfirm)}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full bg-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {registerMutation.isPending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center font-mono text-[11px] text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-60">
          Sign in
        </Link>
      </p>
    </form>
  );
}
