import { ProfileNavbar } from "@/components/profile-navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-rose-600 selection:text-white">
      <ProfileNavbar />
      <main className="relative">{children}</main>
    </div>
  );
}
