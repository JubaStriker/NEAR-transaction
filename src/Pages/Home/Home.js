import React, { useState } from 'react';
import * as nearAPI from "near-api-js";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    Stack,
    Text,
    useBreakpointValue,
    Box,
    Link
} from '@chakra-ui/react'
import { MdSend } from 'react-icons/md';
import Navbar from '../../components/navbar/Navbar';
import useNearStore from '../../store/near';
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { toast } from 'react-hot-toast';

const Home = () => {

    const [senderAccount, setSenderAccount] = useState(undefined);

    const getAccount = (changeEvent) => {
        setSenderAccount(changeEvent.target.value);
    };


    const nearState = useNearStore((state) => state.nearState)
    const sendNear = useNearStore((state) => state.sendNear)
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();

    console.log(nearState.send);


    const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore, // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };

    const interactWallet = async (action) => {

        const nearConnection = await nearAPI.connect(connectionConfig);

        const walletConnection = new nearAPI.WalletConnection(nearConnection);
        console.log(walletConnection)
        if (action === "connect") {

            walletConnection.requestSignIn({
                contractId: senderAccount,
                methodNames: [], // optional
                successUrl: "http://localhost:3000/", // optional redirect URL on success
                failureUrl: "http://localhost:3000/home/failure" // optional redirect URL on failure
            });
        }

        else if (action === "disconnect") {
            walletConnection.signOut();
            localStorage.clear()
            window.location.reload();
        }


    }
    let accountID;
    const obj = myKeyStore?.localStorage?.undefined_wallet_auth_key;

    if (obj !== undefined) {
        const retrievedObj = JSON.parse(obj);
        accountID = retrievedObj.accountId;
    }



    const sendNearHandler = (e) => {
        e.preventDefault();
        const form = e.target;
        const amount = form.amount.value;
        const receiver = form.account.value;

        console.log(amount, accountID, receiver);
        sendNear(amount, accountID, receiver)
        form.reset()
    }

    if (nearState.send.success?.link) {
        toast.success("NEAR token send successfully");
    }
    return (
        <>
            <Navbar />
            <Stack direction={{ base: 'column', md: 'row' }} maxWidth={'8xl'}>
                <Flex p={8} flex={1} align={'center'} justify={'center'}>
                    <Stack spacing={6} w={'full'} maxW={'lg'}>
                        <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                            <Text
                                as={'span'}
                                position={'relative'}
                                _after={{
                                    content: "''",
                                    width: 'full',
                                    height: useBreakpointValue({ base: '20%', md: '30%' }),
                                    position: 'absolute',
                                    bottom: 1,
                                    left: 0,
                                    bg: 'blue.400',
                                    zIndex: -1,
                                }}>
                                Transfer
                            </Text>
                            <br />{' '}
                            <Text color={'blue.400'} as={'span'} align={'left'}>
                                Near Tokens
                            </Text>{' '}
                        </Heading>
                        <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'} align={'left'}>
                            Connect with your NEAR wallet and transfer your NEAR tokens
                        </Text>
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                            {accountID ?
                                <Button
                                    onClick={() => interactWallet('disconnect')}
                                    rounded={'full'}
                                    bg={'red.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'red.500',
                                    }}>
                                    Disconnect Wallet
                                </Button>
                                : <Flex width={'full'} gap={'5'}>
                                    <Input
                                        variant='flushed'
                                        placeholder="Enter your wallet address"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="text"
                                        size={'sm'}
                                        name='walletId'
                                        required
                                        onChange={getAccount}
                                    />
                                    {senderAccount ?
                                        <Button
                                            onClick={() => interactWallet('connect')}
                                            rounded={'full'}
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}
                                            px={'6'}
                                        >
                                            Connect Wallet
                                        </Button> :
                                        <Button
                                            onClick={() => interactWallet('connect')}
                                            rounded={'full'}
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}
                                            px={'6'}
                                            isDisabled={true}
                                        >
                                            Connect Wallet
                                        </Button>
                                    }
                                </Flex>}
                            {accountID ?
                                <Button rounded={'full'}>Connected Wallet:
                                    <Text as={'span'} color={'green.300'} ml={'2'}>{accountID}</Text>
                                </Button> :
                                ""}
                        </Stack>
                    </Stack>
                </Flex>
                <Flex flex={1}>
                    <Image
                        alt={'Login Image'}
                        objectFit={'cover'}
                        rounded={'lg'}
                        src={
                            'https://uploads-ssl.webflow.com/5eb90728dc345d1fe8bed774/627dd86e97d476d960dd1b01_Group%2011.png'
                        }
                    />
                </Flex>
            </Stack>

            {accountID ?
                <form onSubmit={sendNearHandler}>
                    <Flex

                        align={'center'}
                        justify={'center'}
                        maxW={''}>

                        <Stack
                            spacing={4}
                            w={'full'}
                            maxW={'lg'}
                            rounded={'xl'}
                            boxShadow={'lg'}
                            p={6}
                            my={12}>

                            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>

                                <Text color={'blue.500'} as={'span'} align={'left'}>
                                    Send
                                </Text>{' '}
                            </Heading>

                            <FormControl>
                                <FormLabel>Enter Amount</FormLabel>
                                <Flex>
                                    <Input
                                        variant='unstyled'
                                        placeholder="00.00"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="text"
                                        size={'lg'}
                                        name='amount'
                                        required
                                    />
                                    <Image
                                        alt={'Login Image'}
                                        h={'7'}
                                        w={'7'}
                                        rounded={'full'}
                                        src={
                                            'https://s3-us-west-1.amazonaws.com/compliance-ico-af-us-west-1/production/token_profiles/logos/original/9d5/c43/cc-/9d5c43cc-e232-4267-aa8a-8c654a55db2d-1608222929-b90bbe4696613e2faeb17d48ac3aa7ba6a83674a.png'
                                        }
                                    />
                                </Flex>

                            </FormControl>
                            <FormControl id="password" isRequired>
                                <InputGroup>
                                    <InputLeftAddon children='Send to: ' />
                                    <Input type='text' name='account' placeholder='Account ID' required />
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={6}>
                                <Button
                                    isLoading={nearState.send.loading}
                                    loadingText='Sending...'
                                    type='submit'
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Send <Text as={'span'} ml={'2'}><MdSend /></Text>
                                </Button>
                            </Stack>
                        </Stack>

                    </Flex>
                </form> :
                ""}

            {nearState.send.success?.link ?
                <Box textAlign="center" py={10} px={6}>
                    <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        NEAR Token sending successfull
                    </Heading>
                    <Text color={'gray.500'}>
                        OPEN LINK BELOW to see transaction in NEAR Explorer!'
                    </Text>
                    <Text>
                        <Link href={nearState.send.success?.link} isExternal>
                            Transaction Reference <ExternalLinkIcon mx='2px' />
                        </Link>
                    </Text>
                </Box>
                : ""}

        </>
    );
};

export default Home;






