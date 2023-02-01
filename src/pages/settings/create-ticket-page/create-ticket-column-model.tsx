import React from 'react'

const CreateTicketColumnModel = (): any => {
  return [
    // {
    //   title: 'Ticket No',
    //   field: 'ticketId',
    // },
    {
      title: 'Customer',
      field: 'company',
      render: (rowData: any) => rowData.customer.company,
    },
    // {
    //   title: 'Contact Person',
    //   field: 'contectPerson',
    // },
    // {
    //   title: 'Phone',
    //   field: 'phone',
    //   render: (rowData: any) => rowData.customer.phone,
    // },
    // {
    //   title: 'Email',
    //   field: 'email',
    //   render: (rowData: any) => rowData.customer.email,
    // },
		{
			title: 'Created At',
			align: 'left',
			field: 'createdAt1',
			render: (rowData: any) => rowData.createdAt,
		},
    {
      title: 'Ticket Type',
      field: 'ticketType',
      render: (rowData: any) => rowData.ticketTypeNavigation.ticketTypeName,
    },
    {
      title: 'Content',
      field: 'content',
    },
    {
      title: 'Result',
      field: 'result',
    },
    {
      title: 'Ticket Process',
      field: 'ticketProcess',
      render: (rowData: any) => renderProcess(rowData)
    },    
    {
      title: 'Process Status',
      field: 'status',
      render: (rowData: any) => {        
        const {ticketProcess} = rowData
         return ticketProcess.some((tp: any)=> tp.processed === 0 ) ? <div style={{color: 'red'}}>Open</div> : <div style={{color: 'black'}}>Closed</div>
      },
    },
    {
      title: 'Final Status',
      field: 'closed',
      render: (rowData: any) => rowData.closed === 0 ? <div style={{color: 'red'}}>Open</div> : <div style={{color: 'black'}}>Closed</div>
    },
  ]
}
const renderProcess = (rowData: any) => {
  return (
    <div>
      {        
        rowData.ticketProcess.map((row: any) =>
          <div>
            <span style={{color: 'red'}}>
              {row?.assignedEmployee?.firstName + " " + row?.assignedEmployee?.lastName}        
            </span>
             :&nbsp;
            <span style={{color: 'blue'}}>
              { 
                row?.comments ? 
                  row?.comments.length < 16 ?
                  row?.comments 
                  :
                  row?.comments.substring(0, 10) + "..."
                : 
                "No comment"
              }        
            </span>
          </div>
        )
      }
    </div>
  )
}
export default CreateTicketColumnModel
