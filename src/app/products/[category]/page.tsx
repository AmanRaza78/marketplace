import ProductCard from "@/components/product-card";
import prisma from "@/lib/db";
import { type CategoryEnum } from "@prisma/client";
import { notFound } from "next/navigation";

async function getData(category: string) {
  let input;

  switch (category) {
    case "template": {
      input = "template";
      break;
    }
    case "uikit": {
      input = "uikit";
      break;
    }
    case "icon": {
      input = "icon";
      break;
    }
    case "all": {
      input = undefined;
      break;
    }
    default: {
      return notFound();
    }
  }

  const data = await prisma.product.findMany({
    where: {
      category: input as CategoryEnum,
    },
    select: {
      id: true,
      images: true,
      name: true,
      smalldescription: true,
      price: true,
    },
  });

  return data;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
    const data = await getData(params.category)
    return(
        <section className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
                {
                    data.map((product)=>(
                        <ProductCard
                        key={product.id}
                        images={product.images}
                        price={product.price}
                        name={product.name}
                        id={product.id}
                        smalldescription={product.smalldescription}
                        />
                    ))
                }
            </div>
        </section>
    )
}
