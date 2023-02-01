import { commonFormSelect } from "../../../../components/common/common-form/common-form-select";

export default class BoxesEditDialogColumnModel {
	static Column  = [
	  {
	    title: 'Box Bar Code',
	    align: 'left',
	    field: 'barCode'
	  },
		{
			title: 'Product',
			align: 'left',
			field: 'productName'
		},
		{
			title: 'Pallet',
			field: 'plate',
			render: (rowData: any) => rowData.plate?.plateCode
		},
		{
			title: 'Zone - Shelf - Row - Col',
			field: 'locationCode'
		},
		{
			title: 'Is Moved To Cell',
			field: 'isCell',
			lookup: {0: 'No', 1: 'Yes'}
		}
	]

	static groupColumn = [
		{title: 'Group Number', align: 'left', field: 'groupNumber'},
		{title: 'Group Detail', align: 'left', field: 'groupDetail'},
		{title: 'Pallet', field: 'plate', render: (rowData: any) => rowData.plate?.plateCode},
		{title: 'Zone - Shelf - Row - Col', field: 'locationCode'},
		{title: 'Is Moved To Cell', field: 'isCell', lookup: {0: 'No', 1: 'Yes'}},
		{title: 'Group Status', align: 'left', field: 'groupStatus'},
	];
}
