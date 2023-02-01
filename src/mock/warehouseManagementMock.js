const data = [
  {
    zone: 'Zone A',
    zoneData: [
      {
        id: 0,
        title: '公司A',
        mat_id: 0,
        name: '材料A'
      },
      {
        id: 1,
        title: '公司B',
        mat_id: 0,
        name: '材料A'
      },
      {
        id: 2,
        title: '公司C',
        mat_id: 0,
        name: '材料A'
      },
      {
        id: 3,
        title: '公司D',
        mat_id: 1,
        name: '材料B'
      }
    ]
  },
  {
    zone: 'Zone B',
    zoneData: [
      {
        id: 4,
        title: '公司E',
        mat_id: 2,
        name: '材料C'
      },
      {
        id: 5,
        title: '公司F',
        mat_id: 2,
        name: '材料C'
      },
      {
        id: 6,
        title: '公司G',
        mat_id: 1,
        name: '材料B'
      },
      {
        id: 7,
        title: '公司H',
        mat_id: 2,
        name: '材料C'
      }
    ]
  },
  {
    zone: 'Zone C',
    zoneData: [
      {
        id: 8,
        title: '公司1',
        mat_id: 2,
        name: '材料C'
      },
      {
        id: 9,
        title: '公司2',
        mat_id: 2,
        name: '材料C'
      },
      {
        id: 10,
        title: '公司3',
        mat_id: 1,
        name: '材料B'
      },
      {
        id: 11,
        title: '公司4',
        mat_id: 2,
        name: '材料C'
      },
      {
        id: 11,
        title: '公司4',
        mat_id: 2,
        name: '材料C'
      }
    ]
  },
  {
    zone: 'Zone C',
    zoneData: [
      {
        id: 8,
        title: '公司1',
        mat_id: 2,
        name: '材料C'
      },
      {
        id: 9,
        title: '公司2',
        mat_id: 2,
        name: '材料C'
      },
      {
        id: 10,
        title: '公司3',
        mat_id: 1,
        name: '材料B'
      },
      {
        id: 11,
        title: '公司4',
        mat_id: 2,
        name: '材料C'
      }
    ]
  },
]

const treeSelect = [
  {
    id: 0,

  }
]

export const managementData = () => {
  return data.filter(g => g)
}
