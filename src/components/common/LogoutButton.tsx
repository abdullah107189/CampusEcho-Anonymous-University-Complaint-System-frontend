import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button } from '../ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useLogoutMutation } from '@/lib/api/authApi';

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    console.log('🚪 Logout button clicked');
    
    try {
      await logout().unwrap();
      // The interceptor will handle redirect
    } catch (err: any) {
      console.error('❌ Logout failed:', err);
      setError(err?.data?.message || 'Logout failed. Please try again.');
      
      // ✅ Even if error, clear local state
      // The authApi already handles this, but we do it again just in case
      import('../../lib/utils/cookies').then(({ cookieUtils }) => {
        cookieUtils.clearAll();
      });
      navigate('/login');
    }
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        disabled={isLoading}
        variant="destructive"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging out...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};