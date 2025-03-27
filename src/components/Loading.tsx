import { Center, Spinner } from "@gluestack-ui/themed";

export function Loading(){
    return(
        <Center flex={1} bg="$success100">
            <Spinner color="$primary950"/>
        </Center>
    );
}