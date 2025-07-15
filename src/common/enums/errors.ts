export enum ErrorTransaction {
  InvalidSenderOrRecipient = 'Invalid sender or recipient',
  InvalidRecallableTime = 'Invalid recallable time',
  InvalidAssetsLength = 'Invalid assets length',
  InvalidAssets = 'Invalid assets',
  InvalidSerialNumber = 'Invalid serial number',
  TransactionNotFound = 'Transaction not found',
  InvalidTransactionId = 'Invalid transaction id',
}

export enum ErrorAddressBook {
  NameAlreadyExists = 'Name already exists',
}

export enum ErrorRequestPayment {
  NOT_FOUND = 'Request payment not found',
  NOT_PENDING = 'Request payment is not pending',
}

export enum ErrorGift {
  GiftNotFound = 'Gift not found',
}
