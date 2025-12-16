import { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, BarcodeScanningResult} from 'expo-camera';
import axios from 'axios';
import api from '@services/api';
import * as yup from 'yup';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/Button';
import { HomeHeader } from '@components/HomeHeader';
import { DataSelect, Select } from '@components/Select';
import { Input } from "@components/Input";
import { Center, Heading, HStack, Text, VStack, useToast, Pressable, Icon } from '@gluestack-ui/themed';
import { ToastMessage } from '@components/ToastMessage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import { PointsDTO } from '@dtos/PointsDTO';
import { ScanLine } from 'lucide-react-native';

type RouteParamsProps = {
    point: PointsDTO
}

type FormDataProps = {
    codigo: string;
    quantidade: string;
    chave?: string | null;
};

const defaultPoint = [
    {value: "1", label: "Maquina"},
    {value: "2", label: "Deposito"},
    {value: "3", label: "Expedição"},
    {value: "4", label: "Recebimento"},
    {value: "10", label: "Outro"},
];

const pointUpSchema = yup.object({
    codigo: yup.string().required("Informe o codigo do apontamento"),
    quantidade: yup.string().required("Informe a quantidade dos itens"),
    chave: yup.string().nullable().notRequired(),
});

export function CreatePointIten(){
    const { user } = useAuth();
    const route = useRoute();
    const { point } = route.params as RouteParamsProps;
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const toast = useToast();
    const { control, handleSubmit, formState: { errors }, reset, setValue  } = useForm<FormDataProps>({
            resolver: yupResolver(pointUpSchema)
    });
    const [loading, setLoading] = useState(false);
    const [dataProduto, setDataProduto] = useState([]);
    const [dataProdutos, setDataProdutos] = useState([]);
    const [produtoProps, setProdutoPros] = useState({
          produtoId: '',
          codigoProduto: '',
          NomeProduto: '',
    });
    const [hasOcOption, setHasOcOption] = useState(false);
    const [dropdownKey, setDropdownKey] = useState(0);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [dataEan, setDataEan] = useState({});
    const [eanEnabled, setEanEnabled] = useState(false);
    function handleBackToPointList(){
        navigation.navigate("pointsItens", {pointID: point.id})
    }

    function resetForm() {
        reset({
            codigo: '',
            quantidade: '',
            chave: '',
        });

        setProdutoPros({
            produtoId: '',
            codigoProduto: '',
            NomeProduto: '',
        });

        setDataProduto([]);
        setDataProdutos([]);
        setHasOcOption(false);
        setDropdownKey((prev) => prev + 1);
        setEanEnabled(false);
        setDataEan({});
    }


    async function getProduto(text: string){
        console.log(text);
        let matriculas_lista = [];
        if(text.length >= 3){
            setLoading(true);
            api.defaults.headers.Authorization = `Bearer ${user.accessToken}`;
            const response = await api.get('/produto?search='+text.toUpperCase());
            setDataProdutos(response.data.list);
            for (let i = 0; i < response.data.list.length; i++ ){
                if(response.data.list[i].DescricaoSubCategoria !== "FAMILIA"){
                matriculas_lista.push({
                    id: response.data.list[i].id, 
                    title: response.data.list[i].codigo+" - "+response.data.list[i].descricao,
                });
                }
            }
            setDataProduto(matriculas_lista);
            setLoading(false);
        }
    }

    async function getProdutoByEan(text: string){
        console.log(text, text.length);
        try{
            if(text.length >= 3){
                setLoading(true);
                api.defaults.headers.Authorization = `Bearer ${user.accessToken}`;
                const response = await api.get('/produto?search='+text.toUpperCase());
                for (let i = 0; i < response.data.list.length; i++ ){
                    setDataEan({
                        id: response.data.list[i].id, 
                        title: response.data.list[i].codigo+" - "+response.data.list[i].descricao,
                    });
                    setProdutoPros({
                        produtoId: response.data.list[i].id,
                        codigoProduto: response.data.list[i].codigo,
                        NomeProduto: response.data.list[i].codigo+" - "+response.data.list[i].descricao,
                    });
                }
                setEanEnabled(true);
                setLoading(false);
            }
        } catch(e){
            console.log('Erro: ',e);
            console.log('Erro: ',e.response?.data);
            console.log('Erro: ',e.response?.data?.errors);
            setLoading(false);
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    duration: 1000,
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao criar o item do apontamento" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } 
    }

    async function handlePointIten({ quantidade, chave}: FormDataProps){
        try{
            setLoading(true);
            const response = await api.post(`/inventario/${point.id}}/item`, {
                apontamentoId: point.id,
                ...produtoProps,
                quantidade,
                codigoChave: chave
            })
            setLoading(false);
            resetForm();
            return toast.show({
                placement: "top",
                duration: 1000,
                render: ({ id }) => (
                    <ToastMessage id={id} title="Sucesso" description="Apontamento criado com sucesso!" action="success" onClose={()=>navigation.navigate("pointsItens", {pointID: point.id})} />
                ),
                onCloseComplete() {
                    navigation.navigate("pointsItens", {pointID: point.id})
                },
            })
        } catch(e){
            console.log(e.response?.data?.errors);
            setLoading(false);
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    duration: 1000,
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao criar o item do apontamento" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } 
    }

    function handleProductSelect(item: { id: string; title: string } | null, onChange: (value: string) => void) {
        if(!item) return;
        const produtoFiltered = dataProdutos.filter(function (el: any) {
            return el.id == item.id;
        });
        setProdutoPros({
            codigoProduto: produtoFiltered[0].codigo,
            produtoId: item.id,
            NomeProduto: produtoFiltered[0].descricao
        })
        if (item) {
            onChange(item.title);
        } else {
            onChange("");
        }
    }

    async function openScanner() {
        const { status } = await requestPermission();

        if (status !== 'granted') {
            toast.show({
            placement: 'top',
            render: ({ id }) => (
                <ToastMessage
                id={id}
                title="Permissão negada"
                description="Autorize o acesso à câmera para ler o código de barras."
                action="error"
                onClose={() => toast.close(id)}
                />
            ),
            });
            return;
        }

        setIsScanning(true);
        setCameraVisible(true);
    }

    async function handleBarcodeScanned({ data }: BarcodeScanningResult) {
        if (!isScanning) return;

        setIsScanning(false);
        setCameraVisible(false);

        setValue('codigo', data);

        try {
            await getProdutoByEan(data);
        } catch (error) {

        }
    }


    useEffect(()=>{
        switch(point.tipoApontamento){
          case "Expedição":
            getProduto('EXP001');
          break;
          case "Recebimento":
            getProduto('REC001');
          break;
        }
    },[point.tipoApontamento])
    
    useEffect(()=>{
    if(produtoProps.NomeProduto.includes("OC")){
        setHasOcOption(true);
    }
    },[produtoProps.NomeProduto])

    if (cameraVisible) {
        return (
            <Modal
                visible={cameraVisible}
                animationType="fade"
                transparent={false}
                onRequestClose={() => {
                    setCameraVisible(false);
                    setIsScanning(false);
                }}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        // barcodeScannerSettings={{
                        //     barcodeTypes: ['ean13', 'ean8'],
                        // }}
                        onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
                    />

                    <VStack
                        position="absolute"
                        left={0}
                        right={0}
                        bottom={0}
                        p="$4"
                        bg="rgba(0,0,0,0.6)"
                        space="md"
                    >
                        <Text color="$white" textAlign="center">
                        Aponte a câmera para o código de barras EAN
                        </Text>

                        <Button
                            bg="$red500"
                            title="Cancelar"
                            onPress={() => {
                                setCameraVisible(false);
                                setIsScanning(false);
                            }}
                        />
                    </VStack>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <VStack flex={1}>
            <HomeHeader />
            <VStack pt="$10" px="$8" flex={1}>
                <HStack justifyContent="space-between" mb="$5" alignItems="center">
                    <Heading color="white" fontSize="$md" fontFamily="$heading">Adicionar Itens ao Apontamento</Heading>
                </HStack>
                    <Center gap="$2">
                        <Center mb="$4">
                           {eanEnabled ? (
                                <Text color="white">Produto: {dataEan?.title}</Text>
                            ): (
                                <Controller 
                                    control={control} 
                                    name="codigo"
                                    render={({ field: { onChange, value }}) => (
                                        <AutocompleteDropdown
                                            key={dropdownKey}
                                            clearOnFocus={false}
                                            closeOnBlur={true}
                                            closeOnSubmit={false}
                                            onChangeText={getProduto}
                                            onSelectItem={(item) => handleProductSelect(item, onChange)}
                                            textInputProps={{
                                                placeholder: "Digite o código do produto",
                                                autoCorrect: false,
                                                autoCapitalize: "none",
                                                style: {
                                                    backgroundColor: '#fff',
                                                    paddingLeft: 18,
                                                    width: Dimensions.get('window').height * 0.33,
                                                    height: 50,
                                                },
                                            }}
                                            rightButtonsContainerStyle={{
                                                right: 0,
                                                height: 30,
                                                width: 50,
                                                alignSelf: 'center',
                                            }}
                                            dataSet={dataProduto}
                                        />
                                    )}
                                />
                            )}
                        </Center>
                        <Controller 
                            control={control} 
                            name="quantidade"
                            render={({ field: { onChange, value }}) => (
                                <Input placeholder="Quantidade" value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.quantidade?.message}/>
                            )}
                        />
                        <Controller 
                            control={control} 
                            name="chave"
                            render={({ field: { onChange, value }}) => (
                                <Input placeholder="Chave" value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.chave?.message}/>
                            )}
                        />
                        <Button title={loading ? "Aguarde..." : "Ler EAN"} mb="$3" variant="solid" onPress={() => openScanner()} disabled={loading} />
                        <Button title={loading ? "Aguarde..." : "Adicionar Item"} mb="$3" variant="solid" onPress={handleSubmit(handlePointIten)} disabled={loading} />
                        <Button title="Voltar" variant="solid" onPress={() => handleBackToPointList()}/>
                    </Center>
            </VStack>
        </VStack>
    )
}