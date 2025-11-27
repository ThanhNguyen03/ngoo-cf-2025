import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Object: {
    input: { [key: string]: unknown }
    output: { [key: string]: unknown }
  }
  /** Custom scalar representing a Unix timestamp in milliseconds */
  Timestamp: { input: number; output: number }
}

export type CategoryInput = {
  categoryId: Scalars['String']['input']
  name: Scalars['String']['input']
}

/** Input types */
export type ConfirmPaymentInput = {
  codTransactionId?: InputMaybe<Scalars['String']['input']>
  orderId: Scalars['String']['input']
  paypalOrderId?: InputMaybe<Scalars['String']['input']>
  txHash?: InputMaybe<Scalars['String']['input']>
}

export type CreateAuditLogInput = {
  action: EAuditAction
  diff?: InputMaybe<Scalars['Object']['input']>
  metadata?: InputMaybe<Scalars['Object']['input']>
  targetId: Scalars['String']['input']
  targetType: ETargetType
  userId: Scalars['String']['input']
}

export type CreateItemInput = {
  additionalOption?: InputMaybe<Array<InputMaybe<ItemOptionInput>>>
  categoryName: Scalars['String']['input']
  description?: InputMaybe<Scalars['String']['input']>
  discountPercent?: InputMaybe<Scalars['Float']['input']>
  image: Scalars['String']['input']
  name: Scalars['String']['input']
  price: Scalars['Float']['input']
  requireOption?: InputMaybe<Array<InputMaybe<ItemOptionInput>>>
  status?: InputMaybe<Array<InputMaybe<EItemStatus>>>
}

export type CreateOrderInput = {
  cancelUrl: Scalars['String']['input']
  items: Array<OrderItemInput>
  paymentMethod: EPaymentMethod
  returnUrl: Scalars['String']['input']
}

export enum EAuditAction {
  Create = 'CREATE',
  Delete = 'DELETE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Other = 'OTHER',
  Payment = 'PAYMENT',
  Update = 'UPDATE',
}

export enum EAuthMethod {
  Credential = 'CREDENTIAL',
  Google = 'GOOGLE',
}

export enum EItemStatus {
  Empty = 'EMPTY',
  New = 'NEW',
  Seller = 'SELLER',
}

export enum EOrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Delivering = 'DELIVERING',
  Pending = 'PENDING',
}

export enum EPaymentMethod {
  Cod = 'COD',
  Crypto = 'CRYPTO',
  Paypal = 'PAYPAL',
}

export enum EPaymentStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL',
}

export enum ERole {
  Admin = 'ADMIN',
  User = 'USER',
}

export enum ESort {
  Asc = 'asc',
  Desc = 'desc',
}

export enum ETargetType {
  Category = 'Category',
  Item = 'Item',
  Order = 'Order',
  System = 'System',
  Transaction = 'Transaction',
  User = 'User',
}

export type ItemOptionInput = {
  extraPrice?: InputMaybe<Scalars['Float']['input']>
  group: Scalars['String']['input']
  name: Scalars['String']['input']
}

export type Mutation = {
  __typename?: 'Mutation'
  confirmPayment: TPaymentResponse
  createAuditLog: TAuditLog
  createCategory: TCategory
  createItem: TItemResponse
  createOrder: TCreateOrderResponse
  deleteCategory?: Maybe<Scalars['Boolean']['output']>
  deleteItem: Scalars['Boolean']['output']
  refreshToken: TUserAuth
  updateCategory: TCategory
  updateItem: TItemResponse
  userConnectCryptoWallet: TConnectCryptoWalletResponse
  userLogin: TUserAuth
  userLogout: Scalars['Boolean']['output']
  userRegister: TUserAuth
}

export type MutationConfirmPaymentArgs = {
  paymentInput: ConfirmPaymentInput
}

export type MutationCreateAuditLogArgs = {
  input: CreateAuditLogInput
}

export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input']
}

export type MutationCreateItemArgs = {
  input: CreateItemInput
}

export type MutationCreateOrderArgs = {
  input: CreateOrderInput
}

export type MutationDeleteCategoryArgs = {
  categoryId: Scalars['String']['input']
}

export type MutationDeleteItemArgs = {
  itemId: Scalars['String']['input']
}

export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input']
}

export type MutationUpdateCategoryArgs = {
  category: CategoryInput
}

