import UserProfileForm from "@/components/UserProfileForm";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Effects (Moved here from component) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-600/20 blur-[100px] rounded-full pointer-events-none" />
      <H1>HELLO<H1/>
      {/* The clean component sits inside */}
      <UserProfileForm />
    </main>
  );
}
