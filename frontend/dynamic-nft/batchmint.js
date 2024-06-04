import fs from "fs";
import { GearKeyring, GearApi, ProgramMetadata } from "@gear-js/api";
import { resolveOut, resolve, getKeyring } from "./utils.js";
// import rpcservice from "./rpcservice.js";

const keyring = await getKeyring();
const gearApi = await GearApi.create({ providerAddress: "wss://testnet.vara.network" });

const meta = ProgramMetadata.from("0x" + fs.readFileSync(resolveOut("tmgbbk.meta.txt")));

try {
  // get init gas
  const sourceId = "0x127f231b64ce3f948559fb8e453b73b1872f241560ebbd3658cdd7324f638270";
  const destionId = "0xd34c2140a03e8bee9f20d1183deb6909a18af34942013baa0dc2304698c6998c";
  // const gas = await gearApi.program.calculateGas.reply(sourceId, destionId, 0, "0x00", 0, true, meta, 0);


  const nftInfo = {
    name,
    description,
    media: imgCid,
    reference: detailsCid || '',
  };

  let nftMintPayload= { Mint: { tokenMetadata:nftInfo, transaction_id: Math.floor(Math.random() * 1000) } };

  const message = {
    destination: "0xed95f29c90bb50b2e39cc9593428a44f2e13809c1b69421a2b2629e3dfec286a", // programId
    payload: nftMintPayload,
    gasLimit: 1000_000_000, // 1 ETH=1e18 wei（一亿亿分之1ETH)??
    value: 1000_000_000_000, // ??
    // prepaid: true,
    // account: accountId,
    // if you send message with issued voucher
  };
  // In that case payload will be encoded using meta.types.handle.input type
  let extrinsic = gearApi.message.send(message, meta);
  // So if you want to use another type you can specify it
  // extrinsic = gearApi.message.send(message, meta, meta.types.other.input);

  await extrinsic.signAndSend(keyring, (event) => {
    console.log('event==', event.toHuman());
    const { status, events } = event;
    if (status.isReady) {
      console.log("ready====");
    } else if (status.isInBlock) {
      console.log("ready====is in block");
    } else if (status.isFinalized) {
      console.log("ready====isFinalized");
    }
  });
} catch (error) {
  console.log(error);
  console.error(`${error.name}: ${error.message}`);
}
