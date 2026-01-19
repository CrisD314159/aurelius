import {motion} from "framer-motion";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {useState} from "react";
import LoadingComponent from "../loading/LoadingComponent";
import {Button, DialogActions, DialogContent, DialogTitle, Modal, ModalDialog} from "@mui/joy";
import {useMutation} from "@tanstack/react-query";
import {deleteChat} from "../../lib/http/http_queries";
import toast from "react-hot-toast";

interface DeleteChatButtonProps{
    chatId: number
    handleRefetch: () => void
}

export default function DeleteChatButton({chatId, handleRefetch}: DeleteChatButtonProps){
    const [open, setOpen] = useState(false)

    const {mutate} = useMutation({
        mutationFn: deleteChat,
        onSuccess: ((data)=> {
            toast.success(data.message)
            handleRefetch()
        }),
        onError: ((error)=> toast.error(error.message))
    })

    return (
        <>
            <motion.button className={'w-4 h-4 text-neutral-950 dark:text-neutral-400'}
                            onClick={()=> setOpen(true)}>
                <DeleteRoundedIcon/>
            </motion.button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="plain" role="alertdialog" sx={{backgroundColor:'rgb(192,192,192, 0.5)', backdropFilter:'blur(10px)'}}>
                    <DialogTitle>
                        Are you sure you want to delete this chat?
                    </DialogTitle>
                    <DialogActions>
                        <Button variant="solid" color="danger" onClick={() => mutate(chatId)}>
                            Delete
                        </Button>
                        <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </>
    )
}