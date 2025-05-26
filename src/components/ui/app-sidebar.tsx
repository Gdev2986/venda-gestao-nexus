
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/use-user-role";
import SidebarNavigation from "@/components/layout/sidebar/SidebarNavigation";

export function AppSidebar() {
  const { userRole } = useUserRole();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            SP
          </div>
          <span className="text-lg font-semibold">SigmaPay</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation userRole={userRole} />
      </SidebarContent>
    </Sidebar>
  );
}
