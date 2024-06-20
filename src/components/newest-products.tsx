import prisma from "@/lib/db";
import Link from "next/link";
import ProductCard from "./product-card";

async function getData() {
    const data = await prisma.product.findMany({
        select:{
            price: true,
            smalldescription:true,
            category:true,
            name:true,
            id:true,
            images:true
        },
        take:4,
        orderBy:{
            createdAt:"desc"
        }
    })

    return data
}

export default async function NewestProducts() {
    const data = await getData();

  return (
    <section className="mt-12 mb-10">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Newest Products
        </h2>
        <Link
          href="#"
          className="text-sm hidden font-medium text-primary hover:text-primary/90 md:block"
        >
          All Products <span>&rarr;</span>
        </Link>
      </div>

      <div className="grid gird-cols-1 lg:grid-cols-3 sm:grid-cols-2 mt-4 gap-10">
        {data.map((product)=>(
          <ProductCard
          key={product.id}
          images={product.images}
          price = {product.price}
          smalldescription ={product.smalldescription}
          name = {product.name}
          id = {product.id}
          />
        ))}

      </div>
    </section>
  );
}
