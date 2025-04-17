import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    IconButton,
    Box
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import { ReactNode } from 'react';
  
  interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    content?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
  }
  
  export const DeleteModal: React.FC<DeleteDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title = 'Confirm Delete',
    content = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    loading = false
  }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="delete-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {title}
            <IconButton edge="end" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText component="div">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
            variant="outlined"
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };