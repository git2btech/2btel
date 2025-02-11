import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

export function ResetPassword (){
    const navigator = useNavigation();
    function handleLogin(){
        navigator.goBack();
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
                        <Input placeholder="E-mail" keyboardType="email-address" autoCapitalize="none"/>
                        <Button title="Enviar" />
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