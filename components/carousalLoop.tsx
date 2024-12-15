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
import { useEffect, useState } from "react";

export function CrousalLoop() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const images = ["/img1.png", "/img3.png", "/img4.png"];
  const imagesDark = ["/img1dark.png", "/im3dark.png", "/img4dark.png"];

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  // If not mounted, return null or a placeholder
  if (!mounted) {
    return null;
  }

  const imageArray = theme === "dark" ? imagesDark : images;

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-l"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {imageArray.map((src, index) => (
          <CarouselItem key={src}>
            <div className="p-2">
              <Card className="shadow-lg">
                <CardContent className="flex aspect-square items-center justify-center p-0">
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`Carousel image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-lg object-cover"
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
