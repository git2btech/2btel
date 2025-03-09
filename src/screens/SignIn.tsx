import { useState } from 'react';
import axios from 'axios';
import api from '@services/api';
import * as yup from 'yup';
import { useAuth } from "@hooks/useAuth";
import { useForm, Controller } from 'react-hook-form';
import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed";
import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastMessage } from '@components/ToastMessage';

type FormDataProps = {
    userName: string;
    password: string;
}

const signUpSchema = yup.object({
    userName: yup.string().required("Informe o e-mail"),
    password: yup.string().required("Informe a senha"),
});

export function SignIn (){
    const { signIn } = useAuth();
    const toast = useToast();
    const navigator = useNavigation<AuthNavigatorRoutesProps>();
    const [load, setLoad] = useState<boolean>(false);
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    function handleResetPassword(){
        navigator.navigate("resetPassword");
    }

    async function handleLogin({ userName, password}: FormDataProps){
        try{
            setLoad(true);
            await signIn(userName, password);
            setLoad(false);
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
            <VStack flex={1}>
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
                        <Heading color="$primary000">Acesse a conta</Heading>
                        <Controller 
                            control={control} 
                            name="userName"
                            render={({ field: { onChange, value }}) => (
                                <Input placeholder="Usuario" value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.userName?.message}/>
                            )}
                        />

                        <Controller 
                            control={control} 
                            name="password"
                            render={({ field: { onChange, value }}) => (
                                <Input placeholder="Senha" secureTextEntry value={value} onChangeText={onChange} onSubmitEditing={handleSubmit(handleLogin)} returnKeyType="send" errorMessage={errors.password?.message}/>
                            )}
                        />
                        <Button title="Acessar" onPress={handleSubmit(handleLogin)} isLoading={load}/>
                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$primary000" fontSize="$sm" mb="$3" font-family="$body">Não se lembra do acesso?</Text>
                        <Button title="Recuperar Senha" variant="outline" onPress={handleResetPassword} />
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    )
}