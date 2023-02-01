import React, { useState } from 'react'
import CreateTicketColumnModel from './create-ticket-column-model'
import CreateTicketDialog from './create-ticket-dialog/create-ticket-dialog'
// import ReturnItemDialog from './return-item-dialog/return-item-dialog'
import CommonTablePage from '../../../components/common/common-table/common-table-page'
import CommonDialog from '../../../components/common/others/common-dialog'
import { toLocalDate, toLocalDateTime } from '../../../services/lib/utils/helpers'
import { getCookie } from 'react-use-cookie'
import { urlKey } from '../../../services/api/api-urls'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'

const CreateTicketPage = (props: {isAdmin: boolean, title: any}): any => {
  const userId = parseInt(getCookie('id'))
  const [open, setOpen] = useState(false)
  // const [open2, setOpen2] = useState(false)
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [isNewTicket, setIsNewTicket] = useState(false)
  const [ticketData, setTicketData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const getRenderData = (data: any) => {
    console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      const rp =
      {
        ...row,
        createdAt1: row.createdAt,
        createdAt: toLocalDateTime(row.createdAt),
        Action: 0,
      }
      // if(true) renderData.push(rp)
      if (props.isAdmin) {
        renderData.push(rp)
      } else {
        if (rp.ticketProcess.some((x:any) => x.assignedEmployeeId === userId)) {
          renderData.push(rp)
        }
      }
    })
    return renderData
  }
  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    // setOpen2(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const createTicketDialog = <CreateTicketDialog isAdmin={props.isAdmin} onDialogClose={onDialogClose} isNewTicket={isNewTicket} ticketData={ticketData}/>
  // const returnItemDialog = <ReturnItemDialog onDialogClose={onDialogClose} ticketData={ticketData}/>
  const checkProcess = (rowData: any) => {
    const {ticketProcess} = rowData
    if (rowData.closed === 1 || !ticketProcess.some((tp: any) => tp.processed === 0)) {
      return 'Process terminated'
    }
    if (!ticketProcess.some((tp: any) => tp.processed === 0 && tp.assignedEmployeeId === userId)) {
      return 'Process assigned by other employee'
    }
    return false
  }
  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Process',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        const check = checkProcess(rowData)
        if (!check || props.isAdmin) {
          setOpen(true)
          setTicketData(rowData)
          setDialogTitle('Ticket Process')
          setIsNewTicket(false)
        } else {
          await SweetAlertService.errorMessage(check)
        }
      }
    },
    // {
    //   icon: '', //Button attr of Ant design (danger, ghost)
    //   tooltip: 'Return Item',
    //   isFreeAction: false,
    //   onClick: async (event: any, rowData: any) => {
    //     if(checkProcess(rowData)) {
    //       setOpen2(true)
    //       setTicketData(rowData)
    //       setDialogTitle('Return Item')
    //     }
    //     else {
    //       await SweetAlertService.errorMessage('Process Terminated')
    //     }
    //   }
    // },
  ]
  if (props.isAdmin) {
    actionButtons.push(
      {
        icon: '', //Button attr of Ant design (danger, ghost)
        tooltip: 'Create Ticket',
        isFreeAction: true,
        onClick: (event: any, rowData: any) => {
          setOpen(true)
          setTicketData({})
          setDialogTitle('Create Ticket')
          setIsNewTicket(true)
        }
      })
  }
  return (
    <>
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={createTicketDialog} />
      {/* <CommonDialog title={"Return Item"} open={open2} onDialogClose={onDialogClose} dialogContent={returnItemDialog} /> */}
      <CommonTablePage
        urlInfoKey={ urlKey.Ticket }
        title={props.title}
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

export default CreateTicketPage