export type MutationUpdateItemArgs = {
  input: UpdateItemInput
}

export type MutationUserConnectCryptoWalletArgs = {
  address: Scalars['String']['input']
  signature: Scalars['String']['input']
}

export type MutationUserLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>
  password?: InputMaybe<Scalars['String']['input']>
  token?: InputMaybe<Scalars['String']['input']>
}

export type MutationUserLogoutArgs = {
  logoutEverywhere?: InputMaybe<Scalars['Boolean']['input']>
}

export type MutationUserRegisterArgs = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

/** Input types */
export type OrderItemInput = {
  amount: Scalars['Int']['input']
  itemId: Scalars['String']['input']
  note?: InputMaybe<Scalars['String']['input']>
  selectedOptions?: InputMaybe<Array<InputMaybe<ItemOptionInput>>>
}

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Array<InputMaybe<QueryByInput>>>
}

export type Query = {
  __typename?: 'Query'
  cryptoWalletWithNone: Scalars['String']['output']
  getAuditLog?: Maybe<TAuditLog>
  getOrder: TOrderResponse
  itemById: TItemResponse
  listAuditLog: Array<TAuditLog>
  listCategory: Array<TCategory>
  listItem: TListItemResponse
  listItemByCategory: TListItemResponse
  listItemByStatus: TListItemResponse
  listPaymentHistory: TListPaymentResponse
  paymentHistory: TPaymentResponse
  userInfo: TUserInfo
}

export type QueryGetAuditLogArgs = {
  id: Scalars['String']['input']
}

export type QueryGetOrderArgs = {
  orderId: Scalars['String']['input']
}

export type QueryItemByIdArgs = {
  itemId: Scalars['String']['input']
}

export type QueryListAuditLogArgs = {
  action?: InputMaybe<EAuditAction>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  targetId: Scalars['String']['input']
  targetType?: InputMaybe<ETargetType>
  userId: Scalars['String']['input']
}

export type QueryListItemArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Array<InputMaybe<QueryByInput>>>
}

export type QueryListItemByCategoryArgs = {
  categoryName: Scalars['String']['input']
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
}

export type QueryListItemByStatusArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  status: Array<InputMaybe<EItemStatus>>
}

export type QueryListPaymentHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Array<InputMaybe<QueryByInput>>>
}

export type QueryPaymentHistoryArgs = {
  paymentId: Scalars['String']['input']
}

export type QueryByInput = {
  column?: InputMaybe<Scalars['String']['input']>
  sort?: InputMaybe<ESort>
}

export type TAuditDiff = {
  __typename?: 'TAuditDiff'
  newValue?: Maybe<Scalars['Object']['output']>
  oldValue?: Maybe<Scalars['Object']['output']>
}

export type TAuditLog = {
  __typename?: 'TAuditLog'
  action: EAuditAction
  createdAt: Scalars['Timestamp']['output']
  diff?: Maybe<TAuditDiff>
  id: Scalars['String']['output']
  metadata?: Maybe<Scalars['Object']['output']>
  targetId: Scalars['String']['output']
  targetType: ETargetType
  userId: Scalars['String']['output']
}

export type TAuditMetadata = {
  __typename?: 'TAuditMetadata'
  key?: Maybe<Scalars['String']['output']>
  refId?: Maybe<Scalars['String']['output']>
  value?: Maybe<Scalars['String']['output']>
}

export type TCategory = {
  __typename?: 'TCategory'
  categoryId: Scalars['String']['output']
  name: Scalars['String']['output']
}

export type TConnectCryptoWalletResponse = {
  __typename?: 'TConnectCryptoWalletResponse'
  connectCompleted: Scalars['Boolean']['output']
  userUuid: Scalars['String']['output']
  walletAddress: Scalars['String']['output']
}

export type TCreateOrderResponse = {
  __typename?: 'TCreateOrderResponse'
  codPaymentData?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Timestamp']['output']
  cryptoPaymentData?: Maybe<Scalars['String']['output']>
  orderId: Scalars['String']['output']
  paypalApproveUrl?: Maybe<Scalars['String']['output']>
  paypalOrderId?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
}

export type TItemOption = {
  __typename?: 'TItemOption'
  extraPrice?: Maybe<Scalars['Float']['output']>
  group: Scalars['String']['output']
  name: Scalars['String']['output']
}

