import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed";
import { useForm, Controller } from 'react-hook-form';
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from "react";
import api from "@services/api";
import axios from 'axios';
import { ToastMessage } from '@components/ToastMessage';

type FormDataProps = {
    email: string;
}

const resetPasswordSchema = yup.object({
    email: yup.string().required("Informe o e-mail"),
});

export function ResetPassword (){
    const toast = useToast();
    const navigator = useNavigation();
    const [load, setLoad] = useState<boolean>(false);
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(resetPasswordSchema)
    });

    function handleLogin(){
        navigator.goBack();
    }

    async function handleResetPassword({ email }: FormDataProps){
        try{
            setLoad(true);
            const response = await api.post("/auth/esqueci-senha", { email });
            console.log(response.data);
            if(response && response.data.message){
                setLoad(false);
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Requisição Enviada" description={response.data.message} action="success" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } catch(e){
            setLoad(false);
            if(axios.isAxiosError(e)){
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage id={id} title="Erro ao realizar o login" description={e.response?.data?.errors[0]} action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }
        } 
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}}
            showsVerticalScrollIndicator={false}
        >
            <VStack flex={1} bg="$success100">
                <Image 
                    source={BackgroundImg}
                    defaultSource={BackgroundImg} 
                    alt="Sistema de Telemetria"
                    w="$full"
                    h="$full"
                    position="absolute"
                />
                <VStack flex={1} px="$10" pb="$16">
                    <Center my="$12">
                        <Logo width={175}/>
                        <Text color="$primary000" fontSize="$sm" marginTop={-65}>O monitoramento a distância mais próximo de você.</Text>
                    </Center>

                    <Center gap="$2">
                        <Text color="$primary000">Informe seu email para recuperar a senha</Text>
                        <Controller 
                            control={control} 
                            name="email"
                            render={({ field: { onChange, value }}) => (
                                <Input placeholder="E-mail:" value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.email?.message}/>
                            )}
                        />
                        <Button title={!load ? "Recuperar Senha" :  "Aguarde..."} onPress={handleSubmit(handleResetPassword)} disabled={load}/>
                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$primary000" fontSize="$sm" mb="$3" font-family="$body">Se lembrou do acesso?</Text>
                        <Button title="Faça o Login" variant="outline" onPress={handleLogin}/>
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    )
}