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
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full max-w-96"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {imageArray.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`Carousel image ${index + 1}`}
                      layout="fill" // Set layout to fill for responsive behavior
                      objectFit="cover" // Maintain aspect ratio while covering the area
                      className="rounded-lg" // Optional: for rounded corners
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
