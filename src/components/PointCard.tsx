import { Heading, HStack, Image, VStack, Text, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Trash2 } from "lucide-react-native";
import vendingMachine from "@assets/vendingMachine.png";

type Props = TouchableOpacityProps & {};

export function PointCard({ ...rest }: Props){
    return (
        <TouchableOpacity {...rest}>
            <HStack bg="$textLight0" alignItems="center" p="$2" pr="$4" rounded="$md" mb="$3">
                <Image 
                    source={vendingMachine} 
                    alt="Imagem do apontamento" 
                    w="$16" 
                    h="$16" 
                    mr="$4"
                    rounded="$md"
                    resizeMode="cover"
                />
                <VStack flex={1}>
                    <Heading fontSize="$sm" color="$gray500" fontFamily="$heading">Maquina</Heading>
                    <Text fontSize="$xs" color="$gray300" numberOfLines={1}>Criado por: </Text>
                    <Text fontSize="$xs" color="$gray300" numberOfLines={1}>Data do registro:</Text>
                </VStack>
                <Icon as={Trash2} color="$red500" />
            </HStack>

            
        </TouchableOpacity>
    )
}