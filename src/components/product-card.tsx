import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import Link from "next/link";

interface ProductCardProps {
  images: string[];
  price: number;
  name: string;
  smalldescription: string;
  id: string;
}
export default function ProductCard({
  images,
  price,
  name,
  smalldescription,
  id,
}: ProductCardProps) {
  return (
    <div className="rounded-lg">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[230px]">
                <Image
                  alt="product image"
                  src={item}
                  fill
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>

      <div className="flex justify-between items-center mt-2">
        <h1 className="font-semibold text-xl">{name}</h1>
        <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset  ring-primary/10">
          ${price}
        </h3>
      </div>

      <p className="text-gray-600 line-clamp-2 text-sm mt-2">
        {smalldescription}
      </p>

      <Button asChild className="w-full mt-5">
        <Link href={`/product/${id}`}>Learn More!</Link>
      </Button>
    </div>
  );
}
