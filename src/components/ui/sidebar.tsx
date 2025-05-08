
// Re-export all sidebar components from their respective files

// Export context and provider
export { SidebarProvider, useSidebar } from "./sidebar/sidebar-context"

// Export main sidebar component
export { Sidebar } from "./sidebar/sidebar"

// Export sidebar trigger
export { SidebarTrigger } from "./sidebar/sidebar-trigger"

// Export sidebar rail 
export { SidebarRail } from "./sidebar/sidebar-rail"

// Export sidebar components
export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenuSkeleton
} from "./sidebar/sidebar-components"

// Export sidebar menu button and variants
export { 
  SidebarMenuButton,
  sidebarMenuButtonVariants 
} from "./sidebar/sidebar-menu-button"

// Export sidebar menu components
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "./sidebar/sidebar-menu"

// Export separator
export { SidebarSeparator } from "./sidebar/sidebar-components"
