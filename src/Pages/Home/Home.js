import React from 'react';
import * as nearAPI from "near-api-js";
import { sendNear } from '../../utils/sendNear';
import {
    Button,
    Flex,
    FormControl,
    Heading,
    Image,
    Input,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react'
import Navbar from '../../components/navbar/Navbar';

const Home = () => {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();


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
                contractId: "jubastriker2.testnet",
                methodNames: [], // optional
                successUrl: "http://localhost:3000/", // optional redirect URL on success
                failureUrl: "http://localhost:3000/home/failure" // optional redirect URL on failure
            });
        }

        else if (action === "disconnect") {
            walletConnection.signOut();
            window.location.reload();
        }


    }
    let accountID;
    const obj = myKeyStore?.localStorage?.undefined_wallet_auth_key;

    if (obj !== undefined) {
        const retrievedObj = JSON.parse(obj);
        console.log(retrievedObj.accountId)
        accountID = retrievedObj.accountId;
    }



    const sendNearHandler = () => {
        sendNear()
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
                                : <Button
                                    onClick={() => interactWallet('connect')}
                                    rounded={'full'}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Connect Wallet
                                </Button>}
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


        </>
    );
};

export default Home;