export type TItemResponse = {
  __typename?: 'TItemResponse'
  additionalOption?: Maybe<Array<TItemOption>>
  categoryName: Scalars['String']['output']
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  discountPercent?: Maybe<Scalars['Float']['output']>
  image: Scalars['String']['output']
  itemId: Scalars['String']['output']
  name: Scalars['String']['output']
  price: Scalars['Float']['output']
  requireOption: Array<TItemOption>
  status?: Maybe<Array<Maybe<EItemStatus>>>
  updatedAt: Scalars['Timestamp']['output']
}

export type TListItemResponse = {
  __typename?: 'TListItemResponse'
  limit: Scalars['Int']['output']
  offset: Scalars['Int']['output']
  query: Array<Maybe<TQueryBy>>
  records: Array<TItemResponse>
  total: Scalars['Int']['output']
}

export type TListPaymentResponse = {
  __typename?: 'TListPaymentResponse'
  limit: Scalars['Int']['output']
  offset: Scalars['Int']['output']
  query: Array<Maybe<TQueryBy>>
  records: Array<Maybe<TPaymentResponse>>
  total: Scalars['Int']['output']
}

export type TOrderItem = {
  __typename?: 'TOrderItem'
  amount: Scalars['Int']['output']
  discountPercent?: Maybe<Scalars['Float']['output']>
  name: Scalars['String']['output']
  note?: Maybe<Scalars['String']['output']>
  price: Scalars['Float']['output']
  selectedOptions: Array<TItemOption>
}

export type TOrderResponse = {
  __typename?: 'TOrderResponse'
  createdAt: Scalars['Timestamp']['output']
  items: Array<Maybe<TOrderItem>>
  orderId: Scalars['String']['output']
  orderStatus: EOrderStatus
  paymentMethod: EPaymentMethod
  paypalOrderId?: Maybe<Scalars['String']['output']>
  totalPrice: Scalars['Int']['output']
  updatedAt: Scalars['Timestamp']['output']
  userInfoSnapshot: TUserInfoSnapshot
}

export type TPaymentResponse = {
  __typename?: 'TPaymentResponse'
  codTransactionId?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Timestamp']['output']
  items: Array<Maybe<TOrderItem>>
  orderId: Scalars['String']['output']
  paymentId: Scalars['String']['output']
  paymentMethod: EPaymentMethod
  paypalTransaction?: Maybe<TPaypalPayment>
  status: EPaymentStatus
  totalPrice: Scalars['Float']['output']
  txHash?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  userInfo: TUserInfoSnapshot
}

export type TPaypalPayment = {
  __typename?: 'TPaypalPayment'
  payerId: Scalars['String']['output']
  paypalCaptureId: Scalars['String']['output']
  paypalPayerEmail: Scalars['String']['output']
  rawResponse?: Maybe<Scalars['Object']['output']>
}

export type TQueryBy = {
  __typename?: 'TQueryBy'
  column?: Maybe<Scalars['String']['output']>
  sort?: Maybe<ESort>
}

export type TUserAuth = {
  __typename?: 'TUserAuth'
  accessToken: Scalars['String']['output']
  refreshToken: Scalars['String']['output']
  userUuid: Scalars['String']['output']
}

export type TUserInfo = {
  __typename?: 'TUserInfo'
  address?: Maybe<Scalars['String']['output']>
  authMethods: Array<Maybe<EAuthMethod>>
  email: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  phoneNumber?: Maybe<Scalars['String']['output']>
  role: ERole
  uuid: Scalars['String']['output']
  walletAddress?: Maybe<Scalars['String']['output']>
}

export type TUserInfoSnapshot = {
  __typename?: 'TUserInfoSnapshot'
  address: Scalars['String']['output']
  email: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  phoneNumber: Scalars['String']['output']
}

export type UpdateItemInput = {
  additionalOption?: InputMaybe<Array<InputMaybe<ItemOptionInput>>>
  categoryName?: InputMaybe<Scalars['String']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  discountPercent?: InputMaybe<Scalars['Float']['input']>
  image?: InputMaybe<Scalars['String']['input']>
  itemId: Scalars['String']['input']
  name?: InputMaybe<Scalars['String']['input']>
  price?: InputMaybe<Scalars['Float']['input']>
  requireOption?: InputMaybe<Array<InputMaybe<ItemOptionInput>>>
  status?: InputMaybe<Array<InputMaybe<EItemStatus>>>
}

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String']['input']
}>

