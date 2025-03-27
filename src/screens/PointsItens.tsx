import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, VStack, Icon, HStack, Heading, useToast } from '@gluestack-ui/themed';
import { Archive, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ToastMessage } from '@components/ToastMessage';
import api from '@services/api';
import axios from 'axios';
import { PointsItensDTO } from '@dtos/PointsDTO';
import { useAuth } from '@hooks/useAuth';

type RouteParamsProps = {
    pointID: number
}


export function PointsItens(){
    const { user } = useAuth();
    const route = useRoute();
    const toast = useToast();
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const { pointID } = route.params as RouteParamsProps;
    console.log("ID =>", pointID);
    const [pointsItem, setPointsItem] = useState<PointsItensDTO[]>([]);
    function handleGoBack(){
        navigation.navigate("points");
    }

    async function getPointItens(){
        try {
            const response = await api.get(`/inventario/${pointID}`, { 'headers': { 'Authorization': `Bearer ${user.accessToken}` } });
            if(response.data && response.data.items){
                setPointsItem(response.data.items);
            }
        } catch(e){
            console.log('Erro: ', e)
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao resgatar grupos" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } 
    }

    useEffect(() => {
        getPointItens();
    }, []);

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
                        <Text color="$primary000" fontFamily="$body">{pointsItem.length}</Text>
                    </HStack>
                </HStack>
            </VStack>
        </VStack>
    )
}