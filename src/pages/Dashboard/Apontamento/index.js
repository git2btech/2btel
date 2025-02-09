import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image, ScrollView, Alert, CheckBox, View } from 'react-native';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import api from '../../../services/api';
import Produtos from '../../../components/Produtos';
import { Container, Content, SubmitButton, List,ContentTitle,ContentText, ItemCard } from './styles';

export default function Apontamento({ navigation }) {
  const apontamentoData = navigation.getParam('apontamento');
  const token = useSelector(state=> state.auth.token);
  const user = useSelector(state => state.user.profile);
  const [inventario, setInventario] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
 
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
    console.log(apontamentoData)
    getItens();
  },[]);

  async function getItens(){
    try{
      let inventario_lista = [];
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await api.get(`/v1/inventario/${apontamentoData.id}`);
      if(response.data && response.data.items.length > 0){
          const hasValidItems = response.data.items.some(item => item !== null);
          if(hasValidItems){
            for (let i = 0; i < response.data.items.length; i++){
              inventario_lista.push({
                id: response.data.items[i].id,
                codigoProduto: response.data.items[i].codigoProduto,
                numeroSelecao: response.data.items[i].numeroSelecao,
                nomeProduto: response.data.items[i].nomeProduto,
                quantidade: response.data.items[i].quantidade,
                loginRegistro: response.data.loginRegistro,
              });
          }
      }
        inventario_lista.sort((a,b) => b.id - a.id);
      }
      setInventario(inventario_lista);
    }catch (err) {
      console.log('Erro: ', err);
    }
  }

  const toggleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

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

  async function handleDelete(id){
    console.log('Itens selecionados: ', id);
    setInventario(
      inventario.filter(inventario =>inventario.id !== id)
    );
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.delete(`/v1/inventario-item/${id}`);
    console.log(response.data);
  }

  async function handleMassDelete() {
    
    Alert.alert(
      'Aviso!',
      'Você deseja deletar os itens selecionados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'OK', onPress: async () => {
          for (const id of selectedItems) {
            await handleDelete(id);
          }
          setSelectedItems([]);
        }},
      ],
      { cancelable: false }
    );
  }

  return (
    <Background>
      <Container>
        <Image source={logo}/>
        <Content>
            <ContentText>Tipo: {apontamentoData.tipo}</ContentText>
            <ContentText>Data: {apontamentoData.data}</ContentText>
            <ContentTitle>Itens Cadastrados</ContentTitle>
            <List
              data={inventario}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <ItemCard>
                  <CheckBox
                    value={selectedItems.includes(item.id)}
                    onValueChange={() => toggleSelectItem(item.id)}
                  />
                  <Produtos
                    onCancel={() => confirmDelete(item.id)}
                    data={item}
                    userData={user}
                  />
                </ItemCard>
              )}
            />
            {selectedItems.length > 0 && 
              <SubmitButton onPress={handleMassDelete}>
                Deletar Selecionados
              </SubmitButton>
            }
            <SubmitButton onPress={()=>navigation.navigate("ApontamentoItem",{apontamentoData:apontamentoData})}>
              Escanear Item
            </SubmitButton>
            <SubmitButton onPress={()=>navigation.navigate("ApontamentoItem",{apontamentoData:apontamentoData})}>
              Adicionar Item
            </SubmitButton>
            <SubmitButton onPress={() => navigation.navigate('Apontamentos')}>
              Voltar
            </SubmitButton>
        </Content>
      </Container>
    </Background>
  );
}
