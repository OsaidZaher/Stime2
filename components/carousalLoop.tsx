import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTheme } from "next-themes";
export function CrousalLoop() {
  const { theme } = useTheme();

  const images = ["/img1.png", "/img3.png", "/img4.png"];
  const imagesDark = ["/img1dark.png", "/im3dark.png", "/img4dark.png"];

  const imageArray = theme === "dark" ? imagesDark : images;

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[Autoplay({ delay: 1500 })]}
      className="w-full max-w-l" // Adjust width to make it appear longer
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {imageArray.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-2">
              <Card className="shadow-lg">
                {" "}
                {/* Optional: Add shadow for depth */}
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`Carousel image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
