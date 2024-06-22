import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong");
  }

  const dbuser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbuser) {
    const account = await stripe.accounts.create({
      email: user.email as string,
      controller: {
        losses: {
          payments: "application",
        },
        fees: {
          payer: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    });
    await prisma.user.create({
      data: {
        id: user.id,
        firstname: user.given_name ?? "",
        lastname: user.family_name ?? "",
        email: user.email ?? "",
        profilepicture: user.picture ?? "",
        stripeConnectAccountId: account.id,
      },
    });
  }

  return NextResponse.redirect(
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://digimart-ten.vercel.app/"
  );
}
