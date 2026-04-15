import { DASHBOARD_SECTIONS } from '../constants/navigation';
import { useEffect, useState } from 'react';

export function SectionNav() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') {
      return DASHBOARD_SECTIONS[0]?.id ?? '';
    }
    return window.location.hash.replace('#', '') || (DASHBOARD_SECTIONS[0]?.id ?? '');
  });

  useEffect(() => {
    const handleHashChange = () => {
      const next = window.location.hash.replace('#', '');
      if (next) {
        setActiveSection(next);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const sectionElements = DASHBOARD_SECTIONS.map((section) => document.getElementById(section.id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (!sectionElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: [0.05, 0.15, 0.35, 0.6, 0.9] },
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="sticky top-0 z-30 border-b border-institutional-line bg-white/95 backdrop-blur"
      aria-label="Navegação principal do dashboard"
    >
      <div className="scrollbar-official mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
        {DASHBOARD_SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeSection === section.id ? 'page' : undefined}
            className={`whitespace-nowrap rounded-md border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
              activeSection === section.id
                ? 'border-institutional-orange bg-institutional-ink text-white'
                : 'border-institutional-line bg-white text-institutional-graphite hover:border-institutional-gold hover:text-institutional-ink'
            }`}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
