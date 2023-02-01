import React, {useEffect, useState} from 'react'
import {Modal} from 'antd'
import {getSuborderByDateRequest} from '../../../../services/others/test-services'
import { ApiRequest } from '../../../../services/api/api'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { Notice } from '../../../../components/common/others/common-promo-bar'
import {baseUrl} from '../../../../services/api/base-url'

const styles = {
  label: {
    // height: 30,
    width: 150,
    backgroundColor: 'white',
  },
  box: {
    height: 260,
    width: 180,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 600,
    borderTop: '1px solid rgba(198, 198, 198, 1)',
    fontSize: 20,
  },
  particularBox: {
    minHeight: 70,
    width: 150,
  }

}

const ProductionDashboard = () => {
  const [machines, setMachines] = useState<any[]>([])
  const [notifyMessages, setNotifyMessages] = useState<any>()
  const groupNums = 8
  let pages = 1
  let inter: any
  let inter2: any
  const [presentationMachines, setPresentationMachines] = useState<any[]>([])
  const machinesCurrent: any = React.useRef()

  useEffect(() => {
    machinesCurrent.current = machines
  }, [machines])

  useEffect(() => {
    document.title = "Task Dashboard";
  }, [])

  useEffect(() => {
    getSuborderByDateRequest(true)
      .then((res:any) => {
        console.log(res.data.data)
        setMachines(res.data.data)
        // setPresentationMachines(res.data.data)
        setPresentationMachines(((machinesCurrent.current.length && machinesCurrent.current) || res.data.data).slice(0, groupNums))
        inter2 = setInterval(() => {
          const showingIndexAtFirst = (pages % Math.ceil(machinesCurrent.current.length / groupNums)) * groupNums
          let mas = machinesCurrent.current.slice(showingIndexAtFirst, showingIndexAtFirst + groupNums)
          if (mas.length < groupNums) {
            mas = machinesCurrent.current.slice(machinesCurrent.current.length - groupNums)
          }
          setPresentationMachines(mas)
          pages++
        }, 15000)
      })
    ApiRequest({
      // urlInfoKey: urlKey.Notification,
      // type: urlType.Get,
      // dataId: 1,
      url: baseUrl + 'Notification/GetByRole?roleId=1',
      method: 'get'
    }).then((res: any) => {
      setNotifyMessages(
        res.data.data
          .filter((row: any) => row.isActive)
          .reduce((a: any, c: any) => a + c.notificationContext + '\u00a0'.repeat(25), '')
          .slice(0, -25)
      )
    })
    inter = setInterval(() => {
      getSuborderByDateRequest(false)
        .then((res:any) => {
          setMachines(res.data.data)
        })
      ApiRequest({
        url: baseUrl + 'Notification/GetByRole?roleId=1',
        method: 'get'
      }).then((res: any) => {
        setNotifyMessages(res.data.data.reduce((a: any, c: any) => a + c.notificationContext + '\u00a0'.repeat(25), ''))
      })
    }, 30000)

    return () => {
      clearInterval(inter)
      clearInterval(inter2)
    }
  }, [])

  return (
    <div>
      {/*<h2 style={{margin: 0, fontWeight: 900}}>JOBS BOARD</h2>*/}
      <div>
        <Notice value={notifyMessages} />
      </div>
      <div style={{display: 'flex', flexDirection: 'row'}} >
        <div style={{ border: '0px solid rgba(198, 198, 198, 1)'}}>
          <div style={ {
            borderRadius: '1rem',
            padding: '0.5rem',
            backgroundColor: 'white',
            color: 'white',
            textAlign: 'center',
            fontSize: '1rem',
            margin: '0.3rem'
          } }>1</div>
          <div style={{...styles.box, backgroundColor: '#eafdff', color: '#3fa9f6'}}>Processing</div>
          <div style={{...styles.box, height: 260, backgroundColor: 'white', color: '#14cc79'}}>Work In Progress</div>
          {/*<div style={{...styles.box, minHeight: 100, backgroundColor: 'white', color: '#14cc79'}}>Work In Process</div>*/}
          <div style={{...styles.box, backgroundColor: '#eafdff'}}><div>Completed</div></div>

          {/*<div style={{...styles.box, color: '#ff3749'}}>Pending</div>*/}
        </div>
        <Charts machines={presentationMachines}/>
      </div>
    </div>
  )
}

