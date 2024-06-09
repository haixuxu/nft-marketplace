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



1 管理员批量发nft给多个钱包地址
2 用户连接钱包 点击升级（通过dynamic nft文件） 咱们自己dapp部署上线
3 marketplace 展示nft  用户登录可以看自己的nft  marketplace 部署上线

 find ./target/wasm32-unknown-unknown/release/ -type f -exec md5sum {} \;
28d632b41cd0af10ede74cd2f5c85202  ./target/wasm32-unknown-unknown/release//dynamic_nft.meta.txt
2aa30c37d2742fad233055eb6b78fd9e  ./target/wasm32-unknown-unknown/release//nft_marketplace.meta.txt
a5882af8edec2b5d901fde94b5ba2346  ./target/wasm32-unknown-unknown/release//nft_marketplace.opt.wasm
766cc4b177bd512849393657d30f22c9  ./target/wasm32-unknown-unknown/release//dynamic_nft_state.meta.wasm
1904a1293fa36976a2fa9aba0a27124a  ./target/wasm32-unknown-unknown/release//fungible_token.wasm
c6e11cc5f529af1689f89f4cb51db1cb  ./target/wasm32-unknown-unknown/release//dynamic_nft.opt.wasm
e4edd37f0afd6ab157b7d7549ab36ea5  ./target/wasm32-unknown-unknown/release//nft_marketplace_state.meta.wasm
e02592ce46e76f78ef814110801e2274  ./target/wasm32-unknown-unknown/release//non_fungible_token.opt.wasm
e8b4e04e50c3f62691ee370db0f0304c  ./target/wasm32-unknown-unknown/release//fungible_token_state.meta.wasm
07aa29f32d9ebc22ce17c4e11d14d100  ./target/wasm32-unknown-unknown/release//nft_marketplace.wasm
331f1535fb2e4b927cd25a0fb7b46df6  ./target/wasm32-unknown-unknown/release//fungible_token.meta.txt
d7da92b5f17713f12529083a3c5fbe90  ./target/wasm32-unknown-unknown/release//non_fungible_token_state.meta.wasm
b3e7f698d16800a56c782e2c5aa4ac23  ./target/wasm32-unknown-unknown/release//fungible_token.opt.wasm
e48b9e030feda7139894a196f0de1807  ./target/wasm32-unknown-unknown/release//non_fungible_token.wasm
22a607a7085d3a2a44959b339de65f3d  ./target/wasm32-unknown-unknown/release//non_fungible_token.meta.txt
6dd8a8d5752a2cce66df8461b311bc28  ./target/wasm32-unknown-unknown/release//dynamic_nft.wasm