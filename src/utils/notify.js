import toast from "react-hot-toast";

export const notifyError=(msg="Something went wrong!")=>{
    toast.error(msg)
}

export const notifySuccess=(msg)=>{
    toast.success(msg)
}