const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  IPFS: process.env.REACT_APP_IPFS_ADDRESS as string,
  AUTH_HEADER: process.env.REACT_APP_CRUST_AUTH_HEADER as string,
  IPFS_GATEWAY: process.env.REACT_APP_IPFS_GATEWAY_ADDRESS as string,
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`,
  TICKET_CONTRACT_ADDRESS: process.env.REACT_APP_TICKET_CONTRACT_ADDRESS as `0x${string}`,
};

console.log(process.env);

if (process.env.NODE_ENV === 'development') {
  ADDRESS.CONTRACT_ADDRESS = '0xb9398f21acafe1b1cb5556306cd59bdfcf5df31ca1ac055d926c4805e1aaceaa';
  ADDRESS.TICKET_CONTRACT_ADDRESS = '0xdfe9598551b14727a9189627932d2507f0928c418aa6f78758834f4c659cacdf';
}

console.log('address==',ADDRESS);

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const FILTERS = ['All', 'My', 'Approved'];

export { ADDRESS, LOCAL_STORAGE, FILTERS };
