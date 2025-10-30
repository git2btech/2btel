import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, Left, Bandeira, Info, Nome, Numero, Expires } from './styles';

export default function Cards({ userData, data, onCancel, onNavigate }) {
    let bandeira = '';
        /* 
            Tipos Conhecidos

            Maquina, Deposito, Expedicao, Recebimento, Producao, 
            Qualidade, OrdemServico, Scrap, Recon, Outros, Compras, 
            InventarioDeposito, InventarioMaquina, AbastecimentoDeposito, 
            AbastecimentoMaquina
        */
    function getBandeira(type){
        switch(type){
            case "Maquina":
            bandeira = require('../../assets/img/vending-machine.png');
            break;
            case "Deposito":
            bandeira = require('../../assets/img/deposit.png');
            break;
            case "Expedicao":
            bandeira = require('../../assets/img/expedition.png');
            break;
            case "Recebimento":
            bandeira = require('../../assets/img/received.png');
            break;
            case "Outros":
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
          case "Maquina":
            tipo = 'Maquina';
          break;
          case "Deposito":
              tipo = 'Depósito';
          break;
          case "Expedicao":
              tipo = 'Expedição';
          break;
          case "Recebimento":
              tipo = 'Recebimento';
          break;
          case "Producao":
              tipo = 'Producao';
          break;
          case "Qualidade":
              tipo = 'Qualidade';
          break;
          case "OrdemServico":
              tipo = 'Ordem de Servico';
          break;
          case "Scrap":
              tipo = 'Scrap';
          break;
          case "Recon":
              tipo = 'Recon';
          break;
          case "Outros":
              tipo = 'Outros';
          break;
          case "Compras":
            tipo = 'Compras';
          break;
          case "InventarioDeposito":
            tipo = 'Inventario Deposito';
          break;
          case "InventarioMaquina":
            tipo = 'Inventario Maquina';
          break;
          case "AbastecimentoDeposito":
            tipo = 'Abastecimento Deposito';
          break;
          case "AbastecimentoMaquina":
            tipo = 'Abastecimento Maquina';
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
                {data.cliente ? (
                    <Numero>Cliente: {data.cliente}</Numero>
                ) : null}
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
