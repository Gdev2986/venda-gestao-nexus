
import { UserRole } from "@/types";

export type SidebarProps = {
  className?: string;
};

export type SidebarUserProfileProps = {
  userRole?: UserRole;
};

export type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
  subItems?: SidebarSubItem[];
};

export type SidebarSubItem = {
  title: string;
  href: string;
  roles: UserRole[];
};
