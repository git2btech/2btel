import { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Center, VStack, Text, Heading, useToast } from '@gluestack-ui/themed';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import userPhotoDefault from "@assets/userPhotoDefault.png";
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ToastMessage } from '@components/ToastMessage';


export function Profile(){
    const [userPhoto, setUserPhoto] = useState("");
    const toast = useToast();
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
    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil'/>
            
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
                        <Input placeholder="Nome:" />
                        <Input placeholder="E-mail:" isReadOnly/>
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
                        <Input placeholder="Senha antiga:" secureTextEntry />
                        <Input placeholder="Nova senha:" secureTextEntry/>
                        <Input placeholder="Confirme a nova senha:" secureTextEntry/>

                        <Button title="Atualizar" />
                        <Button backgroundColor="$red500" $active-backgroundColor="$red300" title="Sair" />
                    </Center>
                </Center>
            </ScrollView>
        </VStack>
    )
}