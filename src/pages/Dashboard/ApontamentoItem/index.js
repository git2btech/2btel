import React, { useState,useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { Image,Alert } from 'react-native';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { RNCamera } from 'react-native-camera';
import api from '../../../services/api';
import { Container, Form, FormInput, SubmitButton,Intro,IconTouch, Title, BackButton } from './styles';

export default function Apontamento({ navigation }) {
   const cameraRef = useRef();
   const apontamentoData = navigation.getParam('apontamentoData');
   const [codigoProduto,setCodigoProduto] = useState('');
   const [nomeProduto,setNomeProduto] = useState('');
   const [produtoId,setProdutoId] = useState('');
   const [quantidade,setQuantidade] = useState('');
   const [numeroSelecao,setNumeroSelecao] = useState('');
   const [loading, setLoading] = useState(false);
   const [dataProduto, setDataProduto] = useState([]);
   const [dataProdutos, setDataProdutos] = useState([]);
   const [codigoChave, setCodigoChave]  = useState('');
   const [activeCamera, setActiveCamera] = useState(false);
   const [scanOption, setScanOption] = useState('');
   const [hasOcOption, setHasOcOption] = useState(false);
   const [eanEnabled, setEanEnabled] = useState(false);
   const [dataEan, setDataEan] = useState({});
   const token = useSelector(state=> state.auth.token);
   api.defaults.headers.Authorization = `Bearer ${token}`;

   async function getProduto(text){
    console.log(text);
    let matriculas_lista = [];
    if(text.length >= 3){
      setLoading(true);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get('/v1/produto?search='+text.toUpperCase());
      console.log('Veio isso: ',response.data.list);
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

  async function getProdutoByEan(text){
    if(text.length >= 3){
      console.log('Veio isso: ', text);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get('/v1/produto?search='+text.toUpperCase());
      console.log('Veio isso: ', response.data.list);
      for (let i = 0; i < response.data.list.length; i++ ){
       setDataEan({
          id: response.data.list[i].id, 
          title: response.data.list[i].codigo+" - "+response.data.list[i].descricao,
        });
        setCodigoProduto(response.data.list[i].codigo);
        setProdutoId(response.data.list[i].id);
        setNomeProduto(response.data.list[i].codigo+" - "+response.data.list[i].descricao);
      }
      setEanEnabled(true);
      setActiveCamera(false);
    }
  }

  function setDataProdutoField(item){
    const produtoFiltered = dataProdutos.filter(function (el) {
      return el.id == item.id;
    });
    setCodigoProduto(produtoFiltered[0].codigo);
    setProdutoId(item.id);
    setNomeProduto(item.title);
  }

  function setChaveField(item){
    const chaveFiltered = dataProdutos.filter(function (el) {
      return el.id == item.id;
    });
    setCodigoChave(item.title);
  }


    async function handleSubmit(){
      try {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await api.post('/v1/inventario/'+apontamentoData.id+'/item', {
          apontamentoId: apontamentoData.id,
          produtoId,
          codigoProduto,
          nomeProduto,
          quantidade,
          numeroSelecao,
          codigoChave,
        });
        if(!response.data) navigation.navigate("Apontamento",{apontamento: apontamentoData});
        Alert.alert(
          'Apontamento Cadastrado', 
          'Seu apontamento foi criado com sucesso clique em ok para ser redirecionado para lista de apontamentos', [
          {text: 'OK', onPress: () => navigation.navigate("Apontamento",{apontamento: apontamentoData})},
        ]);
      }catch(error){
        console.log(error);
      }
  }

  function initScan(type){
    setScanOption(type);
    setActiveCamera(true);
  }

  function getScanData(barcodesData){
    console.log('scanOption',scanOption);
    if(scanOption === 'chave'){
      getProdutoByEan(barcodesData);
    }else{
      const data = JSON.parse(barcodesData)
      console.log('Entrou aqui: ', data)
      setCodigoProduto(data.codigoProduto);
      setProdutoId(data.produtoId);
      setNomeProduto(`${data.codigoProduto} - ${data.nomeProduto}`);
      setQuantidade(data.quantidade);
      setActiveCamera(false);
    }
    
  }

  useEffect(()=>{
    switch(apontamentoData.tipo){
      case 3:
        getProduto('EXP001');
      break;
      case 4:
        getProduto('REC001');
      break;
    }
 },[])

 useEffect(()=>{
  if(nomeProduto.includes("OC")){
    setHasOcOption(true);
  }
},[nomeProduto])

 

  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <>
        {!activeCamera &&
          <Form>
            <Intro>Adicionar Item</Intro>
            {eanEnabled &&
              <Title>Produto: {dataEan?.title}</Title>
            }
            {scanOption !== 'produto' && !eanEnabled &&
              <AutocompleteDropdown
                      clearOnFocus={false}
                      closeOnBlur={false}
                      closeOnSubmit={false}
                      onSelectItem={(item) => {
                        item && setDataProdutoField(item)
                      }}
                      onChangeText={getProduto}
                      dataSet={dataProduto}
                      debounce={600}
                      loading={loading}
                      useFilter={false}
                      textInputProps={{
                        placeholder: "Digite o código do produto",
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
              {scanOption === 'produto' && 
                  <FormInput
                    icon={'filter-1'}
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Quantidade"
                    value={nomeProduto}
                    editable={false}
                  />
              }
              <FormInput
                icon={'filter-1'}
                keyboardCorrect={false}
                autoCapitalize="none"
                placeholder="Quantidade"
                value={quantidade}
                onChangeText={setQuantidade}
              />
              {scanOption !== 'produto' && !hasOcOption ? (
                  <>
                  <FormInput
                      keyboardCorrect={false}
                      autoCapitalize="none"
                      placeholder="Chave (use o ícone para escanear)"
                      value={codigoChave}
                      onChangeText={setCodigoChave}
                    />
                  <IconTouch name={'camera'} size={30} onPress={()=>initScan('chave')}/>
                  </>
                ) : (
                  <AutocompleteDropdown
                      clearOnFocus={false}
                      closeOnBlur={false}
                      closeOnSubmit={false}
                      onSelectItem={(item) => {
                        item && setChaveField(item)
                      }}
                      onChangeText={getProduto}
                      dataSet={dataProduto}
                      debounce={600}
                      loading={loading}
                      useFilter={false}
                      textInputProps={{
                        placeholder: "Digite o código chave",
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
                )
              }
              {apontamentoData.tipo == 1 &&
                  <FormInput
                    icon={'filter-1'}
                    keyboardCorrect={false}
                    autoCapitalize="none"
                    placeholder="Seleção"
                    value={numeroSelecao}
                    onChangeText={setNumeroSelecao}
                  />
              }
              <SubmitButton onPress={handleSubmit}>
                Adicionar
              </SubmitButton>
              <SubmitButton onPress={()=>initScan('produto')}>
                Adicionar por QrCode
              </SubmitButton>
              <SubmitButton onPress={()=>navigation.navigate("Apontamentos")}>
                Voltar
              </SubmitButton>
          </Form>
        }

        {activeCamera &&
          <>
            <RNCamera
              ref={camera => { cameraRef }}
              captureAudio={false}
              style={{width: '90%', height: '65%'}}
              type={RNCamera.Constants.Type.back}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              flashMode={RNCamera.Constants.FlashMode.off}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              onBarCodeRead={(barcodes) => {
                if(barcodes.data !== null && barcodes.data !== undefined){
                    getScanData(barcodes.data)
                 }
                }
              }
            />
            <BackButton onPress={()=>setActiveCamera(false)}>
              Voltar
            </BackButton>
          </>
        }
      </>
      </Container>
    </Background>
  );
}
