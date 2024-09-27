import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandX,
} from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Footer() {
  return (
    <footer>
      <div className=" text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold"> Stime</span>. All rights reserved.
        </p>
        <ToggleGroup type="single">
          <nav>
            <ToggleGroupItem value="About">
              <a href="/about" className="mx-2">
                About
              </a>
            </ToggleGroupItem>
            <ToggleGroupItem value="Contact">
              <a href="/contact" className="mx-2">
                Contact
              </a>
            </ToggleGroupItem>
            <ToggleGroupItem value="privacy">
              <a href="/privacy" className="mx-2">
                Privacy Policy
              </a>
            </ToggleGroupItem>
            <ToggleGroupItem value="privacy">
              <IconBrandInstagram />
            </ToggleGroupItem>
            <ToggleGroupItem value="privacy">
              <IconBrandFacebook />
            </ToggleGroupItem>
            <ToggleGroupItem value="privacy">
              <IconBrandX />
            </ToggleGroupItem>
            <ToggleGroupItem value="privacy">
              <IconBrandGithub />
            </ToggleGroupItem>
          </nav>
        </ToggleGroup>
      </div>
    </footer>
  );
}
