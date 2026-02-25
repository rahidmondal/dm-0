import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/chat');
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      <p className="text-sm text-slate-500 dark:text-slate-400">Entering the chat...</p>
    </div>
  );
}
