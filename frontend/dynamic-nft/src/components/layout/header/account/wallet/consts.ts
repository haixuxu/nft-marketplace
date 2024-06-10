import polkadotsvg from './assets/polkadot.svg';
import subwalletsvg from './assets/subwallet.svg';
import talismansvg from './assets/talisman.svg';
import enkryptsvg from './assets/enkrypt.svg';

type WalletItem = {
  name: string;
  svgicon: any;
};

const WALLET: Record<string, WalletItem> = {
  'polkadot-js': { name: 'Polkadot JS', svgicon: polkadotsvg },
  'subwallet-js': { name: 'SubWallet', svgicon: subwalletsvg },
  talisman: { name: 'Talisman', svgicon: talismansvg },
  enkrypt: { name: 'Enkrypt', svgicon: enkryptsvg },
};

const WALLETS = Object.entries(WALLET);

export { WALLET, WALLETS };
