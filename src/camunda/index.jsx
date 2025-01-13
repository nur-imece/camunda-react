import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, Routes, Route } from 'react-router-dom';
import TabsContainer from './components/TabsContainer';
import Admin from './components/admin';
import DeploymentList from "./deployment/list";
import User from "./components/user";
import CamundaUser from "./camundaUser";
import UpdateUser from "./camundaUser/components/updateUser";
import CreateUser from "./camundaUser/components/createUser";

const { Sider, Content } = Layout;

const CamundaIndex = () => {
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        navigate(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="light">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['/modeler']}
                    onClick={handleMenuClick}
                    items={[
                        {
                            key: '/modeler',
                            label: 'Modeler',
                        },
                        {
                            key: '/user',
                            label: 'User Panel',
                        },
                        {
                            key: '/admin',
                            label: 'Admin Panel',
                        },
                        {
                            key: '/deployments',
                            label: 'Deployment',
                        },
                        {
                            key: "/camundaUsers",
                            label: 'Camunda Users',
                        }
                    ]}
                />
            </Sider>
            <Content>
                <Routes>
                    <Route path="/modeler" element={<TabsContainer />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/deployments" element={<DeploymentList />} />
                    <Route path="/" element={<TabsContainer />} />
                    <Route path={"/camundaUsers"} element={<CamundaUser />} />
                    <Route path={"/updateUser"} element={<UpdateUser />} />
                    <Route path={"/createUser"} element={<CreateUser />} />

                </Routes>
            </Content>
        </Layout>
    );
};

export default CamundaIndex;
