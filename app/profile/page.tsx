import { prisma } from "@/lib/db/prisma";
import { ProfileView } from "@/components/profile-view";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const { userId } = await searchParams;

  const user = await prisma.user.findFirst({
    where: userId ? { id: userId } : undefined,
    orderBy: { createdAt: "desc" },
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
