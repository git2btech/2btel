import { Heading, HStack, Image, VStack, Text, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Trash2 } from "lucide-react-native";
import vendingMachine from "@assets/vendingMachine.png";
import { PointsDTO, PointsItensDTO } from "@dtos/PointsDTO";
import { formatDate } from "@utils/formatsFunctions";

type Props = TouchableOpacityProps & {
    data: PointsDTO | PointsItensDTO
    onPress?: () => void;      // clique no card
    onDelete?: () => void;     // clique na lixeira
};

export function PointCard({ data, onPress, onDelete, ...rest }: Props){

    return (
        <TouchableOpacity onPress={onPress} {...rest}>
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
                    {data.tipoApontamento !== 0 && <Heading fontSize="$sm" color="$gray500" fontFamily="$heading">{data.tipoApontamento}</Heading>}
                    {(data.modeloMaquina || data.nomeDeposito) && (<Text fontSize="$xs" color="$gray300" numberOfLines={2}>{data.modeloMaquina || data.nomeDeposito}</Text>)}
                    {'loginRegistro' in data && <Text fontSize="$xs" color="$gray300" numberOfLines={1}>Criado por: {data.loginRegistro}</Text>}
                    {'dataRegistro' in data && <Text fontSize="$xs" color="$gray300" numberOfLines={1}>Data do registro: {formatDate(data.dataRegistro)}</Text>}
                    {'nomeProduto' in data && <Text fontSize="$xs" color="$body">{data.nomeProduto}</Text>}
                    {'quantidade' in data && <Text fontSize="$xs" color="$gray300">Quantidade: {data.quantidade}</Text>}
                </VStack>
                <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Icon as={Trash2} color="$red500" />
                </TouchableOpacity>
            </HStack>

            
        </TouchableOpacity>
    )
}