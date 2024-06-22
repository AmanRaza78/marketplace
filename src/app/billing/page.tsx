import SubmitButton from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { CreateStripeAccoutnLink, GetStripeDashboardLink } from "../action";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      isAccountConnected: true,
    },
  });

  return data;
}

export default async function BillingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/api/auth/login");
  }

  const data = await getData(user.id);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>
            Find all your details regarding your payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.isAccountConnected === false && (
            <form action={CreateStripeAccoutnLink}>
              <SubmitButton title="Link your Accout to stripe" />
            </form>
          )}

          {data?.isAccountConnected === true && (
            <form action={GetStripeDashboardLink}>
              <SubmitButton title="View Dashboard" />
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
