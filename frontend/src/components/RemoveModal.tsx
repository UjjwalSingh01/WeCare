import * as React from 'react';
import { Box, Button, Typography, Modal, MenuItem, TextField } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

const admin = [
  {
    id: '1',
    name: 'John Doe',
  },
  {
    id: '2',
    name: 'Jane Edo',
  },
];

export default function RemoveModal({ heading }: { heading: string }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [member, setMember] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMember(event.target.value);
  };

  async function OnRemove() {
    try {
        const response = await axios.post('/', {
            member
        })

        console.log(response.data.message)

        // handleClose();

    } catch (error) {
        console.error('Error in Removing Modal: ', error)
    }
  }

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleOpen}>
        {heading}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
            {heading}
          </Typography>

          <TextField
            id="outlined-select-admin"
            select
            label={heading}
            fullWidth
            value={member}
            onChange={handleChange}
            sx={{ mb: 3 }}
          >
            {admin.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => {OnRemove()}} variant="contained" color="error">
              Remove
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
