import { Input as GluestackInput, InputField, FormControl, FormControlErrorText, FormControlError } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField> & {
    errorMessage?: string | null;
    isInvalid?: boolean;
    isReadOnly?: boolean;
}

export function Input({ isReadOnly = false, errorMessage= null, isInvalid = false, ...rest }: Props){
    const invalid = !!errorMessage || isInvalid;
    return(
        <FormControl isInvalid={invalid} w="$full" mb="$4">
            <GluestackInput
                isInvalid={isInvalid}
                bg="$primary000" 
                h="$14" 
                px="$4" 
                borderWidth="$0"
                borderRadius="$md"
                $focus={{
                    borderWidth: 1,
                    borderColor: isInvalid ? "$red500" : "$green500"
                }}
                $invalid={{
                    borderWidth: 1,
                    borderColor: "$red500"
                }}
                isReadOnly={isReadOnly}
                opacity={isReadOnly ? 0.8 : 1}
            >
                <InputField 
                    color="$gray300"
                    fontFamily="$body"
                    placeholderTextColor="$gray300"
                    { ...rest }
                />
            </GluestackInput>

            <FormControlError>
                <FormControlErrorText color="$red500">
                    {errorMessage}
                </FormControlErrorText>
            </FormControlError>
        </FormControl>
    );
}