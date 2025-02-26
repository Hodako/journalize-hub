
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Sun, Moon, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";

const categories = [
  "Science",
  "Technology",
  "Fun",
  "Health",
  "Business",
  "Sports",
  "Arts"
];

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="px-2 py-4">
                <Input 
                  placeholder="Search articles..."
                  className="mb-4"
                  onChange={(e) => {
                    if (e.target.value) {
                      navigate(`/search?q=${e.target.value}`);
                    }
                  }}
                />
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}>
                    Home
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                    >
                      {category}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <a href="/" className="text-xl font-bold transition-transform hover:scale-105">
            Journal<span className="text-primary">Hub</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <div className={`transition-all duration-300 ${isSearchVisible ? 'w-64' : 'w-0'} overflow-hidden`}>
            <Input
              placeholder="Search articles..."
              className="w-full"
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/search?q=${e.target.value}`);
                }
              }}
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="transition-transform hover:scale-105"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="transition-transform hover:scale-105">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuItem onClick={() => navigate("/create")}>
                    Create Post
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/auth")}>
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex transition-transform hover:scale-105"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
