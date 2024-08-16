import React from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'

interface Props {
    visible: boolean;
    hideDialog: () => void;
    title: string;
    message: string;
    buttons: React.ReactNode
}
const DialogAlert = ({visible,hideDialog,title,message,buttons}: Props) => {
    return (
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title style={{fontSize: 20, fontWeight: '700'}}>{title}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyLarge">{message}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              {buttons}
            </Dialog.Actions>
          </Dialog>
        </Portal>
    )
}

export default DialogAlert
