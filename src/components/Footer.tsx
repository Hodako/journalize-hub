
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Link } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" type="email" />
              <Button size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="/mission" className="text-sm text-muted-foreground hover:text-primary">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="/sitemap" className="text-sm text-muted-foreground hover:text-primary">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="text-sm text-muted-foreground not-italic">
              <p>Email: contact@journalhub.com</p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-6">
          <p className="text-sm text-center text-muted-foreground">
            © 2024 JournalHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
