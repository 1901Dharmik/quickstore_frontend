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
      <label htmlFor={id} className="mb-2 block font-sans text-[14px] text-black">
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
          className="h-12 w-full rounded-[12px] border border-[#e5e5e5] bg-white px-4 font-sans text-[14px] text-black placeholder:text-[#a3a3a3] focus:border-black focus:outline-none disabled:opacity-50 transition-colors"
          style={showToggle ? { paddingRight: '2.75rem' } : {}}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            disabled={registerMutation.isPending}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] transition-colors hover:text-black"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {field('name', 'Full name', 'text', name, setName, 'name', 'John Doe')}
      {field('email', 'Email address', 'email', email, setEmail, 'email', 'you@example.com')}
      {field('password', 'Password', 'password', password, setPassword, 'new-password', '••••••••', true, showPassword, setShowPassword)}
      {field('confirm-password', 'Confirm password', 'password', confirmPassword, setConfirmPassword, 'new-password', '••••••••', true, showConfirm, setShowConfirm)}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-black px-6 font-sans text-[14px] font-medium text-white transition-opacity hover:bg-[#090909] disabled:opacity-50"
      >
        {registerMutation.isPending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center font-sans text-[14px] text-[#737373]">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-black transition-opacity hover:opacity-70">
          Login
        </Link>
      </p>
    </form>
  );
}
