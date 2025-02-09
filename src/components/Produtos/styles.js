import styled from 'styled-components/native';

export const Container = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    width: 80%;
`;

export const Left = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Bandeira = styled.Image`
    width: 35px;
    height: 35px;
    border-radius: 25px;
`;

export const Info = styled.View`
    margin-left: 15px;
    max-width: 65%;
`;

export const Nome = styled.Text`
    font-weight: bold;
    font-size: 10px;
    color: #333;
`;

export const Numero = styled.Text`
    color: #999;
    font-size: 13px;
    margin-top: 4px;
`;

export const Expires = styled.Text`
    color: #999;
    font-size: 10px;
`;

export const Action = styled.TouchableOpacity`
   position: absolute;
   right: -20px;
`;