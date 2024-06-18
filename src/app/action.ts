"use server";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {type CategoryEnum } from "@prisma/client";
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
    data:{
        name:parsedFields.data.name,
        category:parsedFields.data.category as CategoryEnum,
        price:parsedFields.data.price,
        images:parsedFields.data.images,
        productfile:parsedFields.data.productfile,
        smalldescription: parsedFields.data.smalldescription,
        description:JSON.parse(parsedFields.data.description),
        userId:user.id
    }
  })

  return redirect(`/product/${data.id}`);
}
