import React, { useEffect,useState } from 'react';
import { Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import Background from '../../../components/Background';
import logo from '../../../assets/img/logo-2btech.png';
import Cards from '../../../components/Cards';
import api from '../../../services/api';
import Moment from 'moment';
import 'moment/locale/pt-br';
import { Container, Form, SubmitButton,Title,List } from './styles';

export default function Apontamentos({ navigation }) {
  const token = useSelector(state=> state.auth.token);
  const user = useSelector(state => state.user.profile);
  const [listApontamentos,setListApontamentos] = useState([]);

  useEffect(()=>{
    getInventarios();
  },[]);

  // Data de hoje
  const dataHoje = Moment().format('YYYY-MM-DDTHH:mm:ss');

  // Data de 30 dias atrás
  const data30DiasAtras = Moment().subtract(30, 'days').format('YYYY-MM-DDTHH:mm:ss');

  async function getInventarios(){
    try{
      let inventario_lista = [];
      const response = await api.get(`/v1/inventario?pageSize=50&page=1&dataInicial=${data30DiasAtras}&dataFinal=${dataHoje}`,{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if(response && response.data.list.length > 0){
        for (let i = 0; i < response.data.list.length; i++){
          inventario_lista.push({
            id: response.data.list[i].id,
            data: response.data.list[i].dataRegistro,
            login: response.data.list[i].loginRegistro,
            tipo: response.data.list[i].tipoApontamento,
            matricula: response.data.list[i].matricula,
          });
        }
      }
      setListApontamentos(inventario_lista);
    }catch (err) {
      console.log('Erro: ', err);
    }
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
    api.defaults.headers.Authorization = `Bearer ${token}`;
    const response = await api.delete(`/v1/inventario/${id}`);
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
            <List
              data={listApontamentos}
              keyExtractor={item=>String(item.id)}
              renderItem={({ item }) => <Cards  onNavigate={()=>navigation.navigate("Apontamento",{apontamento: item})} onCancel={()=> confirmDelete(item.id)} data={item} userData={user}/> }
            />
            <SubmitButton onPress={()=> navigation.navigate('Inicial')}>
              Voltar
            </SubmitButton>
          </Form>
      </Container>
    </Background>
  );
}
