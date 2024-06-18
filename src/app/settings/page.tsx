import SettingsForm from "@/components/settings-form";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstname: true,
      lastname: true,
      email: true,
    },
  });
  return data;
}

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const data = await getData(user.id);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <Card>
        <SettingsForm
          firstname={data?.firstname as string}
          lastname={data?.lastname as string}
          email={data?.email as string}
        />
      </Card>
    </section>
  );
}
