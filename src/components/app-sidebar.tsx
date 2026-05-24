import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  QrCode,
  ScanLine,
  FilePlus2,
  History,
  ArrowRightLeft,
  Users,
  UserCircle,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const tracking = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Register", url: "/register", icon: FilePlus2 },
];
const qr = [
  { title: "QR Generator", url: "/qr-generator", icon: QrCode },
  { title: "QR Scanner", url: "/qr-scanner", icon: ScanLine },
];
const logs = [
  { title: "Scan Logs", url: "/scan-logs", icon: History },
  { title: "Movements", url: "/movements", icon: ArrowRightLeft },
];
const admin = [
  { title: "Users", url: "/users", icon: Users },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

function Section({
  label,
  items,
  current,
}: {
  label: string;
  items: { title: string; url: string; icon: typeof LayoutDashboard }[];
  current: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/60">{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = current === item.url;
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm hover:bg-sidebar-accent/70"
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {active && <span className="ml-auto size-1.5 rounded-full bg-[var(--color-gold)]" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const current = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 [&_[data-sidebar=sidebar]]:bg-[image:var(--gradient-primary)]"
    >
      <SidebarHeader className="border-b border-sidebar-border/40 px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-gold)]/20 ring-1 ring-[var(--color-gold)]/40">
            <GraduationCap className="size-5 text-[var(--color-gold)]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-sidebar-foreground">CIT DocTracker</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">Document & QR Generator</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1">
        <Section label="Tracking" items={tracking} current={current} />
        <Section label="QR Tools" items={qr} current={current} />
        <Section label="Logs" items={logs} current={current} />
        <Section label="Administration" items={admin} current={current} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-sidebar-accent/70">
              <Link to="/settings" className="flex items-center gap-3">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-sidebar-accent/70">
              <Link to="/logout" className="flex items-center gap-3">
                <LogOut className="size-4" />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
