import {IconButton} from "@mui/joy";
import {useState} from "react";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {motion, AnimatePresence} from "framer-motion";



interface ChatsDrawerProps{
    setChat: (chat:string[]) => void

}

export default function ChatsDrawer({setChat}:ChatsDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton onClick={()=> setOpen(true)}>
                <MenuOpenIcon/>
            </IconButton>

            {open &&
                <motion.div className='fixed w-screen h-screen backdrop-blur-lg flex items-center justify-start '
                            initial={{opacity:0}}
                            animate={{opacity:1}} >

                    <AnimatePresence >
                        <motion.div className='h-screen w-[200px] py-7 px-5'
                                    initial={{opacity:0, x:200}} exit={{opacity:0, x:-200}}>

                            drawer


                        </motion.div>
                    </AnimatePresence>


                </motion.div>
            }
        </>

    )

}