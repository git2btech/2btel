import { ReactNode } from "react";
import {
  Center,
  Heading,
  Modal as GluestackModal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Icon,
  Button,
  ButtonText,
  Divider
} from "@gluestack-ui/themed";
import { X } from "lucide-react-native";

type ModalProps = {
  showModal?: boolean;
  children: ReactNode
  onValueChange?: (value: string) => void;
  onCloseModal: () => void;
};

export function Modal({ showModal = true, children, onCloseModal }: ModalProps) {
  return (
    <Center className="h-[300px]">
      <GluestackModal isOpen={showModal} onClose={() => onCloseModal()} size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Ação Necessária</Heading>
            <ModalCloseButton>
              <Icon as={X} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <Divider />
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter gap="$4">
            <Button bg="$red500" onPress={() => onCloseModal()}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button bg="$green500" onPress={() => onCloseModal()}>
              <ButtonText>Confirmar</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </GluestackModal>
    </Center>
  );
}