import { Bounce, TypeOptions, toast } from "react-toastify"

export function toastify(message:string= "success", type: TypeOptions ="success" ) : void{
    toast(message, {
      position: "top-right",
      type,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
}