import { BottomTabBar } from "./BottomTabBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-brand-bg">
      <div className="flex-1 pb-4">{children}</div>
      <BottomTabBar />
    </div>
  );
}
