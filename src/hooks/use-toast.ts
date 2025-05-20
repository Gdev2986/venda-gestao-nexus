
import * as React from "react";
import { toast as sonnerToast } from "sonner";

// Constants
const TOAST_LIMIT = 20;

// Types
export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// Action types
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

// Helper functions
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: string }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

// Create our global state
const memoryState: State = { toasts: [] };
const listeners: Array<(state: State) => void> = [];

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          toastId === undefined || t.id === toastId
            ? { ...t, open: false }
            : t
        ),
      };
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;
      return {
        ...state,
        toasts: toastId
          ? state.toasts.filter((t) => t.id !== toastId)
          : [],
      };
    }

    default:
      return state;
  }
};

// Utility to dispatch actions
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Our public toast function
type ToastProps = Omit<ToasterToast, "id">;

// Export the toast function
export function toast(props: ToastProps) {
  const id = genId();

  const update = (props: ToastProps) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  // Show the toast with Sonner (which is what's actually displayed)
  sonnerToast(props.title as string, {
    description: props.description as string,
  });

  // Also update our internal state
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

// Hook for React components
export function useToast() {
  // NOTE: We import React fully at the top to make sure we have useState available
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    remove: (toastId?: string) =>
      dispatch({ type: actionTypes.REMOVE_TOAST, toastId }),
  };
}
