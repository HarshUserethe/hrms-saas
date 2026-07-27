'use client';

import { useState, useEffect } from 'react';

export function useAttendanceTimer(startTime: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = !startTime
    ? 0
    : Math.max(0, Math.floor((now - new Date(startTime).getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  return {
    elapsed: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    totalSeconds: diff,
  };
}
