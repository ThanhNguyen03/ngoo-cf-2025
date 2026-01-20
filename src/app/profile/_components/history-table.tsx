import { SkeletonLoader } from '@/components/ui'
import {
  Filter,
  SortingStatusButton,
  SortingTableHeader,
  Table,
  TTableColumn,
} from '@/components/ui/table'
import { DEFAULT_PAGINATION } from '@/constants'
import {
  EPaymentMethod,
  EPaymentStatus,
  ListUserPaymentHistoryDocument,
  TUserPaymentResponse,
} from '@/lib/graphql/generated/graphql'
import { TListStatus, TPagination } from '@/types'
import { cn, filterNonNull } from '@/utils'
import { useQuery } from '@apollo/client/react'
import {
  CurrencyEthIcon,
  MoneyWavyIcon,
  PaypalLogoIcon,
} from '@phosphor-icons/react/dist/ssr'
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'

const PAYMENT_STATUS_CLASSES: Record<EPaymentStatus, string> = {
  [EPaymentStatus.Processing]:
    'bg-yellow-75 border border-yellow-400/10 text-yellow-400',
  [EPaymentStatus.Success]:
    'bg-green-100 border border-green-500/10 text-green-600',
  [EPaymentStatus.Failed]: 'bg-red-100 text-red-500 border border-red-500/10',
  [EPaymentStatus.Cancelled]:
    'bg-pink-100 text-pink-500 border border-pink-500/10',
}

const PAYMENT_ICON: Record<EPaymentMethod, React.ReactNode> = {
  [EPaymentMethod.Crypto]: (
    <CurrencyEthIcon size={24} fill='#8A2BE2' weight='duotone' />
  ),
  [EPaymentMethod.Paypal]: (
    <PaypalLogoIcon size={24} fill='#003087' weight='duotone' />
  ),
  [EPaymentMethod.Cod]: (
    <MoneyWavyIcon size={24} fill='#228B22' weight='duotone' />
  ),
}

type TPaymentHistoryProps = {
  data: TUserPaymentResponse[]
}
const PaymentHistoryTable: FC<TPaymentHistoryProps> = ({ data }) => {
  const [selectedStatus, setSelectedStatus] =
    useState<TListStatus<EPaymentStatus>>('Status')
  const [filtedData, setFiltedData] = useState<TUserPaymentResponse[]>(data)
  const [sortingKey, setSortingKey] = useState<keyof TUserPaymentResponse>()

  useEffect(() => {
    setFiltedData(
      selectedStatus !== 'Status'
        ? data.filter((item) => item.status === selectedStatus)
        : data,
    )
  }, [selectedStatus, data])

  const listStatus: TListStatus<EPaymentStatus>[] = [
    'Status',
    ...Object.values(EPaymentStatus),
  ]

  const column: TTableColumn<TUserPaymentResponse>[] = [
    {
      title: '',
      key: '__typename',
      width: 10,
      cellRender: (row) => (
        <div className='center text-left'>
          {PAYMENT_ICON[row.paymentMethod]}
        </div>
      ),
    },
    {
      title: '',
      key: 'status',
      headerRender: () => (
        <SortingStatusButton<EPaymentStatus>
          selectedStatus={selectedStatus}
          listStatus={listStatus}
          setSelectedStatus={setSelectedStatus}
          listStatusClass={PAYMENT_STATUS_CLASSES}
        />
      ),
      cellRender: (row) => (
        <span
          className={cn(
            'text-14! rounded px-2.5 py-1 leading-[160%] font-semibold !capitalize',
            PAYMENT_STATUS_CLASSES[row.status],
          )}
        >
          {row.status}
        </span>
      ),
    },
    {
      title: 'Payment ID',
      key: 'paymentId',
      cellRender: (row) => (
        <button className='w-20 cursor-pointer truncate leading-none group-hover:font-semibold group-hover:underline'>
          {row.paymentId}
        </button>
      ),
    },
    {
      title: '',
      headerRender: (column) => (
        <SortingTableHeader
          label='Total Price'
          columnKey={column.key}
          data={filtedData}
          handleSortData={(data) => {
            setFiltedData(data)
            setSortingKey(column.key)
          }}
          isSorting={sortingKey === column.key}
        />
      ),
      key: 'totalPrice',
      cellRender: (item) => (
        <p className='text-16 font-semibold'>{item.totalPrice}$</p>
      ),
    },
    {
      title: '',
      headerRender: (column) => (
        <SortingTableHeader
          label='Invoice date'
          columnKey={column.key}
          data={filtedData}
          handleSortData={(data) => {
            setFiltedData(data)
            setSortingKey(column.key)
          }}
          isSorting={sortingKey === column.key}
        />
      ),
      key: 'updatedAt',
      cellRender: (row) => (
        <div className='w-fit'>{dayjs(row.updatedAt).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      title: 'Type',
      key: 'paymentMethod',
      cellRender: (row) => (
        <p className='w-fit font-bold'>{row.paymentMethod}</p>
      ),
    },
  ]

  return <Table columns={column} data={data} />
}

export const HistoryTable = () => {
  const [history, setHistory] = useState<TUserPaymentResponse[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const [pagination, setPagination] = useState<TPagination>(DEFAULT_PAGINATION)

  const { data } = useQuery(ListUserPaymentHistoryDocument, {
    variables: {
      limit: pagination.limit,
      offset: pagination.offset,
    },
  })

  useEffect(() => {
    if (data) {
      setHistory(filterNonNull(data.listUserPaymentHistory.records))
      setTotal(data.listUserPaymentHistory.total)
      setLoading(false)
    }
  }, [data])

  return (
    <div className='flex w-full flex-col items-start gap-10'>
      <h3 className='text-23 text-secondary-500 font-bold'>Payment History</h3>
      <div className='flex w-full flex-col gap-4 pb-10'>
        <Filter
          setLoadingData={setLoading}
          totalPageList={total}
          pagination={pagination}
          setPagination={setPagination}
        />

        <SkeletonLoader loading={loading} className='min-h-60'>
          <PaymentHistoryTable data={history} />
        </SkeletonLoader>
      </div>
    </div>
  )
}
