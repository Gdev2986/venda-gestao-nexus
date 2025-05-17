
import { Loader2 } from "lucide-react";
import React from "react";

export const Icons = {
  spinner: (props: React.ComponentProps<typeof Loader2>) => (
    <Loader2 {...props} />
  ),
  // Add other icons as needed
};