const Charts = (props:{machines:any}) => {

  return (
    <div style={ {display: 'flex'} }>
      { props.machines.map((res: any, index: any) => {
        const completeArray: any = []
        const doingArray: any = []
        const waitingArray: any = []
        const notReadyArray: any = []
        res.suborder.map((data: any) => {
          if (data.suborderStatus.suborderStatusId === 9 || data.suborderStatus.suborderStatusId === 10) {
            completeArray.push(data)
          }
          if (data.suborderStatus.suborderStatusId === 2 || data.suborderStatus.suborderStatusId === 3) {
            doingArray.push(data)
          }
          if (data.suborderStatus.suborderStatusId === 1) {
            waitingArray.push(data)
          }
          if (data.suborderStatus.suborderStatusId === 4) {
            notReadyArray.push(data)
          }
        })
        // console.log(completeArray.slice(0, 3))
        return (
          <div key={ index } style={ {border: '0px rgba(198, 198, 198, 1)', borderStyle: 'solid solid solid none'} }>
            <div style={ {
              borderRadius: '1rem',
              padding: '0.5rem',
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center',
              fontSize: '1rem',
              margin: '0.3rem'
            } }>
              <b>{ res.machine.machineName }{ res.machine?.maintenance === 1 && (
                <span style={ {color: 'red'} }><b> (M)</b></span>) }</b>
            </div>
            <Boxes data={ doingArray } backgroundColor="#d1d1d1" status={ 'doing' } atLeastShow={ 3 }/>
            <Boxes data={ waitingArray } backgroundColor="#14cc79" status={ 'waiting' } atLeastShow={ 3 }/>
            <Boxes data={ completeArray } backgroundColor="#3fa9f6" status={ 'complete' } atLeastShow={ 3 }/>
            {/*<Boxes data={ notReadyArray } backgroundColor="#ff3749" status={ 'Not Ready' } atLeastShow={ 3 }/>*/}
          </div>
        )
      }) }

    </div>
  )
}

const Boxes = (props:{data:any, status:string, atLeastShow:number, backgroundColor: any}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const {data, status} = props
  let styles:any = {minHeight: 250, width: 200, padding: '5px 5px', textAlign: 'center', borderTop: '1px solid rgba(198, 198, 198, 1)', fontSize: '0.9rem'}
  if (status === 'complete') {
    styles = {...styles, minHeight: 260, backgroundColor: 'white'}
  }
  if (status === 'doing') {
    // styles = {...styles, minHeight: 100, }
    styles = {...styles, minHeight: 260}
  }
  if (status === 'waiting') {
    styles = {...styles, minHeight: 260, backgroundColor: '#eafdff'}
  }
  // if (status === 'Not Ready') {
  //   styles = {...styles}
  // }
  // if (status === 'pending') {
  //   styles = {...styles}
  // }

  return (
    <>
      <div style={styles}>
        {data.slice(0, props.atLeastShow).map((res: any, index:number) => {
          return (
            <div style={{padding: '0.5rem', borderRadius: '1rem', marginBottom: '5px', cursor: 'pointer', backgroundColor: props.backgroundColor}} key={index}>
              {/* <div style={{float: 'left'}}>
                <img src={res.workOrder.product?.images && JSON.parse(res.workOrder.product?.images?.split('---')[0]).url} width={30} height={30}/>
              </div> */}
              <div>
                <div>{res.workOrder.product.productCode?.slice(0, 20)}</div>
                <div>{res.orginalQuantity} / {res.receivedQuantity} / {res.completedQuantity}</div>
              </div>
            </div>
          )
        })
        }
        {data.length > props.atLeastShow && <div style={{cursor: 'pointer'}} onClick={() => setIsModalVisible(true)}>Total {props.data.length}...</div>}
      </div>
      <Modal centered={true} title="Basic Modal" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => setIsModalVisible(false)}>
        <div style={{height: '600px', overflow: 'scroll'}}>
          {data.map((res: any, index:number) => {
            // console.log(res, '123')
            return (
              <div key={index} style={{padding: '0.5rem', borderRadius: '1rem', lineHeight: '40px', cursor: 'pointer', width: '400px', margin: '5px auto', textAlign: 'center', backgroundColor: props.backgroundColor}}>
                <div style={{float: 'left'}}>
                  <img src={res.workOrder.product?.images && JSON.parse(res.workOrder.product?.images?.split('---')[0]).url} width={30} height={30}/>
                </div>
                {res.workOrder.product.productCode} - {res.orginalQuantity}
              </div>
            )
          })
          }
        </div>
      </Modal>

    </>
  )
}

export default ProductionDashboard
