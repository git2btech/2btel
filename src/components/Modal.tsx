import { useState } from "react";
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
} from "@gluestack-ui/themed";
import { X } from "lucide-react-native";
import { DataSelect, Select } from "./Select";

type ModalProps = {
  showModal?: boolean;
  data: DataSelect[];
  onValueChange?: (value: string) => void;
  onCloseModal: () => void;
};

export function Modal({ showModal = true, data, onValueChange, onCloseModal }: ModalProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <Center className="h-[300px]">
      <GluestackModal isOpen={showModal} onClose={() => onCloseModal()} size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Selecione um grupo</Heading>
            <ModalCloseButton>
              <Icon as={X} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Select defaultValue={selectedValue || ""} onValueChange={handleValueChange} data={data}/>
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