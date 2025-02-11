import { ComponentProps } from "react";
import { Button as GluestackButton, Text, ButtonSpinner } from "@gluestack-ui/themed";

type Props = ComponentProps<typeof GluestackButton> & {
    title: string
    variant?: "solid" | "outline"
    isLoading?: boolean
}

export function Button({ title, variant = "solid", isLoading = false, ...rest }: Props){
    return(
        <GluestackButton
            w="$full"
            h="$14"
            bg={variant === "outline" ? "transparent" :  "$green400"}
            borderWidth={variant === "outline" ? "$2" : "$0"}
            borderColor="$green400"
            rounded="$sm"
            $active-backgroundColor={variant === "outline" ? "$green400" :  "$green500"}
            disabled={isLoading}
            {...rest}
        >
            { isLoading ? ( 
                <ButtonSpinner color="$white"/>
            ):( 
                <Text color="$white" fontFamily="$heading" fontSize="$sm">
                    {title}
                </Text>
            )}
        </GluestackButton>
    );
}