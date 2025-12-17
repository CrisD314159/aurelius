import { Suspense, lazy, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/joy';


const SettingDialogForm = lazy(()=> import('./ChangeConfigModalForm')) 

export default function ChangeConfigModal() {
  const [open, setOpen] = useState<boolean>(false);


  return (
    <>
      <IconButton variant="plain" onClick={() => setOpen(true)}>
        <SettingsIcon color='success'/>
      </IconButton>
      {
        open &&
        <Suspense >
          <SettingDialogForm open={open} setOpen={setOpen}/>
        </Suspense>
      }
    </>
  );
}



  