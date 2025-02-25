import { useDispatch } from "react-redux";
import { toast } from "sonner"; // Importing toast from sonner
import { Dispatch } from "redux";
import { ActionCreators } from "redux-undo";


const useToast = () => {
  const dispatch: Dispatch = useDispatch();

  // Type for the showToast function
  const showToast = (message: string): void => {
    const toastOptions = {
      description: new Date().toLocaleString(),
      style: {
        backgroundColor: "#cffafe", // Light blue
        color: "black",
      },
      action: {
        label: "Undo",
        onClick: () => {
          dispatch(ActionCreators.undo());
          toast("Action has been cancelled", {
            description: new Date().toLocaleString(),
            style: {
              backgroundColor: "#fef3c7", // Yellow
              color: "black",
            },
            action: {
              label: "Redo",
              onClick: () => {
                dispatch(ActionCreators.redo());
                toast("Action has been restored", {
                  description: new Date().toLocaleString(),
                  style: {
                    backgroundColor: "#d1fae5", // Light green
                    color: "black",
                  },
                });
              },
            },
          });
        },
      },
    };

    toast(message, toastOptions);
  };

  return { showToast };
};

export default useToast;