export type CreateCategoryMutation = {
  __typename?: 'Mutation'
  createCategory: { __typename?: 'TCategory'; categoryId: string; name: string }
}

export type DeleteCategoryMutationVariables = Exact<{
  categoryId: Scalars['String']['input']
}>

export type DeleteCategoryMutation = {
  __typename?: 'Mutation'
  deleteCategory?: boolean | null
}

export type UpdateCategoryMutationVariables = Exact<{
  category: CategoryInput
}>

export type UpdateCategoryMutation = {
  __typename?: 'Mutation'
  updateCategory: { __typename?: 'TCategory'; categoryId: string; name: string }
}

export type CreateItemMutationVariables = Exact<{
  input: CreateItemInput
}>

export type CreateItemMutation = {
  __typename?: 'Mutation'
  createItem: {
    __typename?: 'TItemResponse'
    itemId: string
    name: string
    image: string
    price: number
    description?: string | null
    discountPercent?: number | null
    status?: Array<EItemStatus | null> | null
    categoryName: string
    createdAt: number
    updatedAt: number
    requireOption: Array<{
      __typename?: 'TItemOption'
      group: string
      name: string
      extraPrice?: number | null
    }>
    additionalOption?: Array<{
      __typename?: 'TItemOption'
      group: string
      name: string
      extraPrice?: number | null
    }> | null
  }
}

export type UpdateItemMutationVariables = Exact<{
  input: UpdateItemInput
}>

export type UpdateItemMutation = {
  __typename?: 'Mutation'
  updateItem: {
    __typename?: 'TItemResponse'
    itemId: string
    name: string
    image: string
    price: number
    description?: string | null
    discountPercent?: number | null
    status?: Array<EItemStatus | null> | null
    categoryName: string
    createdAt: number
    updatedAt: number
    requireOption: Array<{
      __typename?: 'TItemOption'
      group: string
      name: string
      extraPrice?: number | null
    }>
    additionalOption?: Array<{
      __typename?: 'TItemOption'
      group: string
      name: string
      extraPrice?: number | null
    }> | null
  }
}

export type CreateOrderMutationVariables = Exact<{
  input: CreateOrderInput
}>

export type CreateOrderMutation = {
  __typename?: 'Mutation'
  createOrder: {
    __typename?: 'TCreateOrderResponse'
    orderId: string
    paypalOrderId?: string | null
    paypalApproveUrl?: string | null
    cryptoPaymentData?: string | null
    codPaymentData?: string | null
    createdAt: number
    updatedAt: number
  }
}

export type ConfirmPaymentMutationVariables = Exact<{
  paymentInput: ConfirmPaymentInput
}>

export type ConfirmPaymentMutation = {
  __typename?: 'Mutation'
  confirmPayment: {
    __typename?: 'TPaymentResponse'
    paymentId: string
    orderId: string
    paymentMethod: EPaymentMethod
    totalPrice: number
    status: EPaymentStatus
    txHash?: string | null
    codTransactionId?: string | null
    createdAt: number
    updatedAt: number
    userInfo: {
      __typename?: 'TUserInfoSnapshot'
      name?: string | null
      address: string
      phoneNumber: string
      email: string
    }
    items: Array<{
      __typename?: 'TOrderItem'
      name: string
      amount: number
      price: number
      note?: string | null
      discountPercent?: number | null
      selectedOptions: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }>
    } | null>
    paypalTransaction?: {
      __typename?: 'TPaypalPayment'
      paypalPayerEmail: string
      paypalCaptureId: string
      payerId: string
      rawResponse?: { [key: string]: unknown } | null
    } | null
  }
}

export type UserLoginMutationVariables = Exact<{
  token?: InputMaybe<Scalars['String']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  password?: InputMaybe<Scalars['String']['input']>
}>

export type UserLoginMutation = {
  __typename?: 'Mutation'
  userLogin: {
    __typename?: 'TUserAuth'
    userUuid: string
    accessToken: string
    refreshToken: string
  }
}

export type UserLogoutMutationVariables = Exact<{
  logoutEverywhere?: InputMaybe<Scalars['Boolean']['input']>
}>

export type UserLogoutMutation = {
  __typename?: 'Mutation'
  userLogout: boolean
}

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input']
}>

export type RefreshTokenMutation = {
  __typename?: 'Mutation'
  refreshToken: {
    __typename?: 'TUserAuth'
    userUuid: string
    accessToken: string
    refreshToken: string
  }
}

