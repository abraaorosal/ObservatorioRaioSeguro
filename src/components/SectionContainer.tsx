import type { ReactNode } from 'react';

interface SectionContainerProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionContainer({ id, eyebrow, title, description, children }: SectionContainerProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-5">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase text-institutional-gold">{eyebrow}</p>
        ) : null}
        <div className="flex flex-col gap-2 border-l-4 border-institutional-gold pl-4">
          <h2 className="text-xl font-bold text-institutional-ink md:text-2xl">{title}</h2>
          {description ? (
            <p className="max-w-5xl text-sm leading-6 text-institutional-steel md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
