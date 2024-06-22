"use server";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { type CategoryEnum } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The name has to be a min character length of 3" }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(1, { message: "The Price has to be bigger than 1" }),
  smalldescription: z
    .string()
    .min(10, { message: "Please summerize your product more" }),
  description: z.string().min(10, { message: "Description is required" }),
  images: z.array(z.string(), { message: "Images are required" }),
  productfile: z
    .string()
    .min(1, { message: "Pleaes upload a zip of your product" }),
});

const userSettingsSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),

  lastname: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),
});

export async function SellProduct(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const parsedFields = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    price: Number(formData.get("price")),
    smalldescription: formData.get("smalldescription"),
    description: formData.get("description"),
    images: JSON.parse(formData.get("images") as string),
    productfile: formData.get("productfile"),
  });

  if (!parsedFields.success) {
    const state: State = {
      status: "error",
      errors: parsedFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const data = await prisma.product.create({
    data: {
      name: parsedFields.data.name,
      category: parsedFields.data.category as CategoryEnum,
      price: parsedFields.data.price,
      images: parsedFields.data.images,
      productfile: parsedFields.data.productfile,
      smalldescription: parsedFields.data.smalldescription,
      description: JSON.parse(parsedFields.data.description),
      userId: user.id,
    },
  });

  return redirect(`/product/${data.id}`);
}

export async function UpdateUserSetting(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const parsedFields = userSettingsSchema.safeParse({
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
  });

  if (!parsedFields.success) {
    const state: State = {
      status: "error",
      errors: parsedFields.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  const data = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstname: parsedFields.data.firstname,
      lastname: parsedFields.data.lastname,
    },
  });

  const state: State = {
    status: "success",
    message: "Your Settings have been updated",
  };

  return state;
}

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      smalldescription: true,
      price: true,
      images: true,
      user: {
        select: {
          stripeConnectAccountId: true,
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round((data?.price as number) * 100),
          product_data: {
            name: data?.name as string,
            description: data?.smalldescription,
            images: data?.images,
          },
        },
        quantity: 1,
      },
    ],

    payment_intent_data: {
      application_fee_amount: Math.round((data?.price as number) * 100) * 0.1,
      transfer_data: {
        destination: data?.user?.stripeConnectAccountId as string,
      },
    },

    success_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/success"
        : "https://digimart-ten.vercel.app/success",
    cancel_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/cancel"
        : "https://digimart-ten.vercel.app/cancel",
  });

  return redirect(session.url as string);
}

export async function CreateStripeAccoutnLink() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      stripeConnectAccountId: true,
    },
  });

  const accountLink = await stripe.accountLinks.create({
    account: data?.stripeConnectAccountId as string,
    refresh_url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/billing"
        : "https://digimart-ten.vercel.app/billing",
    return_url:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/return/${data?.stripeConnectAccountId}`
        : `https://digimart-ten.vercel.app/return/${data?.stripeConnectAccountId}`,
    type: "account_onboarding",
  });

  return redirect(accountLink.url);
}

export async function GetStripeDashboardLink() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      stripeConnectAccountId: true,
    },
  });

  const loginLink = await stripe.accounts.createLoginLink(
    data?.stripeConnectAccountId as string
  );

  return redirect(loginLink.url);
}
