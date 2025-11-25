import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '@services/api';
import * as yup from 'yup';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/Button';
import { HomeHeader } from '@components/HomeHeader';
import { DataSelect, Select } from '@components/Select';
import { Input } from "@components/Input";
import { Center, Heading, HStack, Text, VStack, useToast } from '@gluestack-ui/themed';
import { ToastMessage } from '@components/ToastMessage';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Dimensions } from 'react-native';
import moment from "moment";
import 'moment/locale/pt-br';

type FormDataProps = {
    tipoApontamento: string;
    dataMatricula: string;
    matricula: string;
    codigo: string
};

const defaultPoint = [
    {value: "1", label: "Maquina"},
    {value: "2", label: "Deposito"},
    {value: "3", label: "Expedição"},
    {value: "4", label: "Recebimento"},
    {value: "10", label: "Outro"},
];

const pointUpSchema = yup.object({
    tipoApontamento: yup.string().required("Informe o tipo do apontamento"),
    dataMatricula: yup.string().required("Informe a data da matriculas"),
    matricula: yup.string().required("Informe a matricula"),
});

function getCurrentDateFormatted() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // mês começa do 0
  const year = String(now.getFullYear()).slice(2); // últimos dois dígitos
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function CreatePoint(){
    const { user } = useAuth();
    const dataAgora =  moment().format('DD/M/YYYY HH:mm');
    const dataAtual =  moment().format('YYYY-MM-DDTHH:mm:ss');
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const toast = useToast();
    const { control, handleSubmit, formState: { errors }, watch, reset  } = useForm<FormDataProps>({
            resolver: yupResolver(pointUpSchema),
            defaultValues: {
                dataMatricula: dataAgora,
            }
    });
    const tipoSelecionado = watch("tipoApontamento");
    const [load, setLoad] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [dataMatriculas, setDataMatriculas] = useState([]);
    const [dataComplete, setDataComplete] = useState([]);
    const [dataDepositos, setDataDepositos] = useState([]);
    const [dropdownKey, setDropdownKey] = useState(0);
    const [maquinaProps, setMaquinaProps] = useState({
        maquinaId: '',
        matricula: '',
        modeloMaquina: '' 
    });
    const [depositoProps, setDepositoProps] = useState({
        depositoId: '',
        codigoDeposito: '',
        nomeDeposito: '' 
    });

    function resetForm() {
        reset({
            tipoApontamento: '',
            dataMatricula: moment().format('DD/M/YYYY HH:mm'),
            matricula: '',
            codigo: ''
        });

        setMaquinaProps({
            maquinaId: '',
            matricula: '',
            modeloMaquina: '' 
        });

        setDepositoProps({
            depositoId: '',
            codigoDeposito: '',
            nomeDeposito: '' 
        });

        setDataMatriculas([]);
        setDataDepositos([]);
        setDataComplete([]);
        setDropdownKey((prev) => prev + 1);
    }


    function handleBackToPointList(){
        navigation.navigate("points");
    }

    function handleCompleteByType(text: string){
        if(tipoSelecionado === "1"){
            return getMatriculaMaquina(text);
        }
        getMatriculaDeposito(text);
    }

    async function getMatriculaMaquina(text: string){
        try{
            let matriculas_lista = [];
            if(text.length >= 3){
                setLoading(true);
                api.defaults.headers.Authorization = `Bearer ${user.accessToken}`;
                const response = await api.get('/maquina?search='+text.toUpperCase());
                setDataMatriculas(response.data.list);
                for (let i = 0; i < response.data.list.length; i++ ){
                    matriculas_lista.push({id: response.data.list[i].id, title: response.data.list[i].matricula +" - "+response.data.list[i].modelo});
                }
                setDataComplete(matriculas_lista);
                setLoading(false);
            }
    } catch(e){
            setLoad(false);
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao buscar matrícula" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } 
    }

    async function getMatriculaDeposito(text: string){
        try{
            let deposito_lista = [];
            if(text.length >= 3){
                setLoading(true);
                api.defaults.headers.Authorization = `Bearer ${user.accessToken}`;
                const response = await api.get('/deposito?search='+text.toUpperCase());
                console.log('Dados: ', response.data);
                setDataDepositos(response.data.list);
                for (let i = 0; i < response.data.list.length; i++ ){
                     deposito_lista.push({id: response.data.list[i].id, title: response.data.list[i].codigo +" - " + response.data.list[i].descricao});
                }
                setDataComplete(deposito_lista);
                setLoading(false);
            }
    } catch(e){
            setLoad(false);
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao buscar matrícula" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } 
    }

    function handleMatriculaSelect(item: { id: string; title: string } | null, onChange: (value: string) => void) {
        if(!item) return;
        if(tipoSelecionado == "1"){
            const matriculaFiltered = dataMatriculas.filter(function (el: any) {
                return el.id == item.id;
            });
            setMaquinaProps({
                maquinaId: matriculaFiltered[0].matricula,
                matricula: item.id,
                modeloMaquina: matriculaFiltered[0].modelo
            })
        }else{
            const depositoFiltered = dataDepositos.filter(function (el: any) {
                return el.id == item.id;
            });
            setDepositoProps({
                codigoDeposito: depositoFiltered[0].codigo,
                depositoId: item.id,
                nomeDeposito: depositoFiltered[0].descricao
            })
        }


        if (item) {
            onChange(item.title);
        } else {
            onChange("");
        }
    }

    async function handlePoint({ tipoApontamento, codigo }: FormDataProps){
        try{
            setLoad(true);
            const response = await api.post('/inventario', {
                dataApontamento:dataAtual,
                dataRegistro:dataAtual,
                tipoApontamento,
                ...maquinaProps,
                ...depositoProps,
                codigo,
                latitude: 0,
                longitude: 0
            })
            setLoad(false);
            resetForm();
            return toast.show({
                placement: "top",
                duration: 2000,
                render: ({ id }) => (
                    <ToastMessage id={id} title="Sucesso" description="Apontamento criado com sucesso!" action="success" onClose={()=>navigation.navigate("points")} />
                ),
                onCloseComplete() {
                    navigation.navigate("points")
                },
            })
        } catch(e){
            console.log(e)
            setLoad(false);
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    duration: 2000,
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao realizar o apontamento" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } 
    }

    useEffect(() => {
        if (tipoSelecionado) {
            console.log("Tipo selecionado agora:", tipoSelecionado);
        }
    }, [tipoSelecionado]);

    useEffect(() => {
        console.log("Erros encontrados:", errors);
    }, [errors]);

    return (
        <VStack flex={1}>
            <HomeHeader />
            <VStack pt="$100" px="$8" flex={1}>
                <HStack justifyContent="space-between" mb="$5" alignItems="center">
                    <Heading color="white" fontSize="$md" fontFamily="$heading">Adicionar Novo Apontamento</Heading>
                </HStack>
                    <Center gap="$2">
                        <Controller 
                            control={control} 
                            name="tipoApontamento"
                            render={({ field: { onChange, value }}) => (
                                <Select defaultValue="" onValueChange={onChange} data={defaultPoint}/>
                            )}
                        />
                        <Controller 
                            control={control} 
                            name="dataMatricula"
                            render={({ field: { onChange, value }}) => (
                                <Input placeholder="Data:" value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.dataMatricula?.message}/>
                            )}
                        />
                        
                        {tipoSelecionado == "1" || tipoSelecionado == "2" ? (
                            <Center mb="$4">
                                <Controller 
                                    control={control} 
                                    name="matricula"
                                    render={({ field: { onChange, value }}) => (
                                        <AutocompleteDropdown
                                            key={dropdownKey}
                                            clearOnFocus={false}
                                            closeOnBlur={true}
                                            closeOnSubmit={false}
                                            onChangeText={handleCompleteByType}
                                            onSelectItem={(item) => handleMatriculaSelect(item, onChange)}
                                            textInputProps={{
                                                placeholder: "Digite a Matrícula",
                                                autoCorrect: false,
                                                autoCapitalize: "none",
                                                style: {
                                                    backgroundColor: '#fff',
                                                    paddingLeft: 18,
                                                    width: Dimensions.get('window').height * 0.35,
                                                    height: 50,
                                                },
                                            }}
                                            rightButtonsContainerStyle={{
                                                right: 0,
                                                height: 30,
                                                width: 50,
                                                alignSelf: 'center',
                                            }}
                                            dataSet={dataComplete}
                                        />
                                    )}
                                />
                            </Center>
                        ): (
                            <Controller 
                                control={control} 
                                name="codigo"
                                render={({ field: { onChange, value }}) => (
                                    <Input placeholder="Código:" value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.matricula?.message}/>
                                )}
                            />
                        )}

                        <Button title="Criar Apontamento" mb="$3" variant="solid" onPress={handleSubmit(handlePoint)} />
                        <Button title="Voltar" variant="solid" onPress={() => handleBackToPointList()} />
                    </Center>
            </VStack>
        </VStack>
    )
}