'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function GoogleAuthButton() {
  const googleLoginMutation = useGoogleLoginMutation();

  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            googleLoginMutation.mutate(credentialResponse.credential);
          }
        }}
        onError={() => {
          toast.error('Google Sign-In failed.');
        }}
        shape="pill"
        size="large"
        width="100%"
        logo_alignment="center"
        text="continue_with"
      />
    </div>
  );
}
