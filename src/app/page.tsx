'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MindmapCanvas = dynamic(
  () => import('@/components/mindmap/MindmapCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">마인드맵 로딩 중...</div>
      </div>
    )
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">마인드맵 로딩 중...</div>
      </div>
    );
  }

  return <MindmapCanvas />;
}
