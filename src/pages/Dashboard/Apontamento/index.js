import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image,ScrollView,Alert } from 'react-native';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import api from '../../../services/api';
import Produtos from '../../../components/Produtos';
import { Container, Content, SubmitButton, List,ContentTitle,ContentText } from './styles';
import {} from '../ApontamentoItem/styles';

export default function Apontamento({ navigation }) {
  const apontamentoData = navigation.getParam('apontamento');
  const token = useSelector(state=> state.auth.token);
  const user = useSelector(state => state.user.profile);
  const [inventario, setInventario] = useState([]);
 
  function getTipo(type){
    let tipo = '';
    switch(type){
      case 1:
        tipo = 'Maquina';
      break;
      case 2:
          tipo = 'Depósito';
      break;
      case 3:
          tipo = 'Expedição';
      break;
      case 4:
          tipo = 'Recebimento';
      break;
      case 5:
          tipo = 'Producao';
      break;
      case 6:
          tipo = 'Qualidade';
      break;
      case 7:
          tipo = 'OrdemServico';
      break;
      case 8:
          tipo = 'Scrap';
      break;
      case 9:
          tipo = 'Recon';
      break;
      case 10:
          tipo = 'Outros';
      break;
      case 11:
        tipo = 'Compras';
      break;
    }
    return tipo;
  }

  useEffect(()=>{
    getItens();
  },[]);

  async function getItens(){
    let inventario_lista = [];
    api.defaults.headers.Authorization = `Bearer ${token}`;
    console.log('Id do apontamento: ', apontamentoData.id)
    const response = await api.get('/api/v1/inventario/'+apontamentoData.id+'/item');
    
    console.log('Veio isso: ', response.data);
    if(response.data.List.length > 0){
      for (let i = 0; i < response.data.List.length; i++){
        inventario_lista.push({
          id: response.data.List[i].Id,
          codigoProduto: response.data.List[i].CodigoProduto,
          numeroSelecao: response.data.List[i].NumeroSelecao,
          nomeProduto: response.data.List[i].NomeProduto,
          quantidade: response.data.List[i].Quantidade,
          loginRegistro: response.data.LoginRegistro,
        });
      }
      inventario_lista.sort((a,b) => b.id - a.id);
    }
    setInventario(inventario_lista);
  }

  async function confirmDelete(id){
    Alert.alert(
      'Aviso!',
      'Você deseja deletar esse apontamento?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleDelet(id)},
      ],
      {cancelable: false},
    );
  }

  async function handleDelet(id){
    setInventario(
      inventario.filter(inventario =>inventario.id !== id)
    );
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.delete(`api/v1/inventario/${apontamentoData.id}/item/${id}`);
    console.log(response.data);
  }

  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Content>
          <ScrollView>
            <ContentText>Tipo: {getTipo(apontamentoData.tipo)}</ContentText>
            <ContentText>Data: {apontamentoData.data}</ContentText>
            <ContentTitle>Itens Cadastrados</ContentTitle>
            <ScrollView style={{height: 200}}>
              <List
                data={inventario}
                keyExtractor={item=>String(item.id)}
                //renderItem={({ item }) => <Produtos onCancel={()=> null} data={item} userData={user}/> }
                renderItem={({ item }) => <Produtos onCancel={()=> confirmDelete(item.id)} data={item} userData={user}/> }
              />
            </ScrollView>
            <SubmitButton onPress={()=>navigation.navigate("ApontamentoItem",{apontamentoData:apontamentoData})}>
              Escanear Item
            </SubmitButton>
            <SubmitButton onPress={()=>navigation.navigate("ApontamentoItem",{apontamentoData:apontamentoData})}>
              Adicionar Item
            </SubmitButton>
            <SubmitButton onPress={() => navigation.navigate('Apontamentos')}>
              Voltar
            </SubmitButton>
          </ScrollView>
        </Content>
      </Container>
    </Background>
  );
}
