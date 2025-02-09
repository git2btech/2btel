import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { Image,ScrollView,Picker,Alert } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { RNCamera } from 'react-native-camera';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import { Container, Form, FormInput, SubmitButton, Intro, IconTouch } from './styles';
import api from '../../../services/api';
import moment from "moment";
import 'moment/locale/pt-br';

export default function CriarApontamento({ navigation }) {
   const cameraRef = useRef();
   const dataAgora =  moment().format('DD/M/YYYY HH:mm');
   const dataAtual =  moment().format('YYYY-MM-DDTHH:mm:ss');
   const [tipoApontamento,settTpoApontamento] = useState('1');
   const [dataApontamento,setDataApontamento] = useState(dataAgora);
   const [loading, setLoading] = useState(false);
   const [activeCamera, setActiveCamera] = useState(false);
   const [dataMatricula, setDataMatricula] = useState([]);
   const [dataDeposito, setDataDeposito] = useState([]);
   const [dataMatriculas, setDataMatriculas] = useState([]);
   const [dataDepositos, setDataDepositos] = useState([]);
   const [items, setItems] = useState([]);
   const [apontamento, setApontamento] = useState('');
   const [matricula,setMatricula] = useState('');
   const [maquinaId,setMaquinaId] = useState('');
   const [chapa,setChapa] = useState('');
   const [modeloMaquina,setModeloMaquina] = useState('');
   const [depositoId,setDepositoId] = useState('');
   const [codigoDeposito,setCodigoDeposito] = useState('');
   const [nomeDeposito,setNomeDeposito] = useState('');
   const [codigo, setCodigo] = useState('');
   const token = useSelector(state=> state.auth.token);
   api.defaults.headers.Authorization = `Bearer ${token}`;
   const coords = navigation.getParam('coords');
   console.log('Dados de cordenada: ', coords);

  async function getMatricula(text){
    console.log(text);
    let matriculas_lista = [];
    if(text.length >= 3){
      setLoading(true);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get('/v1/maquina?search='+text.toUpperCase());
      setDataMatriculas(response.data.list);
      for (let i = 0; i < response.data.list.length; i++ ){
        matriculas_lista.push({id: response.data.list[i].id, title: response.data.list[i].matricula +" - "+response.data.list[i].modelo});
      }
      setDataMatricula(matriculas_lista);
      setLoading(false);
    }
  }

  async function getDeposito(text){
    let deposito_lista = [];
    if(text.length >= 3){
      setLoading(true);
      const response = await api.get('/v1/deposito?search='+text.toUpperCase());
      console.log('Retorno: ', response.data);
      setDataDepositos(response.data.list);
      for (let i = 0; i < response.data.list.length; i++ ){
        deposito_lista.push({id: response.data.list[i].id, title: response.data.list[i].codigo +" - " + response.data.list[i].descricao});
      }
      setDataDeposito(deposito_lista);
      setLoading(false);
    }
  }

  function setDataMatriculaField(item){
    console.log('item: ',item);
    const matriculaFiltered = dataMatriculas.filter(function (el) {
      return el.id == item.id;
    });
    console.log(matriculaFiltered);
    if(!matriculaFiltered) return
    setMatricula(matriculaFiltered[0].matricula);
    setMaquinaId(item.id);
    setModeloMaquina(matriculaFiltered[0].modelo);
  }

  function setDataDepositoField(item){
    console.log('item: ',item);
    const depositoFiltered = dataDepositos.filter(function (el) {
      return el.id == item.id;
    });
    console.log(depositoFiltered);
    if(!depositoFiltered) return
    setCodigoDeposito(depositoFiltered[0].codigo);
    setDepositoId(item.id);
    setNomeDeposito(depositoFiltered[0].descricao);
  }

  async function handleSubmit(){
    try{
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.post('/v1/inventario', {
        dataApontamento:dataAtual,
        tipoApontamento,
        maquinaId,
        matricula,
        modeloMaquina,
        depositoId,
        codigoDeposito,
        nomeDeposito,
        items,
        latitude: coords?.latitude || 0,
        longitude: coords?.longitude || 0
    });
      console.log(response.data);
      if(response.data){
        let apontamento_data = {
          id: response.data.id,
          data: response.data.dataApontamento,
          login: response.data.loginRegistro,
          tipo: response.data.tipoApontamento,
          matricula: response.data.matricula,
        };
        setApontamento(apontamento_data);
      }

    }catch(error){
      console.log(error);
      Alert.alert('Falha ao cadastrar o apontamento', error.response);
    }
  }

  useEffect(()=>{
    if(apontamento && apontamento.id) navigation.navigate("Apontamento",{apontamento: apontamento});
   },[apontamento]);

  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <>
        {!activeCamera &&
          <Form>
            <ScrollView>
            <Intro>Adicionar Apontamento</Intro>
            <Picker
                selectedValue={tipoApontamento}
                style={{backgroundColor:'rgba(0,0,0,0.1)',marginBottom:10,height: 44, color: '#fff'}}
                itemStyle={{height: 44}}
                onValueChange={settTpoApontamento}>
                <Picker.Item label="Maquina" value="1" />
                <Picker.Item label="Deposito" value="2" />
                <Picker.Item label="Expedição" value="3" />
                <Picker.Item label="Recebimento" value="4" />
                <Picker.Item label="Outro" value="10" />
              </Picker>
              <FormInput
                icon={'event'}
                keyboardCorrect={false}
                autoCapitalize="none"
                placeholder="Data do Inventário"
                value={dataApontamento}
                onChangeText={setDataApontamento}
              />

              {tipoApontamento == '1' &&
                  <AutocompleteDropdown
                      clearOnFocus={false}
                      closeOnBlur={false}
                      closeOnSubmit={false}
                      onSelectItem={(item) => {
                        item && setDataMatriculaField(item)
                      }}
                      onChangeText={getMatricula}
                      dataSet={dataMatricula}
                      debounce={600}
                      loading={loading}
                      useFilter={false}
                      textInputProps={{
                        placeholder: "Digite a Matrícula",
                        autoCorrect: false,
                        autoCapitalize: "none",
                        style: {
                          backgroundColor: "rgba(0,0,0,0.1)",
                          color: "#fff",
                          paddingLeft: 18,
                          marginBottom: 10,
                        }
                      }}
                      containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                      showClear={false}
                    />
              }


              {tipoApontamento == '2' &&
                  <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={false}
                    closeOnSubmit={false}
                    onSelectItem={(item) => {
                      item && setDataDepositoField(item)
                    }}
                    onChangeText={getDeposito}
                    dataSet={dataDeposito}
                    debounce={600}
                    loading={loading}
                    useFilter={false}
                    textInputProps={{
                      placeholder: "Digite o Código",
                      autoCorrect: false,
                      autoCapitalize: "none",
                      style: {
                        backgroundColor: "rgba(0,0,0,0.1)",
                        color: "#fff",
                        paddingLeft: 18,
                        marginBottom: 10,
                      }
                    }}
                  />
              }

              {tipoApontamento == '3' &&
                <>
                  <FormInput
                    icon={'archive'}
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Código"
                    value={codigo}
                    onChangeText={setCodigo}
                  />
                  {/* <IconTouch name={'camera'} size={20} onPress={()=>setActiveCamera(true)}/> */}
                </>
              }

              {tipoApontamento == '4' &&
                <>
                  <FormInput
                    icon={'archive'}
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Código"
                    value={codigo}
                    onChangeText={setCodigo}
                  />
                  {/* <IconTouch name={'camera'} size={20} onPress={()=>setActiveCamera(true)}/> */}
                </>
              }

              {tipoApontamento == '10' &&
                <>
                  <FormInput
                    icon={'archive'}
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Código"
                    value={codigo}
                    onChangeText={setCodigo}
                  />
                  {/* <IconTouch name={'camera'} size={20} onPress={()=>setActiveCamera(true)}/> */}
                </>
              }

              <SubmitButton onPress={handleSubmit}>
                Adicionar
              </SubmitButton>
              <SubmitButton onPress={()=>navigation.navigate("Inicial")}>
                Voltar
              </SubmitButton>
            </ScrollView>
          </Form>
        }
        {activeCamera &&

          <RNCamera
                ref={camera => { cameraRef }}
                captureAudio={false}
                style={{flex: 1,justifyContent: 'flex-end',alignItems: 'center', width: 10}}
                type={RNCamera.Constants.Type.back}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={RNCamera.Constants.FlashMode.off}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }}
                onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  if(barcodes[0].rawData !== null && barcodes[0].rawData !== undefined){
                    if(barcodes[0].rawData.length >= 8 && barcodes[0].rawData.length <= 20){
                      setChapa(barcodes[0].rawData);
                      setActiveCamera(false);
                    }
                  }
                }}
              />
        }
        </>
      </Container>
    </Background>
  );
}
