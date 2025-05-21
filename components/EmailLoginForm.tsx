import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

interface EmailLoginFormProps {
  onLogin: (email: string) => Promise<void>;
}

export const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email);
      toast({
        title: 'Login Successful',
        description: 'You have been logged in successfully.'
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Unable to log in. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="email-input"
        />
      </div>
      <Button 
        type="submit" 
        disabled={!validateEmail(email) || isLoading}
        data-testid="login-button"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};