import { ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/get-profile";
import { Skeleton } from "./ui/skeleton";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogTrigger } from "./ui/dialog";
import { UpdateProfileDialog } from "./update-profile-dialog";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile
  })

  function signOut() {
    Cookies.remove("auth")
    navigate("/sign-in", { replace: true })
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="flex select-none items-center gap-2" variant="outline">
            { loading ? (<Skeleton className="h-4 w-40" />): (profile?.name) }
            <ChevronDown className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            { loading ? (
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24"/>
              </div>
            ): (
              <>
                <span className="text-xs font-normal text-muted-foreground">
                  {profile?.email}
                </span>
              </>
            ) }
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="hover:cursor-pointer">
              <User className="mr-2 h-5 w-5" />
              <span>Perfil</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400 hover:cursor-pointer">
            <button className="w-full" onClick={() => signOut()}>
              <LogOut className="mr-2 h-5 w-5" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateProfileDialog />
    </Dialog>
  );
}
