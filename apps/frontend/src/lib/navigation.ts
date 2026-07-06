import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { UserRole } from "shared";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  links: NavLink[];
  roles: UserRole[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "الرئيسية",
    icon: LayoutDashboard,
    links: [
      {
        label: "لوحة التحكم",
        href: "/",
        icon: LayoutDashboard,
        roles: [UserRole.Admin, UserRole.Manager, UserRole.Viewer],
      },
    ],
    roles: [UserRole.Admin, UserRole.Manager, UserRole.Viewer],
  },
  {
    label: "إدارة المساعدات",
    icon: Package,
    links: [
      {
        label: "المستفيدون",
        href: "/beneficiaries",
        icon: Users,
        roles: [UserRole.Admin, UserRole.Manager, UserRole.Viewer],
      },
      {
        label: "المساعدات",
        href: "/aid",
        icon: Package,
        roles: [UserRole.Admin, UserRole.Manager, UserRole.Viewer],
      },
      {
        label: "التقارير",
        href: "/reports",
        icon: FileText,
        roles: [UserRole.Admin, UserRole.Manager],
      },
    ],
    roles: [UserRole.Admin, UserRole.Manager, UserRole.Viewer],
  },
  {
    label: "الإدارة",
    icon: Shield,
    links: [
      {
        label: "المستخدمون",
        href: "/users",
        icon: Users,
        roles: [UserRole.Admin],
      },
      {
        label: "الإعدادات",
        href: "/settings",
        icon: Settings,
        roles: [UserRole.Admin],
      },
    ],
    roles: [UserRole.Admin],
  },
];

export function filterNavGroups(
  groups: NavGroup[],
  role: UserRole,
): NavGroup[] {
  return groups
    .filter((group) => group.roles.includes(role))
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.roles.includes(role)),
    }));
}
