"use client";
import { ArrowLeft, ArrowRight, Circle, Vegan } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { restaurants } from "@/lib/menuData";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination } from "swiper/modules";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

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

      <div className="border rounded-lg bg-gradient-to-l from-gray-200 from-0%  via-10% via-gray-50 to-85% to-gray-200">
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{ enabled: true }}
          allowTouchMove={false}
          onDrag={(e) => e.stopPropagation()}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
          pagination={{ clickable: true }}
          className="relative h-[60svh]"
        >
          {currentHotel?.menu?.map(item => (
            <SwiperSlide className="relative cursor-grab rounded-lg h-[60svh]">
              {item?.model ?
                <ModelViewer modelPath={item.model} scale={item.scale} />
                :
                <img className="object-center w-full object-cover rounded-lg h-full" src={item?.imageUrl!} alt={item.name} />
              }
              <div className="absolute top-3 left-3 text-zinc-700 capitalize">{item.name}</div>
            </SwiperSlide>
          ))}
          <div className="absolute top-3 right-5 text-sm text-zinc-800/40 flex items-center gap-2">
            <ArrowLeft size={12} /> Drag <ArrowRight size={12} />
          </div>
        </Swiper>

      </div>



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
