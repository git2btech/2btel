import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import prodIcon from '../../assets/img/snack-default.png';
import { Container, Left, Bandeira, Info, Nome, Numero, Expires, Action } from './styles';

export default function Produtos({ data, userData, onCancel }) {
  return (
    <Container>
        <Left>
            <Bandeira source={prodIcon}></Bandeira>
            <Info>
                <Nome>Nome: {data.nomeProduto}</Nome>
                <Numero>Codigo: {data.codigoProduto}</Numero>
                <Expires>Quantidade: {data.quantidade}</Expires>
                {data.numeroSelecao &&
                  <Expires>Selecao: {data.numeroSelecao}</Expires>
                }
            </Info>
        </Left>
        
        <Action onPress={onCancel}>
            <Icon name="delete" size={20} color="#f64c75"/>
        </Action>
    </Container>
  );
}
