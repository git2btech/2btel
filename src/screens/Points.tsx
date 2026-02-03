import { useCallback, useEffect, useState } from 'react';
import { FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
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
import { PointsDTO } from '@dtos/PointsDTO';
import { Loading } from '@components/Loading';
import { Button } from '@components/Button';

type UserGroup = {
    acessaGrupo: boolean,
    dominio: string,
    entidadeAtiva: boolean,
    entidadeId: number,
    id: string,
    nome: string,
    todasFiliais: boolean,
    userId: boolean,
    codigo? : number,
    filialId? : number
}

export function Points(){
    const toast = useToast();
    const { user, updateProfileAndPermissions } = useAuth();
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const dataInicial = "2025-01-01T00:00:01";
    const dataFinal = new Date().toISOString().split('.')[0];
    const pointsGroup = ["Maquina","Deposito","Expedicao","Recebimento","Outros"];
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [points, setPoints] = useState<PointsDTO[]>([]);
    const [pointsFiltreds, setPointsFiltreds] = useState<PointsDTO[]>([]);
    const [groups, setGroups] = useState<UserGroup[]>([]);
    const [group, setGroup] = useState<DataSelect[]>([]);
    const [subGroups, setSubGroups] = useState<UserGroup[]>([]);
    const [subGroup, setSubGroup] = useState<DataSelect[]>([]);
    const [groupSelected, setGroupSelected] = useState("Maquina");
    const [selectedGroupValue, setSelectedGroupValue] = useState<string | null>(null);
    const [selectedSubGroupValue, setSelectedSubGroupValue] = useState<string | null>(null);
    const route = useRoute<RouteProp<any>>();

    function handleOpenExcerciseDetails(pointID: number){
        navigation.navigate("pointsItens", {pointID});
    }

    function handleOpenCreatePoint(){
        navigation.navigate("createPoint");
        
    }

    async function getUserGroups() {
        try{
            const response = await api.get(`/permissao-usuario/${user.id}`, { 'headers': { 'Authorization': `Bearer ${user.accessToken}` } });
            console.log('Response grupos: ', response.data);
            if(response.data && response.data.grupos.length >= 1){
                setGroups(response.data.grupos);
                let dataGroups: DataSelect[] = [];
                response.data.grupos.map((g: any) => {
                    dataGroups.push({value: g.id, label: g.nome})
                })
                if(response.data.subGrupos.length >= 1){
                    setSubGroups(response.data.subGrupos);
                    let dataSubGroups: DataSelect[] = [];
                    response.data.subGrupos.map((g: any) => {
                        dataSubGroups.push({value: g.id, label: g.nome})
                    });
                    setSubGroup(dataSubGroups);
                }
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

    async function saveUserGroup() {
        if(!selectedGroupValue || selectedGroupValue === ""){
            return toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage id={id} title="Grupo não especificado" description="Você deve selecionar um grupo da lista" action="error" onClose={()=>toast.close(id)} />
                )
            })
        }
        
        const groupFinded = Array.isArray(groups) ? groups.find(g => g.id === selectedGroupValue) : undefined;
        const subGroupFinded = Array.isArray(subGroups) ? subGroups.find(g => g.id === selectedSubGroupValue) : undefined;

        if(!groupFinded || groupFinded == undefined){
            return toast.show({
                placement: "top",
                render: ({ id }) => (
                    <ToastMessage id={id} title="Grupo não especificado" description="Esse grupo não esta especificado" action="error" onClose={()=>toast.close(id)} />
                )
            })
        }
        const url = `auth/trocar-filial?entidadeId=${groupFinded.entidadeId}${subGroupFinded ? '&filialId='+ subGroupFinded.filialId : ''}`;
        const response = await api.get(url, { 'headers': { 'Authorization': `Bearer ${user.accessToken}` } });
        if(response.data){
            const {accessToken, expiresIn, refreshToken} = response.data
            await updateProfileAndPermissions({
                ...user,
                entidadeId: groupFinded.entidadeId,
                dominio: groupFinded.dominio,
                hasSetGroup: true,
                accessToken: accessToken,
                refreshToken: expiresIn,
                expiresIn: refreshToken,
            })
        }
        setShowModal(false);
        getUserPoints();
    }

    async function getUserPoints() {
        try{
            setIsLoading(true);
            const response = await api.get(`/inventario?dataFinal=${dataFinal}&dataInicial=${dataInicial}&pageSize=50`, { 'headers': { 'Authorization': `Bearer ${user.accessToken}` } });
           if(response.data && response.data.list){
            setPoints(response.data.list);
           }
        }catch(e){
            console.log('Erro: ', e)
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao resgatar grupos" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        }finally{
            setIsLoading(false);
        }
    }

    function handleValueGroupChange(value: string){
        setSelectedGroupValue(value);
    }

    function handleValueSubGroupChange(value: string){
        setSelectedSubGroupValue(value);
    }

    async function confirmDelete(id: any){
        Alert.alert(
        'Aviso!',
        'Você deseja deletar esse apontamento?',
        [
            {
            text: 'Cancelar',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
            },
            {text: 'OK', onPress: () => handleDelete(id)},
        ],
        {cancelable: false},
        );
    }

    async function handleDelete(id: number) {
        try {
            console.log('Deletando id: ', id);
            
            await api.delete(`/inventario/${id}`, {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            });

            setPoints(prev =>
                prev.filter(point => point.id !== id)
            );

            toast.show({
                placement: "top",
                render: ({ id: toastId }) => (
                    <ToastMessage
                    id={toastId}
                    title="Apontamento deletado"
                    description="O apontamento foi removido com sucesso."
                    action="success"
                    onClose={() => toast.close(toastId)}
                    />
                )
            });

        } catch (e) {
            console.log('Erro ao deletar: ', e);

            if (axios.isAxiosError(e)) {
            return toast.show({
                placement: "top",
                render: ({ id: toastId }) => (
                <ToastMessage
                    id={toastId}
                    title="Erro ao deletar"
                    description={e.response?.data?.errors?.[0] || 'Não foi possível excluir o apontamento.'}
                    action="error"
                    onClose={() => toast.close(toastId)}
                />
                )
            });
            }
        }
    }

    useEffect(() => {
        if(user && user.hasSetGroup){
            getUserPoints();
        } else {
            getUserGroups();
        }
    }, []);

    useFocusEffect(useCallback(() => {
        if(user && user.hasSetGroup){
            getUserPoints();
        }
    }, [route.params?.refresh, groupSelected]))

    return (
        <VStack flex={1}>
            <HomeHeader />

            {/* <FlatList 
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
            /> */}
            {isLoading ? <Loading /> :
                <VStack mt="$5" px="$8" flex={1}>
                    <HStack justifyContent="space-between" mb="$5" alignItems="center">
                        <Heading color="white" fontSize="$md" fontFamily="$heading">Apontamentos</Heading>
                        <Text color="white" fontSize="$sm" fontFamily="$body">{points.length}</Text>
                    </HStack>

                    <Modal showModal={showModal} onCloseModal={() => saveUserGroup()}>
                        <Text color="balck" fontSize="$sm" fontFamily="$body" mt="$5">Selecione um Grupo</Text>
                        <Select defaultValue={selectedGroupValue || ""} onValueChange={handleValueGroupChange} data={group}/>
                        {subGroup.length > 1 &&
                            <>
                                <Text color="balck" fontSize="$sm" fontFamily="$body" mt="$5">Selecione um Sub Grupo</Text>
                                <Select defaultValue={selectedSubGroupValue || ""} onValueChange={handleValueSubGroupChange} data={subGroup}/>
                            </>
                        }
                    </Modal>
                    <FlatList 
                        data={points} 
                        keyExtractor={ item => item.id.toString()}
                        renderItem={({ item }) => (
                            <PointCard data={item} onPress={() => handleOpenExcerciseDetails(item.id)} onDelete={() => confirmDelete(item.id)}/>
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10}}
                        ListEmptyComponent={() => (
                            <Text color="white" fontSize="$sm" fontFamily="$body">
                                Parece que você ainda nao tem apontamentos cadastrados.
                                Você pode estar adicionando novos apontamentos clicando no
                                botão abaixo.
                            </Text>
                        )}
                    />
                </VStack>
            }
            <VStack px="$8" pt="$4" pb="$4">
                <Button title="Adicionar Apontamento" variant="solid" onPress={() => handleOpenCreatePoint()} />
            </VStack>
        </VStack>
    )
}