import React from "react";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@components/ui/button";
import { Avatar, AvatarFallback } from "@components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@components/ui/sheet";
import { SidebarContent } from "@components/sidebar";

function Header() {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="p-0 border-l-0"
          >
            <SidebarContent
              collapsed={false}
              onToggleCollapse={() => {}}
              variant="mobile"
              onNavClick={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>

          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
    </>
  );
}

export { Header };
