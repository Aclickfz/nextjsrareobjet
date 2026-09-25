'use client';

import { useActionState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useToast } from '@/components/ui/ToastProvider';

type State = { error?: string; message?: string } | undefined;
export function useAuthAction(action: (state: State, data: FormData) => Promise<State>, success?: string) {
  const toast = useToast();
  return useActionState(async (state: State, data: FormData) => {
    try { return await action(state, data); }
    catch (error) {
      if (isRedirectError(error)) {
        if (success) toast(success);
        throw error;
      }
      return { error: 'We could not complete your request. Please try again.' };
    }
  }, undefined);
}