export type UserRegisterMutationVariables = Exact<{
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}>

export type UserRegisterMutation = {
  __typename?: 'Mutation'
  userRegister: {
    __typename?: 'TUserAuth'
    userUuid: string
    accessToken: string
    refreshToken: string
  }
}

export type ListCategoryQueryVariables = Exact<{ [key: string]: never }>

export type ListCategoryQuery = {
  __typename?: 'Query'
  listCategory: Array<{
    __typename?: 'TCategory'
    categoryId: string
    name: string
  }>
}

export type ItemByIdQueryVariables = Exact<{
  itemId: Scalars['String']['input']
}>

export type ItemByIdQuery = {
  __typename?: 'Query'
  itemById: {
    __typename?: 'TItemResponse'
    itemId: string
    name: string
    image: string
    price: number
    description?: string | null
    discountPercent?: number | null
    status?: Array<EItemStatus | null> | null
    categoryName: string
    createdAt: number
    updatedAt: number
    requireOption: Array<{
      __typename?: 'TItemOption'
      group: string
      name: string
      extraPrice?: number | null
    }>
    additionalOption?: Array<{
      __typename?: 'TItemOption'
      group: string
      name: string
      extraPrice?: number | null
    }> | null
  }
}

export type ListItemByCategoryQueryVariables = Exact<{
  categoryName: Scalars['String']['input']
  offset?: InputMaybe<Scalars['Int']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
}>

export type ListItemByCategoryQuery = {
  __typename?: 'Query'
  listItemByCategory: {
    __typename?: 'TListItemResponse'
    offset: number
    limit: number
    total: number
    query: Array<{
      __typename?: 'TQueryBy'
      column?: string | null
      sort?: ESort | null
    } | null>
    records: Array<{
      __typename?: 'TItemResponse'
      itemId: string
      name: string
      image: string
      price: number
      description?: string | null
      discountPercent?: number | null
      status?: Array<EItemStatus | null> | null
      categoryName: string
      createdAt: number
      updatedAt: number
      requireOption: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }>
      additionalOption?: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }> | null
    }>
  }
}

export type ListItemByStatusQueryVariables = Exact<{
  status: Array<InputMaybe<EItemStatus>> | InputMaybe<EItemStatus>
  offset?: InputMaybe<Scalars['Int']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
}>

export type ListItemByStatusQuery = {
  __typename?: 'Query'
  listItemByStatus: {
    __typename?: 'TListItemResponse'
    offset: number
    limit: number
    total: number
    query: Array<{
      __typename?: 'TQueryBy'
      column?: string | null
      sort?: ESort | null
    } | null>
    records: Array<{
      __typename?: 'TItemResponse'
      itemId: string
      name: string
      image: string
      price: number
      description?: string | null
      discountPercent?: number | null
      status?: Array<EItemStatus | null> | null
      categoryName: string
      createdAt: number
      updatedAt: number
      requireOption: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }>
      additionalOption?: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }> | null
    }>
  }
}

export type ListItemQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Array<InputMaybe<QueryByInput>> | InputMaybe<QueryByInput>>
}>

export type ListItemQuery = {
  __typename?: 'Query'
  listItem: {
    __typename?: 'TListItemResponse'
    offset: number
    limit: number
    total: number
    query: Array<{
      __typename?: 'TQueryBy'
      column?: string | null
      sort?: ESort | null
    } | null>
    records: Array<{
      __typename?: 'TItemResponse'
      itemId: string
      name: string
      image: string
      price: number
      description?: string | null
      discountPercent?: number | null
      status?: Array<EItemStatus | null> | null
      categoryName: string
      createdAt: number
      updatedAt: number
      requireOption: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }>
      additionalOption?: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }> | null
    }>
  }
}

export type GetOrderQueryVariables = Exact<{
  orderId: Scalars['String']['input']
}>

export type GetOrderQuery = {
  __typename?: 'Query'
  getOrder: {
    __typename?: 'TOrderResponse'
    orderId: string
    paypalOrderId?: string | null
    totalPrice: number
    paymentMethod: EPaymentMethod
    orderStatus: EOrderStatus
    createdAt: number
    updatedAt: number
    userInfoSnapshot: {
      __typename?: 'TUserInfoSnapshot'
      name?: string | null
      address: string
      phoneNumber: string
      email: string
    }
    items: Array<{
      __typename?: 'TOrderItem'
      name: string
      amount: number
      price: number
      note?: string | null
      discountPercent?: number | null
      selectedOptions: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }>
    } | null>
  }
}

