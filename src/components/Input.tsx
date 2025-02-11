import { Input as GluestackInput, InputField } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField>

export function Input({ ...rest }: Props){
    return(
        <GluestackInput 
            bg="$primary0" 
            h="$14" 
            px="$4" 
            borderWidth="$0"
            borderRadius="$md"
            $focus={{
                borderWidth: 1,
                borderColor: "$green500"
            }}
        >
            <InputField 
                color="$gray300"
                fontFamily="$body"
                placeholderTextColor="$gray300"
                { ...rest }
            />
        </GluestackInput>
    );
}