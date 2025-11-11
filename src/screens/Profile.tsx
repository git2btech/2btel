import { useCallback, useState } from 'react';
import axios from 'axios';
import { ScrollView, TouchableOpacity } from 'react-native';
import { user, useAuth } from "@hooks/useAuth";
import { useForm, Controller } from 'react-hook-form';
import { Center, VStack, Text, Heading, useToast } from '@gluestack-ui/themed';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import userPhotoDefault from "@assets/userPhotoDefault.png";
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastMessage } from '@components/ToastMessage';
import { Loading } from '@components/Loading';
import api from '@services/api';

type FormDataProps = {
    name: string;
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const updateProfileSchema = yup.object({
    name: yup.string().required("Informe o nome"),
    email: yup.string().required("Informe o e-mail"),
    oldPassword: yup.string().required("Informe a oldPassword"),
    newPassword: yup.string().required("Informe a nova senha"),
    confirmPassword: yup.string().required("Confirme a senha"),
});

export function Profile(){
    const [userPhoto, setUserPhoto] = useState("");
    const { user } = useAuth();
    const [load, setLoad] = useState<boolean>(false);
    const toast = useToast();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormDataProps>({
        resolver: yupResolver(updateProfileSchema)
    });

    async function getUserProfile(id: string){
        try{
            setLoad(true);
            const response = await api.get(`usuario/${user.id}`,{
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            setValue("name", response.data.nomeCompleto);
            setValue("email", response.data.email);
            setLoad(false);
        } catch(e){
            // console.log('Erro: ', e);
            // console.log('AXIOS STATUS:', e.response?.status);
            // console.log('AXIOS DATA  :', e.response?.data);
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

    async function updateProfile({ name, email, oldPassword, newPassword, confirmPassword}: FormDataProps){
        console.log(name, email, oldPassword, newPassword, confirmPassword);
        try{
            setLoad(true);
            //await signIn(userName, password);
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

    async function handleUserPhotoSelect() {
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [4,4],
            allowsEditing: true,
        });

        console.log(photoSelected);

        if(photoSelected.canceled) return;

        const photoURI = photoSelected.assets[0].uri;

        if(photoURI){
            const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
                size: number
            };

            if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 1 ) {
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage id={id} title="imagém muito grande" description="Essa imagém é muito grande, escolha uma de até 5mb" action="error" onClose={()=>toast.close(id)} />
                    )
                })
            }

            setUserPhoto(photoURI)
        }
    }

     useFocusEffect(useCallback(() => {
        if(user && user.id){
            getUserProfile(user.id);
        }
    }, []))

    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil'/>
            {load ? <Loading /> :
                <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                    <Center mt="$6" px="$10">
                        {userPhoto ? (
                            <UserPhoto source={{ uri: userPhoto}} size="xl" alt="Foto de Perfil"/>
                        ): (
                            <UserPhoto source={userPhotoDefault} size="xl" alt="Foto de Perfil"/>
                        )}
                        

                        <TouchableOpacity onPress={handleUserPhotoSelect}>
                            <Text color="$gray500" fontFamily="$heading" fontSize="$md" mt="$2" mb="$8">Alterar Foto</Text>
                        </TouchableOpacity>

                        <Center w="$full" gap="$4">
                            <Controller 
                                control={control} 
                                name="name"
                                render={({ field: { onChange, value }}) => (
                                    <Input placeholder="Nome: " value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.name?.message}/>
                                )}
                            />
                            <Controller 
                                control={control} 
                                name="email"
                                render={({ field: { onChange, value }}) => (
                                    <Input placeholder="E-mail: " value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.email?.message}/>
                                )}
                            />
                        </Center>

                        <Heading
                            alignSelf="flex-start"
                            fontFamily="$heading"
                            color="$gray500"
                            fontSize="$md"
                            mt="$12"
                            mb="$2"
                        >
                            Alterar Senha
                        </Heading>

                        <Center w="$full" gap="$4">
                            <Controller 
                                control={control} 
                                name="oldPassword"
                                render={({ field: { onChange, value }}) => (
                                    <Input placeholder="Senha Antiga: " secureTextEntry value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.oldPassword?.message}/>
                                )}
                            />
                            <Controller 
                                control={control} 
                                name="newPassword"
                                render={({ field: { onChange, value }}) => (
                                    <Input placeholder="Nova Senha: " secureTextEntry value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.newPassword?.message}/>
                                )}
                            />
                            <Controller 
                                control={control} 
                                name="confirmPassword"
                                render={({ field: { onChange, value }}) => (
                                    <Input placeholder="Confirme a Nova Senha: " secureTextEntry value={value} autoCapitalize="none" onChangeText={onChange} errorMessage={errors.confirmPassword?.message}/>
                                )}
                            />

                            <Button onPress={handleSubmit(updateProfile)} title="Atualizar" />
                            <Button backgroundColor="$red500" $active-backgroundColor="$red300" title="Sair" />
                        </Center>
                    </Center>
                </ScrollView>
            }
        </VStack>
    )
}