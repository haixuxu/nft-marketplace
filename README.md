# nft-marketplace指南


## build nft  contract and upload  `non-fungible-token.opt.wsam` to idea

```bash
cd contracts/non-fungible-token
cargo build -p "non-fungible-token*" --release
```

## build nft-marketplace contract  and upload  `nft-marketplace.opt.wsam` to idea

```bash
cd contracts/nft-marketplace
cargo build -p "nft-marketplace*" --release
```


## start `nft-marketplace` frontend app

1. 安装依赖
```bash
cd frontend/nft-marketplace
yarn install
```
2. 配置`.env`

```conf

REACT_APP_NODE_ADDRESS=wss://testnet.vara.network:443
# REACT_APP_IPFS_GATEWAY_ADDRESS=https://ipfs.io/ipfs
# REACT_APP_IPFS_GATEWAY_ADDRESS=https://ipfs.infura.io/ipfs/
REACT_APP_IPFS_GATEWAY_ADDRESS=https://cloudflare-ipfs.com/ipfs
REACT_APP_MARKETPLACE_CONTRACT_ADDRESS=0x1f4d908eae141da9bdab70cf41989a16f19337a2c8bf3757074b4a61929f88f0
REACT_APP_NFT_CONTRACT_ADDRESS=0x33efcee01ae3a743c7a1c394925e8fde24d0ecd72e5c6dcda4712d7a3705b4e1



DISABLE_ESLINT_PLUGIN=true

```

3. 启动开发

```bash
npm run start
```

