import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock toast to prevent console warnings
vi.mock('./components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));