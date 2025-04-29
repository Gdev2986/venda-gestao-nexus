
import { UserRole } from "@/types";

export type SidebarProps = {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  userRole: UserRole;
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
