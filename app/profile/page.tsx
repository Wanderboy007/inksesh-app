import { prisma } from "@/lib/db/prisma";
import { ProfileView } from "@/components/profile-view";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const { userId } = await searchParams;

  if (!userId) {
    redirect("/");
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      designs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return <ProfileView user={user} />;
}
