"use client";
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Card from "./Card";
import { useQuery } from "@tanstack/react-query";
import Link from 'next/link'



// fetch function
async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}





export default function NewArrivals() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center p-10">
        <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">Error loading products</p>;
  }






  return (
    <div className="max-w-[1440px] mx-auto bg-white rounded-lg lg:p-10">
       <div className="text-center mb-6 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">NEW ARRIVALS</h2>
      </div>
      <Carousel>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/4 max-sm:basis-3/4 max-md:basis-1/4"
            >
              <Link href={`/ProductDetails/${product.id}`}>
              <Card
                image={product.image}
                title={product.title}
                reviews={product.rating.count}
                rating={Math.round(product.rating.rate)}
                price={product.price}
              />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center my-10 pb-10 border-b-2 border-gray-200">
  <button className="
    text-black border w-[218px] h-[52px] rounded-4xl transition uration-300 hover:bg-black hover:text-white hover:scale-105
    "
  >
    View All
  </button>
</div>


    </div>
  );
}
