import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Left, Bandeira, Info, Nome, Numero, Expires } from './styles';

export default function Cards({ userData, data, onCancel, onNavigate }) {
    let bandeira = '';
    function getBandeira(type){
        switch(type){
            case 1:
            bandeira = require('../../assets/img/vending-machine.png');
            break;
            case 2:
            bandeira = require('../../assets/img/deposit.png');
            break;
            case 3:
            bandeira = require('../../assets/img/expedition.png');
            break;
            case 4:
            bandeira = require('../../assets/img/received.png');
            break;
            case 10:
            bandeira = require('../../assets/img/other.png');
            break;
            default:
            bandeira = require('../../assets/img/cartao-default.png');
        }
        return bandeira;
    }

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
              tipo = 'Ordem de Servico';
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
    
  return (
    <Container onPress={onNavigate}>
        <Left>
            <Bandeira source={getBandeira(data.tipo)}></Bandeira>
            <Info>
                <Nome>{getTipo(data.tipo)}</Nome>
                <Numero>Criado por: {data.login}</Numero>
                <Expires>Data do registro: {data.data}</Expires>
            </Info>
        </Left>
        {userData?.name === data.login &&
            <TouchableOpacity onPress={onCancel}>
                <Icon name="delete" size={20} color="#f64c75"/>
            </TouchableOpacity>
        }
    </Container>
  );
}
