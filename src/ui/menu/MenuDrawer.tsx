import { Divider, Drawer, IconButton, List, ListItem, ListItemButton } from "@mui/joy"
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react"

export default function MenuDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
    <IconButton onClick={()=> setOpen(true)}>
      <MenuIcon/>
    </IconButton>

    <Drawer
      onClose={()=> setOpen(false)}
      open={open}
      invertedColors={false}
      size="sm"
      variant="outlined"
    >
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
              <ListItem key={text}>
                <ListItemButton>{text}</ListItemButton>
              </ListItem>
            ))}
          </List>
    </Drawer>
    
    </>
  )
}