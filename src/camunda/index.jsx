import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, Routes, Route } from 'react-router-dom';
import TabsContainer from './components/TabsContainer';
import CamundaUser from './components/camundaUser';
import CamundaAdmin from './components/camundaAdmin';

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
                    ]}
                />
            </Sider>
            <Content>
                <Routes>
                    <Route path="/modeler" element={<TabsContainer />} />
                    <Route path="/user" element={<CamundaUser />} />
                    <Route path="/admin" element={<CamundaAdmin />} />
                    <Route path="/" element={<TabsContainer />} />
                </Routes>
            </Content>
        </Layout>
    );
};

export default CamundaIndex;
