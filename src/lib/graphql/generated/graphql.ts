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

export type Category = {
  __typename?: 'Category'
  categoryId: Scalars['String']['output']
  name: Scalars['String']['output']
}

export type CategoryInput = {
  categoryId: Scalars['String']['input']
  name: Scalars['String']['input']
}

/** Input types */
export type ConfirmPaymentInput = {
  codTransactionId?: InputMaybe<Scalars['String']['input']>
  momoTransactionId?: InputMaybe<Scalars['String']['input']>
  orderId: Scalars['String']['input']
  paymentMethod: EPaymentMethod
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
  categoryId: Scalars['String']['input']
  description?: InputMaybe<Scalars['String']['input']>
  discountPercent?: InputMaybe<Scalars['Float']['input']>
  image: Scalars['String']['input']
  name: Scalars['String']['input']
  price: Scalars['Float']['input']
  requireOption?: InputMaybe<Array<InputMaybe<ItemOptionInput>>>
  status?: InputMaybe<Array<InputMaybe<EItemStatus>>>
}

export type CreateOrderInput = {
  items: Array<InputMaybe<OrderItemInput>>
  paymentMethod: EPaymentMethod
  userId: Scalars['String']['input']
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
  Momo = 'MOMO',
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
  createCategory: Category
  createItem: TItemResponse
  createOrder: TCreateOrderResponse
  deleteCategory?: Maybe<Scalars['Boolean']['output']>
  deleteItem: Scalars['Boolean']['output']
  refreshToken: TUserAuth
  updateCategory: Category
  updateItem: TItemResponse
  userConnectCryptoWallet: TConnectCryptoWalletResponse
  userLogin: TUserAuth
  userLogout: Scalars['Boolean']['output']
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
  token: Scalars['String']['input']
}

export type MutationUserLogoutArgs = {
  logoutEverywhere?: InputMaybe<Scalars['Boolean']['input']>
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
  getItemByCategory: TItemResponse
  getOrder: TOrderResponse
  listAuditLog: Array<TAuditLog>
  listCategory: Array<Maybe<Category>>
  listItem: TListItemResponse
  listPaymentHistory: TListPaymentResponse
  paymentHistory: TPaymentResponse
  userInfo: UserInfo
}

export type QueryGetAuditLogArgs = {
  id: Scalars['String']['input']
}

export type QueryGetItemByCategoryArgs = {
  categoryId: Scalars['String']['input']
}

export type QueryGetOrderArgs = {
  orderId: Scalars['String']['input']
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
  momoPaymentUrl?: Maybe<Scalars['String']['output']>
  momoRequestId?: Maybe<Scalars['String']['output']>
  orderId: Scalars['String']['output']
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
  additionalOption?: Maybe<Array<Maybe<TItemOption>>>
  categoryName: Scalars['String']['output']
  createdAt: Scalars['Timestamp']['output']
  description?: Maybe<Scalars['String']['output']>
  discountPercent?: Maybe<Scalars['Float']['output']>
  image: Scalars['String']['output']
  itemId: Scalars['String']['output']
  name: Scalars['String']['output']
  price: Scalars['Float']['output']
  requireOption?: Maybe<Array<Maybe<TItemOption>>>
  status?: Maybe<Array<Maybe<EItemStatus>>>
  updatedAt: Scalars['Timestamp']['output']
}

export type TListItemResponse = {
  __typename?: 'TListItemResponse'
  limit: Scalars['Int']['output']
  offset: Scalars['Int']['output']
  query: Array<Maybe<TQueryBy>>
  records: Array<Maybe<TItemResponse>>
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
  selectedOptions?: Maybe<Array<Maybe<TItemOption>>>
}

export type TOrderResponse = {
  __typename?: 'TOrderResponse'
  createdAt: Scalars['Timestamp']['output']
  items: Array<Maybe<TOrderItem>>
  orderId: Scalars['String']['output']
  orderStatus: EOrderStatus
  paymentMethod: EPaymentMethod
  totalPrice: Scalars['Int']['output']
  updatedAt: Scalars['Timestamp']['output']
  userInfoSnapshot: TUserInfoSnapshot
}

export type TPaymentResponse = {
  __typename?: 'TPaymentResponse'
  codTransactionId?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Timestamp']['output']
  items: Array<Maybe<TOrderItem>>
  momoTransactionId?: Maybe<Scalars['String']['output']>
  orderId: Scalars['String']['output']
  paymentId: Scalars['String']['output']
  paymentMethod: EPaymentMethod
  status: EPaymentStatus
  totalPrice: Scalars['Float']['output']
  txHash?: Maybe<Scalars['String']['output']>
  updatedAt: Scalars['Timestamp']['output']
  userInfo: TUserInfoSnapshot
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
  categoryId?: InputMaybe<Scalars['String']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  discountPercent?: InputMaybe<Scalars['Float']['input']>
  image?: InputMaybe<Scalars['String']['input']>
  itemId: Scalars['String']['input']
  name?: InputMaybe<Scalars['String']['input']>
  price?: InputMaybe<Scalars['Float']['input']>
  requireOption?: InputMaybe<Array<InputMaybe<ItemOptionInput>>>
  status?: InputMaybe<Array<InputMaybe<EItemStatus>>>
}

export type UserInfo = {
  __typename?: 'UserInfo'
  address?: Maybe<Scalars['String']['output']>
  email: Scalars['String']['output']
  name?: Maybe<Scalars['String']['output']>
  phoneNumber?: Maybe<Scalars['String']['output']>
  role: ERole
  uuid: Scalars['String']['output']
  walletAddress?: Maybe<Scalars['String']['output']>
}

export type UserLoginMutationVariables = Exact<{
  token: Scalars['String']['input']
}>

export type UserLoginMutation = {
  __typename?: 'Mutation'
  userLogin: {
    __typename?: 'TUserAuth'
    accessToken: string
    refreshToken: string
  }
}

export type UserInfoQueryVariables = Exact<{ [key: string]: never }>

export type UserInfoQuery = {
  __typename?: 'Query'
  userInfo: {
    __typename?: 'UserInfo'
    uuid: string
    email: string
    name?: string | null
    walletAddress?: string | null
    role: ERole
    address?: string | null
    phoneNumber?: string | null
  }
}

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
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
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
