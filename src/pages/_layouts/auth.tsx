import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2 antialiased">
      <div className="flex h-full border-r border-foreground/5 bg-muted p-10 text-muted-foreground flex-col justify-between">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <span className="font-semibold">Talk to Refugee</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center relative">
        <Outlet />
        </div>
    </div>
  )
}