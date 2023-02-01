import { getColModelItem } from '../../../../services/lib/utils/helpers'


export default class ContactManagementColumnModel {
    static ContactManagementColumn = [
       {
        title: 'FirstName',
        align: 'left',
        field: 'firstName'
      },
      {
        title: 'LastName',
        align: 'left',
        field: 'lastName'
      },
      {
        title: 'Phone',
        align: 'left',
        field: 'phone'
      },   
      {
        title: 'Mobile',
        align: 'left',
        field: 'mobile'
      }, 
      {
        title: 'Email',
        align: 'left',
        field: 'email'
      },    
      {
        title: 'Notes',
        align: 'left',
        field: 'notes'
      }
    ]
}
