import React, { useState, useEffect } from 'react'
import { ApiRequest } from '../../../services/api/api'
import './role-page-mapping-style.css'
import { Tabs, Card, Checkbox, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export const RolePageMappingManagementPage = () => {
  const [allRoleData, setAllRoleData] = useState([{roleId: 0, roleName: ''}])
  const [allPageData, setAllPageData] = useState([{groupId: 0, groupName: '', page: [{pageId: 0, pageName: ''}]}])
  const [allRolePageMapping, setAllRolePageMapping] = useState<any>([])
  const [tabnum, setTabnum] = useState(1)
  useEffect(() => {
    ApiRequest({
      isNotShowSpinnerOverride: true,
      url: 'RolePageMapping/GetAllRolePageMapping',
    }).then((res) => {
      setAllRolePageMapping(res.data.data)
      ApiRequest({
        isNotShowSpinnerOverride: true,
        url: 'Role/GetAllRole',
      }).then((res) => {
        setAllRoleData(res.data.data)
      })
      ApiRequest({
        isNotShowSpinnerOverride: true,
        url: 'PageGroup/GetAllPageGroup',
      }).then((res) => {
        setAllPageData(res.data.data)
      })
    })
  }, [])

  const { TabPane } = Tabs

  function callback(key: any) {
    setTabnum(key)
  }

  function change(pageId: any, roleId : any, e:any) {
    if (e.target.checked === true) {
      ApiRequest({
        url: 'RolePageMapping/AddRolePageMapping',
        method: 'post',
        data: {
          roleId: roleId,
          pageId: pageId,
        },
        isNotShowSpinnerOverride: true,
      })

    } else {
      sendDelete()
    }
    function sendDelete() {
      ApiRequest({
        url: 'RolePageMapping/GetAllRolePageMapping',
        isNotShowSpinnerOverride: true,
      }).then((res) => {
        setAllRolePageMapping(res.data.data)
        const item = res.data.data.find((item: { roleId: any; pageId: any }) => item.roleId === roleId && item.pageId === pageId)
        const mappingID = item?.mappingId
        ApiRequest({
          url: 'RolePageMapping/DeleteRolePageMapping?id=' + mappingID,
          method: 'delete',
          isNotShowSpinnerOverride: true,
        })
      })
    }

  }
  function checkDefaultValue (pageId : any, roleId:any) : any {
    let i
    for (i = 0; i < allRolePageMapping.length; i++) {
      if (roleId === allRolePageMapping[i].roleId && pageId === allRolePageMapping[i].pageId) {
        return true
      }
    }
    return false
  }
  return (
    <div >
      <h1 >Admin User Authorisation</h1>
      <div className="main-container">
        <Tabs
          activeKey={tabnum.toString()}
          onChange={callback}>
          {allRoleData.map(role => (
            <TabPane tab={role.roleName} key={role.roleId.toString()}>
              <div>
                <Row gutter={[16, 24]}>
                  {allPageData.map(pages => (
                    <Col span={8} key={pages.groupId}>
                      <Card type="inner" title={pages.groupName}>
                        {pages.page.map(page => (
                          <div key = {page.pageId}>
                            <Checkbox
                              defaultChecked={checkDefaultValue(page.pageId, role.roleId)}
                              // defaultChecked={checkDefaultValue(page.pageId, role.roleId)}
                              onChange={(e) => change(page.pageId, role.roleId, e)}
                            >{page.pageName}</Checkbox>
                          </div>
                        ))}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </TabPane>
          ))
          }
        </Tabs>
      </div>

    </div>
  )
}

export default RolePageMappingManagementPage
