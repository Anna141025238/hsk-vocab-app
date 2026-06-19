'use client';

export function trackPageView() {
  if (typeof window === 'undefined') return;

  const today = new Date().toISOString().split('T')[0];

  // Increment total view counter
  const totalViews = parseInt(localStorage.getItem('admin_total_views') || '0', 10);
  localStorage.setItem('admin_total_views', String(totalViews + 1));

  // Update daily visits
  const visits: { date: string; count: number }[] = JSON.parse(
    localStorage.getItem('admin_visits') || '[]'
  );

  const existingDay = visits.find((v) => v.date === today);
  if (existingDay) {
    existingDay.count += 1;
  } else {
    visits.push({ date: today, count: 1 });
    // Keep last 30 days only
    if (visits.length > 30) visits.shift();
  }

  localStorage.setItem('admin_visits', JSON.stringify(visits));
}
