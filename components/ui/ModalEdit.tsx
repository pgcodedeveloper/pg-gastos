import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { ViewStyle } from 'react-native'
import { Button, Modal, Portal, Text } from 'react-native-paper'

interface Props {
    visible: boolean,
    hideModal: () => void,
    containerStyle: ViewStyle,
    children: React.JSX.Element
}

const ModalEdit = ({visible,hideModal, containerStyle, children}: Props) => {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <Button compact theme={{roundness: 1}} style={{position: 'absolute', top: 4, right: 2}} mode="text" onPress={() => {hideModal()}}>
                    <AntDesign name="close" size={24} color="#EE4135" />
                </Button>
                {children}
            </Modal>
        </Portal>
    )
}

export default ModalEdit