export type ListPaymentHistoryQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>
  limit?: InputMaybe<Scalars['Int']['input']>
  query?: InputMaybe<Array<InputMaybe<QueryByInput>> | InputMaybe<QueryByInput>>
}>

export type ListPaymentHistoryQuery = {
  __typename?: 'Query'
  listPaymentHistory: {
    __typename?: 'TListPaymentResponse'
    offset: number
    limit: number
    total: number
    query: Array<{
      __typename?: 'TQueryBy'
      column?: string | null
      sort?: ESort | null
    } | null>
    records: Array<{
      __typename?: 'TPaymentResponse'
      paymentId: string
      orderId: string
      paymentMethod: EPaymentMethod
      totalPrice: number
      status: EPaymentStatus
      txHash?: string | null
      codTransactionId?: string | null
      createdAt: number
      updatedAt: number
      userInfo: {
        __typename?: 'TUserInfoSnapshot'
        name?: string | null
        address: string
        phoneNumber: string
        email: string
      }
      items: Array<{
        __typename?: 'TOrderItem'
        name: string
        amount: number
        price: number
        note?: string | null
        discountPercent?: number | null
        selectedOptions: Array<{
          __typename?: 'TItemOption'
          group: string
          name: string
          extraPrice?: number | null
        }>
      } | null>
      paypalTransaction?: {
        __typename?: 'TPaypalPayment'
        paypalPayerEmail: string
        paypalCaptureId: string
        payerId: string
        rawResponse?: { [key: string]: unknown } | null
      } | null
    } | null>
  }
}

export type PaymentHistoryQueryVariables = Exact<{
  paymentId: Scalars['String']['input']
}>

export type PaymentHistoryQuery = {
  __typename?: 'Query'
  paymentHistory: {
    __typename?: 'TPaymentResponse'
    paymentId: string
    orderId: string
    paymentMethod: EPaymentMethod
    totalPrice: number
    status: EPaymentStatus
    txHash?: string | null
    codTransactionId?: string | null
    createdAt: number
    updatedAt: number
    userInfo: {
      __typename?: 'TUserInfoSnapshot'
      name?: string | null
      address: string
      phoneNumber: string
      email: string
    }
    items: Array<{
      __typename?: 'TOrderItem'
      name: string
      amount: number
      price: number
      note?: string | null
      discountPercent?: number | null
      selectedOptions: Array<{
        __typename?: 'TItemOption'
        group: string
        name: string
        extraPrice?: number | null
      }>
    } | null>
    paypalTransaction?: {
      __typename?: 'TPaypalPayment'
      paypalPayerEmail: string
      paypalCaptureId: string
      payerId: string
      rawResponse?: { [key: string]: unknown } | null
    } | null
  }
}

export type UserInfoQueryVariables = Exact<{ [key: string]: never }>

export type UserInfoQuery = {
  __typename?: 'Query'
  userInfo: {
    __typename?: 'TUserInfo'
    uuid: string
    email: string
    name?: string | null
    walletAddress?: string | null
    role: ERole
    authMethods: Array<EAuthMethod | null>
    address?: string | null
    phoneNumber?: string | null
  }
}

export const CreateCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'categoryId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
>
export const DeleteCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'categoryId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'categoryId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'categoryId' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteCategoryMutation,
  DeleteCategoryMutationVariables
>
export const UpdateCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'category' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CategoryInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'category' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'category' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'categoryId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables
>
export const CreateItemDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateItemInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'itemId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'discountPercent' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'requireOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'group' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'extraPrice' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'additionalOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'group' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'extraPrice' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categoryName' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateItemMutation, CreateItemMutationVariables>
export const UpdateItemDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateItemInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'itemId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'discountPercent' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'requireOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'group' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'extraPrice' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'additionalOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'group' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'extraPrice' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categoryName' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateItemMutation, UpdateItemMutationVariables>
export const CreateOrderDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateOrder' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateOrderInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createOrder' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'orderId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paypalOrderId' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paypalApproveUrl' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'cryptoPaymentData' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'codPaymentData' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>
export const ConfirmPaymentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ConfirmPayment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'paymentInput' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ConfirmPaymentInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'confirmPayment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paymentInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'paymentInput' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'paymentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orderId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paymentMethod' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalPrice' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'userInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'address' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'phoneNumber' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'note' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'discountPercent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'selectedOptions' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'txHash' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paypalTransaction' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paypalPayerEmail' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paypalCaptureId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'payerId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'rawResponse' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'codTransactionId' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ConfirmPaymentMutation,
  ConfirmPaymentMutationVariables
