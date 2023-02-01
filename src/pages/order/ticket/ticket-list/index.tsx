import React, {useEffect, useState} from 'react'
import CommonTable from '../../../../components/common/common-table/common-table'
import {Button} from 'antd'
import {getAllTicket} from '../../../../services/others/ticket-list-services'
import NewTicketModal from './new-ticket'
import {pdfMock} from '../../../../mock/quoationpdfMock'
import invoicePdfGenerate from '../../../static/pdf/invoice/invoice-pdf-generate'
import {invoicePdfMock} from '../../../../mock/invoicepdfMock'
import packingSlipPdfGenerate from '../../../static/pdf/packing-slip/packing-slip-pdf-generate'
import quotationPdfGenerate from '../../../static/pdf/quotation/quotation-pdf-generate'

const TicketList = () => {

  const [data, setData] = useState<any>([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    getAllTicket().then((res:any) => {
      console.log(res.data.data)
      setData(res.data.data)
    })
  }, [])

  const tableColumn = [
    { title: 'Ticket No', field: 'ticketId' },
    { title: 'Customer', field: 'customers' },
    { title: 'Contact Person', field: 'product' },
    { title: 'Ticket Type', field: 'ticketType'},
    { title: 'content', field: 'content' },
    { title: 'Result', field: 'result' },
    { title: 'Process Status', field: 'payment' },
    { title: 'Actions', field: 'actions',
      render: (rowData: any) => {
        // console.log(rowData)
        return (
          <div>
            <Button type="primary">Process</Button>
          </div>
        )
      }},
  ]

  const button: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'New Ticket',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setIsModalVisible(true)
        console.log('111')
      }
    }
  ]
  return (
    <div>
      {/*<Button onClick={()=>quotationPdfGenerate(pdfMock)}> quotation pdf</Button>*/}
      <Button onClick={() => invoicePdfGenerate(invoicePdfMock)}> invoice pdf</Button>
      <Button onClick={() => packingSlipPdfGenerate(invoicePdfMock)}> packing pdf</Button>
      <CommonTable title={'Ticket-List'} actionButtons={button} column={tableColumn} initData={data}/>
      <NewTicketModal visible={isModalVisible} modalCancel={() => setIsModalVisible(false)}/>
    </div>
  )
}

export default TicketList
