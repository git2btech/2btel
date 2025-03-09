import { TouchableOpacity } from 'react-native';
import { Center, Text, VStack, Icon, HStack, Heading } from '@gluestack-ui/themed';
import { Archive, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';


export function PointsItens(){
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    function handleGoBack(){
        navigation.navigate("points");
    }

    return (
        <VStack flex={1}>
            <VStack px="$8" bg="$green500" pt="$12">
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={ArrowLeft} color="$primary000" size="xl"/>
                </TouchableOpacity>

                <HStack justifyContent="space-between" alignItems="center" mt="$4" mb="$8">
                    <Heading color="$primary000" fontFamily="$heading" fontSize="$lg" flexShrink={1}>Itens do Apontamento</Heading>
                    <HStack gap="$2" alignItems="center">
                        <Icon as={Archive} color="$primary000"/>
                        <Text color="$primary000" fontFamily="$body">0</Text>
                    </HStack>
                </HStack>
            </VStack>
        </VStack>
    )
}