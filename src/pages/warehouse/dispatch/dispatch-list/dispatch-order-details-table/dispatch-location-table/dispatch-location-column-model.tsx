export const DispatchLocationColumnModel = (props: any) => {
  return [
    {
      title: 'Zone - Shelf - Row - Col',
      field: 'locationCode'
    },
    {
      title: 'Bar Code',
      field: 'barCode'
    },
    {
      title: 'Quantity',
      field: 'quantity'
    },
    {
      title: 'handle',
      field: 'changeQuantity',
      render: (rowData: any) => props.changeQtyButton(rowData)
    },
  ]
}
