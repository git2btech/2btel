import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed";

import BackgroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";

export function SignIn (){
    const navigator = useNavigation<AuthNavigatorRoutesProps>();
    function handleResetPassword(){
        navigator.navigate("resetPassword");
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
                        <Input placeholder="E-mail" keyboardType="email-address" autoCapitalize="none"/>
                        <Input placeholder="Senha" secureTextEntry/>
                        <Button title="Acessar" />
                    </Center>

                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$primary000" fontSize="$sm" mb="$3" font-family="$body">Não se lembra do acesso?</Text>
                        <Button title="Recuperar Senha" variant="outline" onPress={handleResetPassword}/>
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    )
}