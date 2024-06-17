import React, { useEffect,useState } from 'react';
import { Image,ScrollView,SafeAreaView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import Cards from '../../../components/Cards';
import api from '../../../services/api';
import { Container, Form, SubmitButton,Title,List } from './styles';

export default function Apontamentos({ navigation }) {
  const token = useSelector(state=> state.auth.token);
  const user = useSelector(state => state.user.profile);
  const [listApontamentos,setListApontamentos] = useState([]);

  useEffect(()=>{
    getInventarios();
  },[]);

  async function getInventarios(){
    let inventario_lista = [];
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.get('/api/v1/inventario');
    for (let i = 0; i < response.data.List.length; i++){
      inventario_lista.push({
        id: response.data.List[i].Id, 
        data: response.data.List[i].DataInventario,
        login: response.data.List[i].LoginRegistro, 
        tipo: response.data.List[i].Tipo,
        matricula: response.data.List[i].Matricula,
      });
    }
    setListApontamentos(inventario_lista);
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
    console.log('ID do apontamento: ', id);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.delete(`api/v1/inventario/${id}`);
    console.log(response.data);

    setListApontamentos(
      listApontamentos.filter(apontamento =>apontamento.id !== id)
    );
  }
  
  return (
    <Background>
      <Container>
          <Image source={logo} style={{alignSelf: 'center'}}/>
          <Form>
            <Title>Apontamentos Cadastrados</Title>
            <ScrollView style={{height: 200}}>
                  <List
                    data={listApontamentos}
                    keyExtractor={item=>String(item.id)}
                    renderItem={({ item }) => <Cards  onNavigate={()=>navigation.navigate("Apontamento",{apontamento: item})} onCancel={()=> confirmDelete(item.id)} data={item} userData={user}/> }
                  />
            </ScrollView>
            <SubmitButton onPress={()=> navigation.navigate('Inicial')}>
                  Voltar
            </SubmitButton>
          </Form>
      </Container>
    </Background>
  );
}
