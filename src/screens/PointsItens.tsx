import { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Text, VStack, Icon, HStack, Heading, useToast } from '@gluestack-ui/themed';
import { Archive, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { ToastMessage } from '@components/ToastMessage';
import api from '@services/api';
import axios from 'axios';
import { PointsItensDTO, PointsDTO } from '@dtos/PointsDTO';
import { useAuth } from '@hooks/useAuth';
import { PointCard } from '@components/PointCard';
import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

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
    const [point, setPoint] = useState<PointsDTO>();
    const [isLoading, setIsLoading] = useState(false);

    function handleGoBack(){
        navigation.navigate("points");
    }

    function handleOpenCreatePointIten(point: PointsDTO){
        navigation.navigate("createPointIten", {point});
    }

    async function getPointItens(){
        try {
            setIsLoading(true);
            const response = await api.get(`/inventario/${pointID}`, { 'headers': { 'Authorization': `Bearer ${user.accessToken}` } });
            if(response.data && response.data.items){
                console.log(response.data.items);
                setPoint(response.data);
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
        } finally{
            setIsLoading(false);
        }
    }

    const isArrayExactlyNull = (arr: any[]) => {
      return Array.isArray(arr) && arr.length === 1 && arr[0] === null;
    };

     useEffect(() => {
        getPointItens();
    }, [pointID]);

    useFocusEffect(useCallback(() => {
            getPointItens();
    }, [pointID]))

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
                        <Text color="$primary000" fontFamily="$body">{!isArrayExactlyNull(pointsItem) ? pointsItem.length : 0}</Text>
                    </HStack>
                </HStack>
            </VStack>
            {isLoading ? <Loading /> :
                <VStack px="$8" mt="$10" flex={1}>
                    {!isArrayExactlyNull(pointsItem) ? (
                        <FlatList 
                            data={pointsItem} 
                            keyExtractor={ item => item?.id.toString()}
                            renderItem={({ item }) => (
                                <PointCard data={item} onPress={() => {}}/>
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20}}
                        />
                    ) : (
                        <Text color="white" fontSize="$sm" fontFamily="$body">
                            Parece que você ainda nao tem itens cadastrados.
                            Você pode estar adicionando novos itens clicando no
                            botão abaixo.
                        </Text>
                    )}
                </VStack>
            }
            <VStack px="$8" pt="$4" pb="$4">
                <Button title="Adicionar Itens ao Apontamento" variant="solid" onPress={() => handleOpenCreatePointIten(point)} />
            </VStack>
        </VStack>
    )
}