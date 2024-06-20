import NewestProducts from "@/components/newest-products";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
          <div className="lg:col-span-3">
            <h1 className="block text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Sell your art with Digi<span className="text-primary">Mart</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Introducing a new way for your <span className="text-primary font-semibold">Digital Art</span> to reach the creative
              community.
            </p>
          </div>

          <div className="lg:col-span-4 mt-10 lg:mt-0">
            <img
              className="w-full rounded-xl"
              src="https://images.unsplash.com/photo-1665686376173-ada7a0031a85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&h=700&q=80"
              alt="Image Description"
            />
          </div>
        </div>
      </div>
      <NewestProducts/>
    </section>
  );
}
