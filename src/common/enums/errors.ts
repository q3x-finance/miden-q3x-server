export enum ErrorTransaction {
  InvalidSenderOrRecipient = 'Invalid sender or recipient',
  InvalidRecallableTime = 'Invalid recallable time',
  InvalidAssetsLength = 'Invalid assets length',
  InvalidAssets = 'Invalid assets',
  InvalidSerialNumber = 'Invalid serial number',
  TransactionNotFound = 'Transaction not found',
  InvalidTransactionId = 'Invalid transaction id',
  SenderRecipientSame = 'Sender and recipient cannot be the same',
  InvalidAddress = 'Invalid address format',
  InvalidAmount = 'Invalid amount',
  InvalidToken = 'Invalid token address',
}

export enum ErrorAddressBook {
  NameAlreadyExists = 'Name already exists',
  InvalidAddress = 'Invalid address format',
  InvalidName = 'Invalid name format',
  InvalidCategory = 'Invalid category format',
  AddressAlreadyExists = 'Address already exists in this category',
  SelfAddressNotAllowed = 'Cannot add your own address to address book',
}

export enum ErrorRequestPayment {
  NOT_FOUND = 'Request payment not found',
  NOT_PENDING = 'Request payment is not pending',
  InvalidAddress = 'Invalid address format',
  InvalidAmount = 'Invalid amount',
  InvalidToken = 'Invalid token address',
  InvalidMessage = 'Invalid message',
  SelfRequestNotAllowed = 'Cannot request payment from yourself',
  DuplicateRequest = 'Duplicate request already exists',
}

export enum ErrorGift {
  GiftNotFound = 'Gift not found',
  InvalidAddress = 'Invalid address format',
  InvalidAmount = 'Invalid amount',
  InvalidToken = 'Invalid token address',
  InvalidSerialNumber = 'Invalid serial number',
  GiftAlreadyOpened = 'Gift has already been opened',
  GiftExpired = 'Gift has expired',
  SelfGiftNotAllowed = 'Cannot send gift to yourself',
}

export enum ErrorGroupPayment {
  GroupNotFound = 'Group not found',
  GroupNameAlreadyExists = 'Group name already exists',
  MembersOrGroupIdRequired = 'Members or groupId required',
  InvalidGroupName = 'Invalid group name format',
  InvalidAddress = 'Invalid address format',
  InvalidAmount = 'Invalid amount',
  InvalidToken = 'Invalid token address',
  DuplicateMembers = 'Duplicate members are not allowed',
  EmptyMembersList = 'Members list cannot be empty',
  OwnerInMembersList = 'Owner cannot be included in members list',
  InsufficientMembers = 'At least 2 members are required for group payment',
  TooManyMembers = 'Maximum 50 members allowed per group',
  PaymentNotFound = 'Payment not found',
  PaymentAlreadyCompleted = 'Payment has already been completed',
  PaymentExpired = 'Payment has expired',
  MemberNotInGroup = 'Member is not part of this group',
  InvalidLinkCode = 'Invalid link code',
}
