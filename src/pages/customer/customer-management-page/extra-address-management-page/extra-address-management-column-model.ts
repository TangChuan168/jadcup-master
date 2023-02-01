import { getColModelItem } from '../../../../services/lib/utils/helpers'


export default class ExtraAddressManagementColumnModel {
    static ExtraAddressManagementColumn = [
      {
        ...getColModelItem({
          title: 'Address Name',
          field: 'address',
          keywords: [
            'address'
          ]
        }, () => ([{key: 'address', label: '', otherOptions: {type: 'googleMapAddrSelect', width: '20rem', isNotCutting: true}}]))
      },
      // {
      //   title: 'Postal Code',
      //   align: 'left',
      //   field: 'postalCode'
      // },
      {
        title: 'Delivery Name',
        align: 'left',
        field: 'deliveryName'
      },
      {
        ...getColModelItem({
        title: 'Delivery Method',
        field: 'deliveryMethod',
        keywords: ['deliveryMethod']
        }, () => ([{key: 'deliveryMethod', label: '',
           otherOptions: {type: 'select', rowDataKeyword: 'deliveryMethodId'}}])),
         render: (rowData:any) => rowData?.deliveryMethod ? `${rowData?.deliveryMethod?.deliveryMethodName}` : null,       
      },  
      {
        title: 'Delivery Instruction',
        align: 'left',
        field: 'notes'
      },      
    ]
}
