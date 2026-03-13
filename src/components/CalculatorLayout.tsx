import { ReactNode } from "react";

type CalculatorLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  aside: ReactNode;
  actions?: ReactNode;
};

export function CalculatorLayout({ title, description, children, aside, actions }: CalculatorLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 py-10 px-4 lg:px-8">
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>
          {actions}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <main className="space-y-8">{children}</main>
        <aside className="space-y-8">{aside}</aside>
      </div>
    </div>
  );
}
