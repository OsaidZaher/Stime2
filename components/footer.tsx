import Link from "next/link";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Footer() {
  return (
    <footer>
      <div className="text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold"> Stime</span>. All rights reserved.
        </p>
        <ToggleGroup type="single">
          <nav>
            {/* Using Link for internal navigation */}
            <ToggleGroupItem value="About">
              <Link href="/about" className="mx-2">
                About
              </Link>
            </ToggleGroupItem>
            <ToggleGroupItem value="Contact">
              <Link href="/contact" className="mx-2">
                Contact
              </Link>
            </ToggleGroupItem>
            <ToggleGroupItem value="privacy">
              <Link href="/privacy" className="mx-2">
                Privacy Policy
              </Link>
            </ToggleGroupItem>

            {/* Using <a> for external links */}
            <ToggleGroupItem value="instagram">
              <a
                href="https://www.instagram.com/os.aid_z/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <IconBrandInstagram />
              </a>
            </ToggleGroupItem>
            <ToggleGroupItem value="facebook">
              <a
                href="https://www.facebook.com/osaid.zaher.7/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <IconBrandFacebook />
              </a>
            </ToggleGroupItem>
            <ToggleGroupItem value="linkedin">
              <a
                href="https://www.linkedin.com/in/osaid-zaher-8056b8297/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <IconBrandLinkedin />
              </a>
            </ToggleGroupItem>
            <ToggleGroupItem value="github">
              <a
                href="https://github.com/OsaidZaher"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <IconBrandGithub />
              </a>
            </ToggleGroupItem>
          </nav>
        </ToggleGroup>
      </div>
    </footer>
  );
}
