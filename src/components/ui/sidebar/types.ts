
import { ReactNode } from "react"
import type { TooltipContentProps } from "@radix-ui/react-tooltip"
import { LucideIcon } from "lucide-react"
import { VariantProps } from "class-variance-authority"
import { sidebarMenuButtonVariants } from "./sidebar-menu-button"

export type SidebarState = "expanded" | "collapsed"

export interface SidebarContext {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | Omit<TooltipContentProps, 'ref'>
}
