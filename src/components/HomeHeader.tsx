import { Heading, HStack, VStack, Text, Icon } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import { LogOut } from "lucide-react-native";
import userPhotoDefault from "@assets/userPhotoDefault.png";
import { useAuth } from "@hooks/useAuth";

export function HomeHeader(){
    const { user } = useAuth();
    function lowercaseFirstLetter(name: string) {
        return name
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

    return (
        <HStack bg="$green500" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
            <UserPhoto source={userPhotoDefault} alt="Imagem do Usuário" w="$16" h="$16"/>
            <VStack flex={1}>
                <Text color="$gray800" fontSize="$sm">Olá,</Text>
                <Heading color="$gray800" fontSize="$md">{user.name ? lowercaseFirstLetter(user.name) : "Usuário Teste"}</Heading>
            </VStack>
            <Icon as={LogOut} color="$primary0" size="xl"/>
        </HStack>
    )
}