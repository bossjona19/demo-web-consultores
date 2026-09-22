export function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-3 text-sm font-semibold tracking-widest text-accent uppercase">{index}</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted text-pretty">{subtitle}</p>}
    </div>
  );
}
