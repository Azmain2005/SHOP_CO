"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

async function fetchProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export default function TestSec() {
    const [index, setIndex] = useState(0);

    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ["all-products"],
        queryFn: fetchProducts,
    });

    const prevCard = () => {
        setIndex((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const nextCard = () => {
        setIndex((prev) => 
            prev >= products.length - 6 ? products.length - 6 : prev + 1
        );
    };

    // ✅ useEffect will always run — never skipped
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) =>
                prevIndex >= products.length - 6 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [products]);

    // ✅ Now handle conditional rendering AFTER hooks
    if (isLoading) {
        return <p className="p-4">Loading products...</p>;
    }

    if (error) {
        return <p className="p-4 text-red-500">Error loading products</p>;
    }

    return (
        <div className="container rounded-lg overflow-x-hidden">
            <p className="text-lg sm:text-xl font-bold border-b-2 p-2">Test Section</p>
            <div className="flex justify-between">
                {/* <p className="bg-red-600 w-[40px] m-5 items-center justify-center" onClick={prevCard}>prev</p> */}
                {/* <p className="bg-green-600 w-[40px] m-5" onClick={nextCard}>Next</p> */}
            </div>
            <div
                key={index}
                className="flex w-[70px] justify-between gap-8 animate-out slide-out-to-left-[200px] duration-3000"
            >
                {products.slice(index).map((product) => (
                    <Card
                        key={product.id}
                        image={product.image}
                        title={product.title}
                        reviews={product.rating.count}
                        rating={Math.round(product.rating.rate)}
                        price={product.price}
                    />
                ))}
            </div>
        </div>
    );
}
