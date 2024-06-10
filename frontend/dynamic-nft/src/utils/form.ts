const getMintDetails = (attributesValue?: { key: string; value: string }[], rarity?: string) => {
  const attributes = attributesValue?.reduce((accumulator, { key, value }) => ({ ...accumulator, [key]: value }), {});

  return JSON.stringify(attributes);
};

const getMintPayload = (name: string, description: string, imgCid: string, detailsCid?: string) => {
  const tokenMetadata = {
    name,
    description,
    media: imgCid,
    reference: detailsCid || '',
  };

  return { Mint: { tokenMetadata, transaction_id: Math.floor(Math.random() * 1000_1000) } };
};

const getAddMintPayload = (address: string) => {
  return { AddMinter: { minter_id: address, transaction_id: Math.floor(Math.random() * 1000_1000) } };
};


export { getMintDetails, getMintPayload, getAddMintPayload };
