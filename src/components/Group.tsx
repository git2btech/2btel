import { ComponentProps } from "react";
import { Button, Text } from "@gluestack-ui/themed";


type Props = ComponentProps<typeof Button> & {
    name: string
    isActive?: boolean
}

export function Group({ name, isActive, ...rest}: Props){
    return (
        <Button
            mr="$3"
            minWidth="$24" 
            h="$10" 
            bg="$green500" 
            rounded="$md" 
            justifyContent="center" 
            alignItems="center"
            borderColor="$green600"
            borderWidth={isActive ? 1 : 0}
            sx={{
                ":active":{
                    borderWidth: 1,
                },
            }} 
            {...rest}
        >
            <Text 
                color={isActive ? "$primary0" : "$gray800"}
                textTransform="uppercase"
                fontSize="$xs"
                fontFamily="$heading"
            >
                {name}
            </Text>
        </Button>
    )
}