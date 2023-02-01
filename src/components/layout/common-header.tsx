import React, { useEffect, useState } from 'react'
import { Menu, Button, Dropdown } from 'antd'
import { AppstoreOutlined, UserOutlined, DownOutlined, LockOutlined } from '@ant-design/icons'
import { getName, logout } from '../../services/lib/utils/auth.utils'
import { Link, useHistory, useLocation} from 'react-router-dom'
import './style.css'
import SweetAlertService from '../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../services/api/api'
import { getCookie } from 'react-use-cookie'
import Headroom from 'react-headroom'
// import Pic from './JADCUPLOGO2.svg';
// import Pic2 from '../../../public/

const { SubMenu } = Menu

function CommonHeader() {
  const history = useHistory()
  const location = useLocation()
  const [current, setCurrent] = useState('mail')
  const [userRoutes, setUserRoutes] = useState<any>([])

  useEffect(() => {
    let isCancelled = false
    let allRoutes: any = []
    const pages: any = localStorage.getItem('pages')
    // console.log(JSON.parse(pages))
    const vfsFonts = import("pdfmake/build/vfs_fonts"); 
    
    const a = (JSON.parse(pages) || []).map((row: any) => {
      if (!allRoutes.filter((item: any) => item.groupId === row.groupId)[0]) {
        allRoutes.push({
          ...row,
          pages: [row]
        })
      } else {
        allRoutes = allRoutes.map((item: any) => item.groupId === row.groupId ? ({...item, pages: [...item.pages, row]}) : item)
      }
    })
    // console.log(allRoutes)
    if (!isCancelled) {
      const userRouters = allRoutes.sort((a: any, b: any) => a.group.sortingOrder - b.group.sortingOrder).map((row: any) => ({
        title: row.group.groupName,
        drop: true,
        accessLevel: 1,
        icon: <AppstoreOutlined />,
        inter: row.pages.sort((a: any, b: any) => a.sortingOrder - b.sortingOrder).map((item: any) => ({
          title: item.pageName,
          path: item.pageUrl,
          accessLevel: 2,
        }))
      }))
      // console.log(userRouters)
      setUserRoutes(userRouters)
    }
    return () => {
      isCancelled = true
    }
  }, [location.pathname,current])

 const onMenuClick = (item:any)=>{
  //  console.log(item);
   setCurrent(item.key)
 }
  const profileMenu = (
    
    <Menu >
      <Menu.Item key="1" icon={<LockOutlined />} onClick={async () => {
        const result = await SweetAlertService.inputConfirm({
          type: 'text',
          title: 'New Password',
          defaultValue: '',
          placeholder: ' '
        })
        if (result) {
          ApiRequest({
            url: 'Employee/ResetPassword?employeeId=' + getCookie('id') + '&newPassword=' + result,
            method: 'put'
          }).then(async _ => {
            await SweetAlertService.successMessage()
            logout(() => history.push('/'))
            sessionStorage.removeItem('token')
          })
        }
      }}>
        Change Password
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />} onClick={() => {
        logout(() => history.push('/'))
        sessionStorage.removeItem('token')
      }}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <Headroom>
      <div style={{display: 'flex', boxShadow: '0 0 10px 0 rgba(0,0,0,0.5)', height: '3rem', width: '100%', position: 'sticky', top: 0, zIndex: 20, background: 'white'}}>
        <div style={{width: '15%', borderBottom: '1px solid #F7F7F7', textAlign: 'center', lineHeight: '47px', backgroundColor: 'white'}} onClick={() => history.push('/home')}>
          <img src="https://storage.googleapis.com/neptune_media/a9140096-6268-4d69-90be-67a8947d6f6c" style={{height: '40px', cursor: 'pointer'}} />
        </div>
        <div style={{width: '70%'}}>
        {/* openKeys={[current]} subMenuCloseDelay={0.5} */}
          <Menu  triggerSubMenuAction={'click'}  mode="horizontal" style={{textAlign: 'center', color: 'rgb(109,140,125)'}}>
            {userRoutes.map((item: any) => {
              if (item.drop) {
                return (
                  <SubMenu onTitleClick = {onMenuClick} key={item.title} title={item.title} icon={item.icon} >
                    {item.inter.map((item2: any) => {
                      if (item2.path && item2.title) {
                        return (<Menu.Item  key={item2.title} style={{color: 'rgb(109,140,125)'}}><Link to={item2.path} >{item2.title}</Link></Menu.Item>)
                      }
                    })}
                  </SubMenu>
                )
              }
              return (
                <SubMenu onTitleClick = {onMenuClick} key={item.title} title={item.title} icon={item.icon} >
                  {item.inter.map((item2: any) => {
                    console.log("item2.path", item2.path);
                    console.log("item2.title", item2.title);
                    console.log("item.title", item.title);
                    
                    if (item2.path && item2.title) {
                      return (<Menu.Item key={item2.title} style={{color: 'rgb(109,140,125)'}}>
                        <Link to={item2.path} >{item2.title}</Link>
                        </Menu.Item>)
                    }
                  })}
                </SubMenu>
// =======
//                 <Menu.Item key={item.title} className="hyp" icon={item.icon}>
//                   <a href={item.path}>{item.title}</a>
//                 </Menu.Item>
// >>>>>>> 9594d5c4a632baa4b093dd192678ea4e2291266e
              )
            })}
          </Menu>
        </div>
        <div style={{borderBottom: '1px solid #F7F7F7', lineHeight: '48px', backgroundColor: 'white'}}>
          <Dropdown overlay={profileMenu}>
            <Button style={{color: 'rgb(109,140,125)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
              Hi, {getName()}
              <DownOutlined/>
            </Button>
          </Dropdown>
        </div>
      </div>
    </Headroom>
  )
}

export default CommonHeader
