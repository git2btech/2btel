import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VStack, Text, HStack, Heading, useToast } from '@gluestack-ui/themed';
import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { PointCard } from '@components/PointCard';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useAuth } from '@hooks/useAuth';
import api from '@services/api';
import axios from 'axios';
import { ToastMessage } from '@components/ToastMessage';
import { DataSelect, Select } from '@components/Select';
import { Modal } from '@components/Modal';


export function Points(){
    const { user } = useAuth();
    const toast = useToast();
    const [showModal, setShowModal] = useState(false)
    const [points, setPoints] = useState(["Maquina","Maquina","Maquina","Maquina","Maquina","Maquina"]);
    const [pointsGroup, setPointsGroup] = useState(["Maquina","Deposito","Expedicao","Recebimento","Outros"]);
    const [group, setGroup] = useState<DataSelect[]>([]);
    const [groupSelected, setGroupSelected] = useState("Maquina");
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const [modalValue, setModalValue] = useState<string | null>(null);

    const handleSelectValueChange = (value: string) => {
        setModalValue(value);
        setShowModal(false);
    };

    function handleOpenExcerciseDetails(){
        navigation.navigate("pointsItens");
    }

    async function getUserGroups() {
        try{
            const response = await api.get(`/permissao-usuario/${user.id}`, { 'headers': { 'Authorization': `Bearer ${user.accessToken}` } });
            if(response.data && response.data.grupos.length >= 1){
                let dataGroups: DataSelect[] = [];
                response.data.grupos.map((g: any) => {
                    dataGroups.push({value: g.id, label: g.nome})
                })
                setGroup(dataGroups);
                setShowModal(true);
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
        getUserGroups();
    }, [])

    useEffect(() => {
        if(modalValue === ""){
            setShowModal(true);
            const toastId = toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage id={id} title="Grupo não especificado" description="Você deve selecionar um grupo da lista" action="error" onClose={()=>toast.close(id)} />
                )
            })
            return () => toast.close(toastId);
        }
    }, [modalValue])

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList 
                data={pointsGroup} 
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <Group 
                        name={ item } 
                        isActive={groupSelected === item } 
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 32}}
                style={{
                    marginVertical: 40,
                    maxHeight: 44,
                    minHeight: 44
                }}
            />

            <VStack px="$8" flex={1}>
                <HStack justifyContent="space-between" mb="$5" alignItems="center">
                    <Heading color="white" fontSize="$md" fontFamily="$heading">Apontamentos</Heading>
                    <Text color="white" fontSize="$sm" fontFamily="$body">{points.length}</Text>
                </HStack>

                <Modal showModal={showModal} onValueChange={handleSelectValueChange} data={group} onCloseModal={() => setShowModal(false)}/>
                {/* <FlatList 
                    data={points} 
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <PointCard onPress={handleOpenExcerciseDetails}/>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20}}
                    ListEmptyComponent={() => (
                        <Text color="white" fontSize="$sm" fontFamily="$body">
                            Parece que você ainda nao tem apontamentos cadastrados.
                            Você pode estar adicionando novos apontamentos clicando no
                            botão abaixo.
                        </Text>
                    )}
                /> */}
            </VStack>
        </VStack>
    )
}