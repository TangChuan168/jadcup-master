import React, { useState } from 'react'
import CreateTicketColumnModel from './create-ticket-column-model'
import TicketFinalProcessDialog from './ticket-final-process-dialog/ticket-final-process-dialog'
import CommonTablePage from '../../../components/common/common-table/common-table-page'
import CommonDialog from '../../../components/common/others/common-dialog'
import { toLocalDate, toLocalDateTime } from '../../../services/lib/utils/helpers'
import { urlKey } from '../../../services/api/api-urls'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'

const TicketFinalProcessPage = (): any => {
  const [open, setOpen] = useState(false)
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [ticketData, setTicketData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const getRenderData = (data: any) => {
    console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        createdAt1: row.createdAt,
        createdAt: toLocalDateTime(row.createdAt),
        Action: 0,
      })
    })
    return renderData
  }
  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const ticketFinalProcessDialog = <TicketFinalProcessDialog onDialogClose={onDialogClose} ticketData={ticketData}/>
  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Final Process',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        setOpen(true)
        setTicketData(rowData)
        setDialogTitle('Ticket Process')
      }
    },
  ]

  return (
    <>
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={ticketFinalProcessDialog} />
      <CommonTablePage
        urlInfoKey={ urlKey.Ticket }
        title={'Ticket Final Process'}
        actionButtons={actionButtons}
        triggerResetData={triggerResetData}
        column={ CreateTicketColumnModel() }
        isShowSpinnerOnInit={isShowSpinner}
        isNotEditable={true}
        isNotAddable={true}
        mappingRenderData={(data: any) => getRenderData(data)}
        mappingUpdateData={ (dataDetail: any) => {
          return {...dataDetail, }
        } }
      />
    </>
  )
}

export default TicketFinalProcessPage
