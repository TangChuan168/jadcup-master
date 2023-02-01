export default class RawMaterialApplicationDetailsManagementColumnModel {
	static Column = [
	  {
	    title: 'Raw material code',
	    align: 'left',
	    field: 'rawMaterialCode'
	  },
	  {
		  title: 'Raw material name',
		  align: 'left',
		  field: 'rawMaterialName'
	  },
	  {
	    title: 'Box Code',
	    align: 'left',
	    field: 'boxCode'
	  },
	  {
	    title: 'Run Out',
	    field: 'runout',
		  defaultFilter: ['0'],
	    lookup: {0: 'No', 1: 'Yes'}
	  },
	]
}
