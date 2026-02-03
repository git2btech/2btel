import { Center, Heading } from '@gluestack-ui/themed';

type Props = {
    title: string;
}

export function ScreenHeader({ title }: Props){
    return (
        <Center bg="$green500" pb="$6" pt="$16" >
            <Heading color="$primary000" fontSize="$xl" fontFamily='$heading'>{title}</Heading>
        </Center>
    )
}