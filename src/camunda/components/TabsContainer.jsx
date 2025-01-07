import React, { useState, useRef, useCallback } from 'react';
import { Tabs, Button, Dropdown, Modal } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import ModelerComponent from './modelerComponent';
import DeployDiagramComponent from "./deployDiagramComponent";

const TabsContainer = () => {
    const [activeKey, setActiveKey] = useState('1');
    const [items, setItems] = useState([{
        key: '1',
        label: 'New BPMN',
        children: (
            <ModelerComponent 
                key={`modeler-bpmn-1`}
                initialModelType="bpmn" 
                tabId="1"
                onModelerRef={(ref) => {
                    if (ref) {
                        tabRefs.current['1'] = ref;
                    }
                }}
            />
        ),
    }]);
    const newTabIndex = useRef(2);
    const [showDeployDialog, setShowDeployDialog] = useState(false);
    const tabRefs = useRef({});

    const onChange = (key) => {
        setActiveKey(key);
    };

    const handleModelerRef = useCallback((key, ref) => {
        if (ref) {
            tabRefs.current[key] = ref;
        }
    }, []);

    const add = (modelType) => {
        const newKey = newTabIndex.current.toString();
        const newTab = {
            key: newKey,
            label: `New ${modelType.toUpperCase()}`,
            children: (
                <ModelerComponent
                    key={`modeler-${modelType}-${newKey}`}
                    initialModelType={modelType}
                    tabId={newKey}
                    onModelerRef={(ref) => handleModelerRef(newKey, ref)}
                />
            ),
        };
        setItems([...items, newTab]);
        setActiveKey(newKey);
        newTabIndex.current += 1;
    };

    const remove = (targetKey) => {
        const targetIndex = items.findIndex((item) => item.key === targetKey);
        const newItems = items.filter((item) => item.key !== targetKey);
        
        if (newItems.length) {
            if (targetKey === activeKey) {
                const newActiveKey = newItems[targetIndex === newItems.length ? targetIndex - 1 : targetIndex].key;
                setActiveKey(newActiveKey);
            }
        } else {
            setActiveKey('');
        }

        // Cleanup the ref when removing a tab
        if (tabRefs.current[targetKey]) {
            const modeler = tabRefs.current[targetKey];
            if (modeler && typeof modeler.destroy === 'function') {
                modeler.destroy();
            }
            delete tabRefs.current[targetKey];
        }
        
        setItems(newItems);
    };

    const onEdit = (targetKey, action) => {
        if (action === 'remove') {
            remove(targetKey);
        }
    };

    const menuItems = [
        {
            key: 'bpmn',
            label: 'BPMN',
        },
        {
            key: 'dmn',
            label: 'DMN',
        },
        {
            key: 'form',
            label: 'Form',
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Dropdown
                    menu={{
                        items: menuItems,
                        onClick: ({ key }) => add(key),
                    }}
                >
                    <Button icon={<PlusOutlined />}>
                        New <DownOutlined />
                    </Button>
                </Dropdown>
                <Button type="primary" onClick={() => setShowDeployDialog(true)}>
                    Deploy
                </Button>
            </div>
            <Tabs
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={items}
                style={{ background: '#fff' }}
                addIcon={null}
                hideAdd={true}
            />

            <Modal
                title="Deploy Diagram"
                open={showDeployDialog}
                onCancel={() => setShowDeployDialog(false)}
                footer={null}
                width={800}
            >
                <DeployDiagramComponent />
            </Modal>
        </div>
    );
};

export default TabsContainer; 