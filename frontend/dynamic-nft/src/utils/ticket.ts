export const getAirDropPayload = (addressList: Array<string>, amount: number) => {
  return { AirDrop: { recipients: addressList, amount } };
};