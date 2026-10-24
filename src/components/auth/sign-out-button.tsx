import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-actions";

/** Plain form post, so signing out works without client JS. */
export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary">
        Sign out
      </Button>
    </form>
  );
}
