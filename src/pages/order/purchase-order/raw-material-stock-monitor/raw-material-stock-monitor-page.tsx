import React, { useState ,useEffect} from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import RawMaterialStockMonitorColumnModel from './raw-material-stock-monitor-column-model'
import CommonDialog from '../../../../components/common/others/common-dialog'
import { getRandomKey } from '../../../../services/lib/utils/helpers'
import PurchaseOrderDialog from '../purchase-order-page/purchase-order-dialog/purchase-order-dialog'

const RawMaterialStockMonitorPage = () => {
  const [open, setOpen] = useState(false)
  const [triggerResetData, setTriggerResetData] = useState<any>(false)

  const onDialogClose = () => {
    setOpen(false)
    setTriggerResetData(getRandomKey())
  }
  useEffect(() => {
   document.title = "RM Inventory";
  }, [])

  const [dialogContent, setDialogContent] = useState(<PurchaseOrderDialog isNewOrder={true} onDialogClose={onDialogClose} orderData={{}} />)

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add new order',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
      }
    }
  ]

  const getRenderData = (data: any) => {
    console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        low: row.low ? 1 : 0,
      })
    })
    console.log(renderData)
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: '',
    getAllUrl: 'RawMaterialStock/GetRawMaterialStock',
    title: 'Purchase Stock Monitor',
    column: RawMaterialStockMonitorColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    actionButtons: actionButtons,
    triggerResetData: triggerResetData,
    isNotEditable: true,
    isNotDeletable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: true
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog
        title={'New Purchase Order'}
        open={open}
        onDialogClose={onDialogClose}
        dialogContent={dialogContent}
      />
    </div>
  )
}

export default RawMaterialStockMonitorPage
