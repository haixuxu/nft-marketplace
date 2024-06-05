import fs from 'fs';
import { GearKeyring, GearApi, ProgramMetadata } from '@gear-js/api';
import { resolveOut, resolve, getKeyring } from './utils.js';
import BigNumber from 'bignumber.js';
// import rpcservice from "./rpcservice.js";

const keyring = await getKeyring();
const gearApi = await GearApi.create({ providerAddress: 'wss://testnet.vara.network' });

const meta = ProgramMetadata.from('0x' + fs.readFileSync(resolveOut('dynamic_nft.meta.txt')));

const getMintPayload = (name, description, imgCid, detailsCid) => {
  const tokenMetadata = {
    name,
    description,
    media: imgCid,
    reference: detailsCid || '',
  };

  return { Mint: { tokenMetadata, transaction_id: Math.floor(Math.random() * 1000_1000) } };
};

const getAutoGasLimit = ({ waited, min_limit }, _multiplier) => {
  const limit = new BigNumber(min_limit.toString());
  const multiplier = _multiplier || (waited ? 1.1 : 1);
  return limit.multipliedBy(multiplier).toFixed(0);
};

const programId = '0xc018ad3cf645beef79a2c776b83205965b5fa1c63295f6bb04ce9b58ea235cdc';

async function doMintTask(task) {
  try {
    const payload = getMintPayload(task.name, task.description, task.imageCid, task.detailsCid);
    // get init gas
    const sourceId = '0x127f231b64ce3f948559fb8e453b73b1872f241560ebbd3658cdd7324f638270';
    const gas = await gearApi.program.calculateGas.handle(sourceId, programId, payload, 0, false, meta);

    console.log('gas===', gas.toHuman());
    const gasAutoLimit = getAutoGasLimit(gas);
    console.log('gasAutoLimit===', gasAutoLimit);
    const message = {
      destination: programId, // programId
      payload: payload,
      gasLimit: gasAutoLimit, // 1 ETH=1e18 wei（一亿亿分之1ETH)??
      //   value: 1000_000_000_000, // ??
    };
    // In that case payload will be encoded using meta.types.handle.input type
    let extrinsic = gearApi.message.send(message, meta);
    // So if you want to use another type you can specify it
    // extrinsic = gearApi.message.send(message, meta, meta.types.other.input);

    let pm = new Promise((resolve, reject) => {
      extrinsic.signAndSend(keyring, (event) => {
        // console.log('event==', event.toHuman());
        const { status, events } = event;
        if (status.isReady) {
          console.log('ready====');
        } else if (status.isInBlock) {
          console.log('ready====is in block');
        } else if (status.isFinalized) {
          console.log('ready====isFinalized');
          resolve();
        }
      });
    });
    await pm;
  } catch (error) {
    console.log(error);
    console.error(`${error.name}: ${error.message}`);
  }
}

for (var i = 0; i < 100; i++) {
  await doMintTask({
    name: 'mynft_' + Math.floor(Math.random() * 1000),
    description: 'test auto create nft_'+Date.now(),
    imageCid: 'QmcrA4RPebPVoNMYfroiCRz6cfUP2CsP3V2JD5WZBghDfM',
    detailsCid: 'QmYBU21uX5VXsV5fWMikAhE6GZsQ9GaCWpmE5qdhguZhcm',
  });
}
