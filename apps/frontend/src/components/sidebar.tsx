import React, { useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Separator } from "@components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import { NAV_GROUPS, filterNavGroups, type NavGroup } from "@lib/navigation";
import { useAuth } from "@lib/auth-context";
import { UserRole } from "shared";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  variant: "desktop" | "mobile";
  onNavClick?: () => void;
}

function NavGroupItem({
  group,
  collapsed,
  currentPath,
  onNavClick,
}: {
  group: NavGroup;
  collapsed: boolean;
  currentPath: string;
  onNavClick?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const isActive = group.links.some((link) => link.href === currentPath);

  if (collapsed) {
    return (
      <div className="space-y-1">
        {group.links.map((link) => {
          const active = link.href === currentPath;
          return (
            <button
              key={link.href}
              onClick={() => {
                navigate({ to: link.href });
                onNavClick?.();
              }}
              className={cn(
                "flex w-full items-center justify-center rounded-lg p-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-700 text-white"
                  : "text-brand-200 hover:bg-brand-800 hover:text-white",
              )}
              title={link.label}
            >
              <link.icon className="h-5 w-5 shrink-0" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-brand-700 text-white"
              : "text-brand-200 hover:bg-brand-800 hover:text-white",
          )}
        >
          <group.icon className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-right">{group.label}</span>
          {open ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ms-2 mt-1 space-y-1 ps-4">
        {group.links.map((link) => {
          const active = link.href === currentPath;
          return (
            <button
              key={link.href}
              onClick={() => {
                navigate({ to: link.href });
                onNavClick?.();
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors justify-between",
                active
                  ? "bg-brand-700 text-white font-medium"
                  : "text-brand-300 hover:bg-brand-800 hover:text-white",
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  variant,
  onNavClick,
}: SidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const role = UserRole.Admin;
  const filteredGroups = filterNavGroups(NAV_GROUPS, role);

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-brand-900 text-white",
        collapsed ? "w-16" : "lg:w-64",
        "transition-all duration-300",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-brand-800 px-4 ",
          collapsed ? "justify-center py-4" : "gap-2 py-3",
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold">
          خ
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold">نظام الجمعيات</span>
        )}
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-2">
          {filteredGroups.map((group) => (
            <NavGroupItem
              key={group.label}
              group={group}
              collapsed={collapsed}
              currentPath={currentPath}
              onNavClick={onNavClick}
            />
          ))}
        </nav>
      </ScrollArea>

      <Separator className="bg-brand-800" />

      <div
        className={cn(
          "flex shrink-0 items-center gap-2 p-3",
          collapsed && "flex-col",
        )}
      >
        {variant === "desktop" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-brand-300 hover:bg-brand-800 hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex-1 justify-start gap-2 text-brand-300 hover:bg-brand-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export { SidebarContent };