>
export const UserLoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UserLogin' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'token' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userLogin' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'token' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'password' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'userUuid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserLoginMutation, UserLoginMutationVariables>
export const UserLogoutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UserLogout' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'logoutEverywhere' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userLogout' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'logoutEverywhere' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'logoutEverywhere' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserLogoutMutation, UserLogoutMutationVariables>
export const RefreshTokenDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RefreshToken' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'refreshToken' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'refreshToken' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'refreshToken' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'userUuid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RefreshTokenMutation,
  RefreshTokenMutationVariables
>
export const UserRegisterDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UserRegister' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userRegister' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'password' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'userUuid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UserRegisterMutation,
  UserRegisterMutationVariables
>
export const ListCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListCategory' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listCategory' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'categoryId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListCategoryQuery, ListCategoryQueryVariables>
export const ItemByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ItemById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'itemId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'itemById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'itemId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'itemId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'itemId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'discountPercent' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'requireOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'group' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'extraPrice' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'additionalOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'group' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'extraPrice' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'categoryName' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ItemByIdQuery, ItemByIdQueryVariables>
export const ListItemByCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListItemByCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'categoryName' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'offset' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listItemByCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'categoryName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'categoryName' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'offset' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'offset' } },
                { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'query' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'column' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'sort' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'records' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'itemId' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'discountPercent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'requireOption' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'additionalOption' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'categoryName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListItemByCategoryQuery,
  ListItemByCategoryQueryVariables
>
export const ListItemByStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListItemByStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'status' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'EItemStatus' },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'offset' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listItemByStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'status' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'status' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'offset' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'offset' } },
                { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'query' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'column' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'sort' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'records' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'itemId' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'discountPercent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'requireOption' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'additionalOption' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'categoryName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListItemByStatusQuery,
  ListItemByStatusQueryVariables
>
export const ListItemDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'offset' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'query' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'QueryByInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'offset' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'query' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'query' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'offset' } },
                { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'query' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'column' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'sort' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'records' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'itemId' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'discountPercent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'requireOption' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'additionalOption' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'categoryName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ListItemQuery, ListItemQueryVariables>
export const GetOrderDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetOrder' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'orderId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getOrder' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'orderId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'orderId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paypalOrderId' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'userInfoSnapshot' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'address' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'phoneNumber' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'note' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'discountPercent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'selectedOptions' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalPrice' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paymentMethod' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'orderStatus' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetOrderQuery, GetOrderQueryVariables>
export const ListPaymentHistoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ListPaymentHistory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'offset' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'query' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'QueryByInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'listPaymentHistory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'offset' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'offset' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'query' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'query' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'offset' } },
                { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'query' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'column' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'sort' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'records' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paymentId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'orderId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paymentMethod' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userInfo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'address' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'phoneNumber' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'price' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'note' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountPercent' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'selectedOptions' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'group' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'name' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'extraPrice' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'txHash' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paypalTransaction' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'paypalPayerEmail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'paypalCaptureId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'payerId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'rawResponse' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'codTransactionId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ListPaymentHistoryQuery,
  ListPaymentHistoryQueryVariables
>
export const PaymentHistoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PaymentHistory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'paymentId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'paymentHistory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paymentId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'paymentId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'paymentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orderId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paymentMethod' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalPrice' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'userInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'address' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'phoneNumber' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'note' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'discountPercent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'selectedOptions' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'group' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'extraPrice' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'txHash' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paypalTransaction' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paypalPayerEmail' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'paypalCaptureId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'payerId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'rawResponse' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'codTransactionId' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PaymentHistoryQuery, PaymentHistoryQueryVariables>
export const UserInfoDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UserInfo' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userInfo' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'uuid' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'walletAddress' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                { kind: 'Field', name: { kind: 'Name', value: 'authMethods' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserInfoQuery, UserInfoQueryVariables>
