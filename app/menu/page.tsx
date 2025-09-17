"use client";
import { Circle, Vegan } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurants } from "@/lib/menuData";

const MenuPage = () => {
  const searchParams = useSearchParams();
  const hotel = searchParams.get("hotel") || "bistro-avenue";

  const currentHotel = restaurants.find((i) => i.restaurantId === hotel);

  return (
    <div className="min-h-screen p-4 sm:p-6 container mx-auto">
      <h1 className="text-xl font-medium text-zinc-800">
        {currentHotel?.restaurantName}
      </h1>
      <h2 className="capitalize text-zinc-700">Menu</h2>
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentHotel?.menu.map((item) => (
          <Card
            key={item.id}
            className="p-2 sm:p-3 hover:-translate-0.5 gap-0.5 shadow-none hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <CardHeader className="p-2 sm:p-3">
              <CardTitle className="mb-2 text-base sm:text-lg">
                {item.name}
              </CardTitle>
              <div className="w-full aspect-[4/3] relative mb-2">
                <Image
                  fill
                  src={item.imageUrl!}
                  alt={item.name}
                  className="rounded-md object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 flex-1 flex flex-col">
              <div className="line-clamp-2 text-sm text-zinc-600 mb-4">
                {item.description}
              </div>
              <div className="flex items-center justify-between font-medium mt-auto">
                <p className="text-zinc-900">$ {item.price}</p>
                <div className="flex items-center gap-2">
                  {item.isVegan && <Vegan />}
                  {item.isVegetarian ? (
                    <Circle color="green" className="fill-green-500" />
                  ) : (
                    <Circle color="red" className="fill-red-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
