'use client'
import { useRouter } from 'next/navigation';

export function Buttonback() {
   const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return <button onClick={handleGoBack} className="text-[#fd9500] text-lg absolute left-6">Go back</button>
}

// Export appRouter for use in other files
